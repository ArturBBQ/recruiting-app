import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldSetApiNames from '@salesforce/apex/AdminSettingsControllerLWC.getFieldSetApiNames';
import getFieldSetsByProfile from '@salesforce/apex/AdminSettingsControllerLWC.getFieldSetsByProfile';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import getCurrentMetadataFieldSets from '@salesforce/apex/CandidatesForPositionHelper.getCurrentMetadataFieldSets';
import updateCustomMetadataRecords from '@salesforce/apex/AdminSettingsControllerLWC.updateCustomMetadataRecords';

export default class AdminSettingsModal extends LightningElement {
    
  ShowModal = false;
  modifiedMetadataRecords = {};
  profileApiNames = [];
  error;
  profileValueInCombobox;
  currentFieldSetInCard;
  currentFieldSetInModal;
  currentFieldSetInModalJobApp;
  existFieldsCard = [];
  existFieldsModal = [];
  existFieldsJobAppModal = [];  
  candidateFieldSetsOptions = [];
  jobAppFieldSetsOptions = [];

  @api
  handleAdminSettings() {
    this.ShowModal = true;
    this.profileApis();
  }
  
  closeModal() {
    this.ShowModal = false;
  }

  profileApis() {
    getFieldSetsByProfile()
    .then(result => {
      let options = [];
      if (result) {
        for(let key in result){
          options.push({label:key, value:key});
        }
       this.profileApiNames = options;
      }
      this.modifiedMetadataRecords = JSON.parse(JSON.stringify(result));
    })
    .catch(error => {
      this.error = error;
    });
  }   

  handleProfile(event) {
    this.profileValueInCombobox = event.detail.value;
    this.currentFieldSets();
    this.candidateFieldSetOptions();
    this.jobAppFieldSetOptions();
  }

  currentFieldSets() {
    getCurrentMetadataFieldSets({ profileApiName : this.profileValueInCombobox })
    .then((result) => {
      this.currentFieldSetInCard = result[0].Candidate_Fieldset_in_Card__c;
      this.fieldSetFormInCard();
      this.currentFieldSetInModal = result[0].Candidate_Fieldset_in_Modal__c;
      this.fieldSetFormInModal();
      this.currentFieldSetInModalJobApp = result[0].Job_Application_Fieldset_in_Modal__c;
      this.fieldSetFormInModalJobApp();
    })
    .catch((error) => {
      this.error = error;
    });
  }

  fieldSetFormInCard() {
    getFieldSetForm({ objectName: 'Candidate__c', fieldSetName: this.currentFieldSetInCard })
    .then((result) => {
      this.existFieldsCard = JSON.parse(JSON.stringify(result));
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
      this.existFieldsModal = JSON.parse(JSON.stringify(result));
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

  fieldSetFormInModalJobApp() {
    getFieldSetForm({ objectName: 'Job_Application__c', fieldSetName: this.currentFieldSetInModalJobApp })
    .then((result) => {
      this.existFieldsJobAppModal = JSON.parse(JSON.stringify(result));
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

  handleCardFieldset(event) {
    this.currentFieldSetInCard = event.detail.value;
    if(this.profileValueInCombobox === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Candidate_Fieldset_in_Card__c = this.currentFieldSetInCard;
    } else if (this.profileValueInCombobox === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Candidate_Fieldset_in_Card__c = this.currentFieldSetInCard;
    }
    this.fieldSetFormInCard();
  }

  handleModalFieldset(event) {
    this.currentFieldSetInModal = event.detail.value;
    if(this.profileValueInCombobox === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Candidate_Fieldset_in_Modal__c = this.currentFieldSetInModal;
    } else if (this.profileValueInCombobox === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Candidate_Fieldset_in_Modal__c = this.currentFieldSetInModal;
    }
    this.fieldSetFormInModal();
  }

  handleJobAppFieldset(event) {
    this.currentFieldSetInModalJobApp = event.detail.value;
    if(this.profileValueInCombobox === 'Recruiter') {
      this.modifiedMetadataRecords.Recruiter.Job_Application_Fieldset_in_Modal__c = this.currentFieldSetInModalJobApp;
    } else if (this.profileValueInCombobox === 'Interviewer') {
      this.modifiedMetadataRecords.Interviewer.Job_Application_Fieldset_in_Modal__c = this.currentFieldSetInModalJobApp;
    }
    this.fieldSetFormInModalJobApp();
  }

  updateMetadataRecords() {
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
        this.closeModal();
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