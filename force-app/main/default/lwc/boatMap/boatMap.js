import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const LONGITUDE_FIELD ='Boat__c.Geolocation__Longitude__s';
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];
export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  @api boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  error = undefined;
  @track mapMarkers;

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;


  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord({ error, data }) {
    if (data) {
      this.error = undefined;
      
      const longitude = data.fields.Geolocation__Longitude__s.value;;

      const latitude = data.fields.Geolocation__Latitude__s.value;;
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  subscription = null;
  
  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    if (!this.subscription) {
      this.subscription = subscribe(
          this.messageContext,
          BOATMC,
          (message) => {this.boatId = message.recordId},
          { scope: APPLICATION_SCOPE }
      );
    }
  }
  
  // Calls subscribeMC()
  connectedCallback() { 
    this.subscribeMC();
  }
  
  updateMap(longitude, latitude) {
    this.mapMarkers = [{
      location: {
          Longitude: longitude,
          Latitude: latitude
      },
  }];
  }
}