import { LightningElement, wire, track } from 'lwc';

import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {
    
  @track selectedBoatTypeId;
  @track error = undefined;
  @track searchOptions;
    
    
    @wire(getBoatTypes)
    boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map(type => {
        return{
            label:type.Name,
            value:type.Id
        };
      });
      this.searchOptions.unshift({ label: 'All Types', value: '' });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      console.log('im here');
      event.preventDefault();
      this.selectedBoatTypeId = event.detail.value;
      console.log(this.selectedBoatTypeId);
      const selectedEvent = new CustomEvent('search', { detail: {boatTypeId: this.selectedBoatTypeId }});
      this.dispatchEvent(selectedEvent);
        
    }
  }
  