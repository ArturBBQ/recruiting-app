import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldsetApiNames from '@salesforce/apex/AdminSettingsControllerLWC.getFieldsetApiNames';
import getProfileApiNames from '@salesforce/apex/AdminSettingsControllerLWC.getProfileApiNames';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import getCurrentFieldSets from '@salesforce/apex/AdminSettingsControllerLWC.getCurrentFieldSets';
import updateCustomMetadataRecords from '@salesforce/apex/AdminSettingsControllerLWC.updateCustomMetadataRecords';

export default class AdminSettingsModal extends LightningElement {
    
  ShowModal = false;
  profileValue;
  profileApiNames = [];
  modifiedMetadataRecords = {};
  currentFieldSetInCard;
  currentFieldSetInModal;
  currentFieldSetInModalJobApp;
  currentCheckboxValue = false;
  canFieldsets = [];
  jobAppFieldsets=[];
  cardFieldsetValue;
  modalFieldsetValue;
  jobAppFielsetValue;
  existFieldsCard = [];
  existFieldsModal = [];
  existFieldsJobAppModal = [];  
  error;

  @api
  handleAdminSettings(){
    this.ShowModal = true;
    this.profileApis();
  }
  
  closeModal() {
    this.ShowModal = false;
  }

  profileApis() {
    getProfileApiNames()
    .then(result => {
      this.modifiedMetadataRecords = JSON.parse(JSON.stringify(result));
      let options = [];
      if (result) {
          for(let key in result){
            options.push({label:key, value:key});
          }
        this.profileApiNames = options;
        console.log(' profileApiNames options '+JSON.stringify(options));
      }
    })
    .catch(error => {
      this.error = error;
    });
  }   

  handleProfile(event) {
    console.log('profileValue '+ event.detail.value);
    this.profileValue = event.detail.value;
    this.currentFieldSets();
    this.candidateFieldSetOptions();
    this.jobAppFieldSetOptions();
  }

  currentFieldSets(){
    getCurrentFieldSets({profileApiName : this.profileValue})
    .then((result) => {
      this.currentFieldSetInCard = result[0].Candidate_Fieldset_in_Card__c;
      this.fieldSetFormInCard();
      this.currentFieldSetInModal = result[0].Candidate_Fieldset_in_Modal__c;
      this.fieldSetFormInModal();
      this.currentFieldSetInModalJobApp = result[0].Job_Application_Fieldset_in_Modal__c;
      this.fieldSetFormInModalJobApp();
      this.currentCheckboxValue = result[0].Inaccessible_fields__c;
    })
    .catch((error) => {
      this.error = error;
    });
  }

  fieldSetFormInCard(){
    getFieldSetForm({ objectName: 'Candidate__c', fieldSetName: this.currentFieldSetInCard })
    .then((result) => {
      this.existFieldsCard = result;
      for(let key in result) {
        if (result.hasOwnProperty(key)) { 
            this.existFieldsCard.push({value:result[key], key:key});
        }
      }
    })
    .catch((error) => {
      this.error = error;
    }); 
  }

  fieldSetFormInModal(){
    getFieldSetForm({ objectName: 'Candidate__c', fieldSetName: this.currentFieldSetInModal })
    .then((result) => {
      this.existFieldsModal = result;
      for(let key in result) {
        if (result.hasOwnProperty(key)) { 
            this.existFieldsModal.push({value:result[key], key:key});
        }
      }
    })
    .catch((error) => {
      this.error = error;
    }); 
  }

  fieldSetFormInModalJobApp(){
    getFieldSetForm({ objectName: 'Job_Application__c', fieldSetName: this.currentFieldSetInModalJobApp })
    .then((result) => {
      this.existFieldsJobAppModal = result;
      for(let key in result) {
        if (result.hasOwnProperty(key)) { 
            this.existFieldsJobAppModal.push({value:result[key], key:key});
        }
      }
    })
    .catch((error) => {
      this.error = error;
    }); 
  }
  
  candidateFieldSetOptions() {
    getFieldsetApiNames({ objectName: 'Candidate__c' })
    .then((result) => {
      let options = [];
      if (result) {
          result.forEach(element => { 
            options.push({ label: (element[0].toUpperCase() + element.slice(1)), 
                           value: (element[0].toUpperCase() + element.slice(1)) }) 
          });
      }
      this.canFieldsets = options;
      console.log('canFieldsets ====>'+ JSON.stringify(options));
    })
    .catch((error) => {
      this.error = error;
    });
  }
  
  jobAppFieldSetOptions() {
    getFieldsetApiNames({ objectName: 'Job_Application__c' })
    .then((result) => {
      let options = [];
      if (result) {
          result.forEach(element => { 
              options.push({ label: (element[0].toUpperCase() + element.slice(1)), 
                             value: (element[0].toUpperCase() + element.slice(1)) }) 
          });
      }
      this.jobAppFieldsets = options;
      console.log('jobAppFieldsets ====>'+ JSON.stringify(options));
    })
    .catch((error) => {
      this.error = error;
    });
  }

  handleCardFieldset(event){
    this.currentFieldSetInCard = event.detail.value;
    // let profileApi = this.profileValue;
    if(this.profileValue === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Candidate_Fieldset_in_Card__c = this.currentFieldSetInCard;
    } else if (this.profileValue === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Candidate_Fieldset_in_Card__c = this.currentFieldSetInCard;
    }
    this.fieldSetFormInCard();
  }

  handleModalFieldset(event){
    this.currentFieldSetInModal = event.detail.value;
    if(this.profileValue === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Candidate_Fieldset_in_Modal__c = this.currentFieldSetInModal;
    } else if (this.profileValue === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Candidate_Fieldset_in_Modal__c = this.currentFieldSetInModal;
    }
    this.fieldSetFormInModal();
  }

  handleJobAppFieldset(event){
    this.currentFieldSetInModalJobApp = event.detail.value;
    if(this.profileValue === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Job_Application_Fieldset_in_Modal__c = this.currentFieldSetInModalJobApp;
    } else if (this.profileValue === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Job_Application_Fieldset_in_Modal__c = this.currentFieldSetInModalJobApp;
    }
    this.fieldSetFormInModalJobApp();
  }

  checkboxChangeHandler(event) {
    this.currentRecruiterCheckboxValue = event.target.checked;
    if(this.profileValue === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Inaccessible_fields__c = this.currentRecruiterCheckboxValue;
    } else if (this.profileValue === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Inaccessible_fields__c = this.currentRecruiterCheckboxValue;
    }
  }

  updateRecords() {
    updateCustomMetadataRecords ({ customMetadataRecords: this.modifiedMetadataRecords })
      .then (result => {
        console.log('Result after save===> ' + result);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Status updated',
                variant: 'success'
            })
        );
      })
      .catch (error => {
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