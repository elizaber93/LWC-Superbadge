import { MessageContext, publish } from "lightning/messageService";
import { LightningElement, wire, api, track} from "lwc";
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { refreshApex } from '@salesforce/apex';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId = '';
  columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true'  },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
];

  boatTypeId = '';
  @track boats;
  @track isLoading = false;
  
  // wired message context
  @wire(MessageContext)
  messageContext;


  // wired getBoats method 
  @wire(getBoats,{boatTypeId: '$boatTypeId'})
  wiredBoats({data, error}) { 
    if (data) {
      this.boats = data;
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
    } 
  }
  
  
  @api
  searchBoats(boatTypeId) { 
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
   }
  

  sendMessageService(boatId) { 
    console.log('im in sendmessageService');
    publish(this.messageContext, BOATMC, {recordId : boatId});
    
  }
  
  
  notifyLoading(isLoading) { 
    if (isLoading) {
      this.dispatchEvent(new CustomEvent('loading'));
    } else {
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}
