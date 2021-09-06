import { LightningElement,track, api } from 'lwc';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_VARIANT = 'success';
const SUCCESS_TITLE = 'Review Created!';
const MESSAGE_SHIP_IT = 'Ship It!';
const CONST_ERROR = 'ERROR!';
const ERROR_VARIANT  = 'error';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    @api boatId;
    rating;
    @api boatReviewObject = BOAT_REVIEW_OBJECT;
    @api nameField        = NAME_FIELD;
    @api commentField     = COMMENT_FIELD;
    @api labelSubject = 'Review Subject';
    @api labelRating  = 'Rating';
    
    // Public Getter and Setter to allow for logic to run on recordId change
    
    get recordId() {
      return this.boatId;
     }
     @api
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);
      //sets boatId assignment
      this.boatId = value;
    }

    
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
      this.rating = event.detail.rating;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
      event.preventDefault();
        const fields = event.detail.fields;
        fields.Boat__c = this.boatId;
        fields.Rating__c = this.rating;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
     }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      // TODO: dispatch the custom event and show the success message
      const event = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: MESSAGE_SHIP_IT,
        variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(event);
    this.handleReset();
    this.dispatchEvent(new CustomEvent('createreview', {detail: this.recordId}));
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    async handleReset() {
      
      const fields = this.template.querySelectorAll('lightning-input-field');
      if (fields) {
        fields.forEach(element => {
          element.reset();
        });
      }
      this.rating = 0;
      const event = new onratingchange({
        rating: 0
    });
    this.dispatchEvent(event);
      
     }
  }
  