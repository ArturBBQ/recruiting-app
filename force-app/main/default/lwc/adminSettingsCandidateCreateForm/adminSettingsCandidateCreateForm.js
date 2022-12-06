import { LightningElement, api } from 'lwc';
import getCurrentMetadataFieldSets from '@salesforce/apex/AdminSettingsCandidateCustomCreateForm.getCurrentMetadataFieldSets';
import getFieldSetApiNames from '@salesforce/apex/AdminSettingsCandidateCustomCreateForm.getFieldSetApiNames';
import getCurrentFieldSetsByForm from '@salesforce/apex/AdminSettingsCandidateCustomCreateForm.getCurrentFieldSetsByForm'
import updateCustomMetadataCandidateCreateFormFieldSets from '@salesforce/apex/AdminSettingsCandidateCustomCreateForm.updateCustomMetadataCandidateCreateFormFieldSets';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AdminSettingsCandidateCreateForm extends LightningElement {

  ShowModal = false;
  modifiedMetadataRecords = {};
  currentCandidateFieldSet;
  currentJobAppFieldSet;
  candidateFieldSetsOptions = [];
  jobAppFieldSetsOptions = [];


  @api
  handleAdminSettings() {
    this.ShowModal = true;
    this.mapOfFieldSetsCreateForm();
    this.currentFieldSets();
    this.candidateFieldSetOptions();
    this.jobAppFieldSetOptions();
  }

  closeModal() {
    this.ShowModal = false;
  }

  mapOfFieldSetsCreateForm() {
    getCurrentFieldSetsByForm()
    .then(result => {
      this.modifiedMetadataRecords = JSON.parse(JSON.stringify(result));
    })
    .catch(error => {
      this.error = error;
    });
  }

  currentFieldSets() {
    getCurrentMetadataFieldSets()
    .then((result) => {
      this.currentCandidateFieldSet = result[0].Candidate_Fieldset_create_form__c;
      this.currentJobAppFieldSet = result[0].Job_Application_Fieldset_create_form__c;
    })
    .catch((error) => {
      this.error = error;
    });
  }

  candidateFieldSetOptions() {
    getFieldSetApiNames({ objectName: 'Candidate__c' })
    .then((result) => {
      let options = [];
      if (result) {
        result.forEach(element => { 
          options.push({ label: (element[0].toUpperCase() + element.slice(1)), 
                         value: (element[0].toUpperCase() + element.slice(1)) }) 
          });
      }
      this.candidateFieldSetsOptions = options;
    })
    .catch((error) => {
      this.error = error;
    });
  }
      
  jobAppFieldSetOptions() {
    getFieldSetApiNames({ objectName: 'Job_Application__c' })
    .then((result) => {
      let options = [];
      if (result) {
        result.forEach(element => { 
          options.push({ label: (element[0].toUpperCase() + element.slice(1)), 
                         value: (element[0].toUpperCase() + element.slice(1)) }) 
        });
      }
      this.jobAppFieldSetsOptions = options;
    })
    .catch((error) => {
      this.error = error;
    });
  }

  handleCandidateFormFieldset(event) {
    this.currentCandidateFieldSet = event.detail.value;
    this.modifiedMetadataRecords.Create_form_New_Candidate.Candidate_Fieldset_create_form__c = this.currentCandidateFieldSet;
  }

  handleJobAppFormFieldset(event) {
    this.currentJobAppFieldSet = event.detail.value;
    this.modifiedMetadataRecords.Create_form_New_Candidate.Job_Application_Fieldset_create_form__c = this.currentJobAppFieldSet;
  }

  updateMetadataRecords() {
    updateCustomMetadataCandidateCreateFormFieldSets ({ customMetadataFieldSetsByForm: this.modifiedMetadataRecords })
    .then (() => {
      this.dispatchEvent(
          new ShowToastEvent({
              title: 'Success',
              message: 'Status updated',
              variant: 'success'
          })
      );
      this.closeModal();
    })
    .catch ((error) => {
      console.log('Error after save===> ' + error);
      this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error',
            message: 'Couldn`t update',
            variant: 'error'
        })
      );
    })
  }

}