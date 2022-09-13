import { LightningElement, wire, api } from 'lwc';

import getPositionList from '@salesforce/apex/PositionHelper2nd.getPositionList';
import getRecordsByStatus from '@salesforce/apex/PositionHelper2nd.getRecordsByStatus';
import updatePosition from '@salesforce/apex/PositionHelper2nd.updatePosition';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import POSITION_OBJECT from '@salesforce/schema/Position__c';
import STATUS_FIELD from '@salesforce/schema/Position__c.Status__c';

export default class PositonLWC2nd extends LightningElement {
    _wiredPositions;
    records;
    recordsToDisplay;
    error;
    positionStatusValues;
    allStatusValues;
    positionsToUpdate= [];
    errorMessage;
    selectedValue = 'All';
    startIndex = 0;
    offset = 0;
    _recordsPerPage;

    @api numberOfRecords;
    @api recordsPerPage;

    @wire( getObjectInfo, { objectApiName: POSITION_OBJECT } )
        objectInfo;

    @wire(getPositionList)  
      wiredPositions(response){
        this._wiredPositions = response;
          if (response.data) {
              this.records = response.data;
              console.log('this.records: ', response.data);
              this.recordsToDisplay = response.data.slice(this.startIndex, this.recordsPerPage);
              console.log('this.recordsToDisplay: ', data.slice(this.startIndex, this.recordsPerPage));
          } else if (response.error) {
              this.error = response.error;
          }
    } 

    @wire( getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: STATUS_FIELD } )
      getStatePicklistValues({data, error}) {
        if (data) {
            this.positionStatusValues = data.values;
            console.log('this.positionStatusValues: ', this.positionStatusValues)
            this.allStatusValues = [ { label: 'All', value: 'All' }, ...data.values ];
            console.log('this.allStatusValues: ', this.allStatusValues)
        } else if (error) {
            this.error = error;
        }
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
            return refreshApex (this._wiredPositions)
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

    get recordsPerPage() {
      return this._recordsPerPage;
    }

    set recordsPerPage(value) {
      this._recordsPerPage = value;
    }

    get numberOfRecords() {
      if(this.records){
        return this.records.length;
      }
    }

    handleFilteredStatus(event){
      this.selectedValue = event.target.value;
      console.log('<------CHANGE STATUS ON---------> ', this.selectedValue);
        getRecordsByStatus({ selectStatus : this.selectedValue, offset : this.offset })
          .then(result => {
            this.records = result;
            console.log('result ', result);
            this.recordsToDisplay = result.slice(this.startIndex, this.recordsPerPage);
            console.log('this.recordsToDisplay: ', this.recordsToDisplay);
          })
          .catch(error => {
            this.error = error;
            console.log('error ', error);
          });
    }

    handlePagination(event){
      this.offset = event.detail.offset;
        getRecordsByStatus({ selectStatus : this.selectedValue, offset : this.offset })
          .then(result => {
            if(this.offset == this.startIndex){
              this.recordsToDisplay = result.slice(this.startIndex, this.recordsPerPage);
            } else {
              this.recordsToDisplay = result.slice(this.startIndex, this.offset);
            }
          })
          .catch(error => {
            this.error = error;
          });
    }
    
}

