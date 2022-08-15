import { LightningElement, wire, api, track } from 'lwc';

import getPositionList from '@salesforce/apex/PositionHelper.getPositionList';
import updatePosition from '@salesforce/apex/PositionHelper.updatePosition';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import POSITION_OBJECT from '@salesforce/schema/Position__c';
import STATUS_FIELD from '@salesforce/schema/Position__c.Status__c';

export default class PositionLWC extends LightningElement {

  _wiredPositions;
  records;
  positionStatusValues;
  allStatusValues;
  selectedValue = 'All';
  positionsToUpdate= [];
  errorMessage;
  @api visiblePositions;
    
  @wire(getPositionList)  
    wiredPositions(response){
      this._wiredPositions = response;
      if (response.data) {
          this.records = response.data;
            console.log('response.data', response.data);
          this.allRecords = response.data;
      } else if (response.error) {
          this.error = response.error;
      }
    } 

  @wire( getObjectInfo, { objectApiName: POSITION_OBJECT } )
    objectInfo;

  @wire( getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: STATUS_FIELD } )
    getStatePicklistValues({data, error}) {
      if (data) {
        this.positionStatusValues = data.values;
          console.log('result: ', data.values);
        this.allStatusValues = [ { label: 'All', value: 'All' }, ...data.values ];
          console.log('allStatusValues: ', this.allStatusValues);
      } else if (error) {
        this.error = error;
    }
  } 

  handleChange (event) {
      this.selectedValue = event.target.value;
      if ( this.selectedValue === 'All' ) 
          this.records = this.allRecords;
      else if (this.selectedValue !== 'All')
          this.records = this.allRecords.filter(element => {
           return element.Status__c === this.selectedValue});
          console.log('result 2: ', this.records);
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
          return refreshApex ( this._wiredPositions )
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
          console.log('unable to update the record' + JSON.stringify(this.errorMessage));
        })
    }
    
  updatePositionHandler(event){
    this.visiblePositions=[...event.target.records]
    console.log(event.target.records);
  }
}