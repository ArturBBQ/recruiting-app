import { LightningElement, wire, api } from 'lwc';

import getPositionList from '@salesforce/apex/PositionHelper.getPositionList';
import updatePosition from '@salesforce/apex/PositionHelper.updatePosition';
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
  startIndex = 0;
  endIndex;
  _recordsPerPage;

  @api numberOfRecords;
  @api recordsPerPage;
   
  connectedCallback() {
    getPositionList()
    .then(result => {
        this.records = result;
        this.allRecords = result;
      })
    .catch(error => {
        this.error = error;
    });
  } 

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
    console.log('<------CHANGE STATUS ON---------> ', this.selectedValue);
    if(this.selectedValue === 'All'){
        this.records = this.allRecords;
    } else if(this.selectedValue !== 'All'){
        this.records = this.allRecords.filter(element => {
          return element.Status__c === this.selectedValue;
        });
    }
      //setTimeout(() => {
      // this.template.querySelector("c-paginator").calculateTotalPages(); 
      //}, 0); 
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
    console.log('GETTER  this.records.length: ', this.records.length);
      return this.records.length;
    }
  }
  
  get recordsPerPage(){
      return this._recordsPerPage;
  } 
  
  set recordsPerPage(value){
    if(value){
      console.log('SETTER recordsPerPage value', value);
      this._recordsPerPage = value;
      this.endIndex = value;
    }
  } 

  get visibleRecords() {
    if(this.records){
      console.log('/ this.startIndex ',  this.startIndex);
      console.log('/ this.endIndex ',  this.endIndex);
      console.log('/ this.records.slice( this.startIndex, this.endIndex) ',  this.records.slice( this.startIndex, this.endIndex));
      return this.records.slice( this.startIndex, this.endIndex);
    }
  }

  handlePagination(event){
    this.startIndex = event.detail.start;
    console.log('//// this.startIndex: ', this.startIndex);
    this.endIndex = event.detail.end;
    console.log('//// this.endIndex: ', this.endIndex);
  }

}