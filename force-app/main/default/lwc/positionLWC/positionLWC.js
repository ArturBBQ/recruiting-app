import { LightningElement, wire, api, track } from 'lwc';

import getPositionList from '@salesforce/apex/PositionHelper.getPositionList';
import updatePosition from '@salesforce/apex/PositionHelper.updatePosition';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import POSITION_OBJECT from '@salesforce/schema/Position__c';
import STATUS_FIELD from '@salesforce/schema/Position__c.Status__c';

export default class PositionLWC extends LightningElement {

  records;
  positionStatusValues;
  allStatusValues;
  selectedValue = 'All';
  positionsToUpdate= [];
  errorMessage;

  @api recordsToDisplay;
  @api recordsPerPage;
  @api numberOfRecords;
   
  @wire( getObjectInfo, { objectApiName: POSITION_OBJECT } )
    objectInfo; 

  @wire( getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: STATUS_FIELD } )
    getStatePicklistValues({data, error}) {
      if (data) {
        this.positionStatusValues = data.values;
          console.log('positionStatusValues: ', data.values);
        this.allStatusValues = [ { label: 'All', value: 'All' }, ...data.values ];
          console.log('allStatusValues: ', this.allStatusValues);
      } else if (error) {
        this.error = error;
    }
  } 

  handleChange (event) {
      this.selectedValue = event.target.value;
      console.log('this.selectedValue event.target.value: ', event.target.value);
      if ( this.selectedValue === 'All' ) 
          this.records = this.allRecords;
      else if (this.selectedValue !== 'All')
          this.records = this.allRecords.filter(element => {
           return element.Status__c === this.selectedValue});
    }      

  handleFieldChange(event) {
      let newComboboxValue = event.target.value;
      let recordId = event.currentTarget.dataset.index;
      if (this.positionsToUpdate.filter(element => element.Id === recordId).length) {
          this.positionsToUpdate.map(element => {
            if (element.Id === recordId) {
              element.Status__c = newComboboxValue;
            }
            return element;
          })
      } else {
        this.positionsToUpdate.push( {Id : recordId, Status__c : newComboboxValue} );
      }
    }

  updateStatus() {
    updatePosition({ positions : this.positionsToUpdate })
      .then(() => {
          getPositionList()
            .then(() => {
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Success',
                      message: 'Status updated',
                      variant: 'success'
                  })
              );
          }) 
        })
      .catch((error) => { 
        this.errorMessage=error;
          console.log('unable to update the record' + this.errorMessage);
        })
    }

  get numberOfRecords() {
    if(this.records){
      return this.records.length
    }
  }

  connectedCallback() {
    getPositionList()
    .then(result => {
        this.records = result;
          console.log('//// this.records', this.records);
        this.allRecords = result;
          console.log('//// this.numberOfRecords: ', this.numberOfRecords);
          console.log('//// this.recordsPerPage: ', this.recordsPerPage);
      })
    .catch(error => {
        this.error = error;
    });
  }
  
  handlePagination(event){
    this.recordsToDisplay = this.numberOfRecords.slice(event.target.start, event.target.end);
}



}