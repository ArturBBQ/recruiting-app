import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USERPROFILE_NAME from '@salesforce/schema/User.Profile.Name';
import getFieldSetForCreateForm from '@salesforce/apex/CandidateCustomCreateFormHelper.getFieldSetForCreateForm';
import getCurrentMetadataFieldSetsByForm from '@salesforce/apex/CandidateCustomCreateFormHelper.getCurrentMetadataFieldSetsByForm';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CandidateCustomCreateFormLWC extends NavigationMixin(LightningElement) {

    userProfileName;
    isProfileAdmin;
    error;
    newCandidateId;
    candidateFieldsetNameForForm;
    candidateFieldSetFields = [];
    isCandidateSave = false;

    @wire(getRecord, { recordId: USER_ID, fields: [USERPROFILE_NAME] }) 
      userDetails({error, data}) {
        if (data) {
            this.userProfileName = data.fields.Profile.value.fields.Name.value;
            this.checkUserForConfigButton();
            this.currentMetadataFieldSetsByForm();
        } else if(error) {
            this.error = error;
        }
    }

    checkUserForConfigButton() {
        if(this.userProfileName === 'System Administrator') {
            this.isProfileAdmin = true;
        } else {
            this.isProfileAdmin = false;
        }
    }

    handleConfig() {
        this.template.querySelector("c-admin-settings-candidate-create-form").handleAdminSettings();
    }

    currentMetadataFieldSetsByForm() {
        getCurrentMetadataFieldSetsByForm()
        .then((result) => {
            this.candidateFieldsetNameForForm = result[0].Candidate_Fieldset_create_form__c;
            this.candidateCreateFormFields();
        })
        .catch((error) => {
            this.error = error;
        });
    }

    candidateCreateFormFields() {
        getFieldSetForCreateForm ({ objectName: 'Candidate__c', fieldSetName: this.candidateFieldsetNameForForm })
        .then(result => {
            let options = [];
            if (result) {
                result.forEach(element => { 
                    options.push({ label: element, value: element }) 
                });
            }
            this.candidateFieldSetFields = options;
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    handleSuccess(event) {
        this.newCandidateId = event.detail.id;
        this.isCandidateSave = true;
    }

    handleClickNo(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'New Candidate created',
                variant: 'success'
            })
        );
        this.navigateToNewCandidate();
    }

    navigateToNewCandidate(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.newCandidateId,
                objectApiName: 'Candidate__c',
                actionName: 'view'
            }
        });
    }

    handleClickCreateNewJobApp() {
        this.template.querySelector("c-job-app-create-form-for-current-candidate").handleNewJobAppModal();
    }
    
    closeModal() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Candidate__c',
                actionName: 'list'
            },
            state: {
                filterName: 'All'
            },
        });
    }

}