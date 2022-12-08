import { LightningElement, api } from 'lwc';
import getCurrentMetadataFieldSetsByForm from '@salesforce/apex/CandidateCustomCreateFormHelper.getCurrentMetadataFieldSetsByForm';
import getFieldSetForCreateForm from '@salesforce/apex/CandidateCustomCreateFormHelper.getFieldSetForCreateForm';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JobAppCreateFormForCurrentCandidate extends NavigationMixin(LightningElement) {

    @api newCandidateId;
    ShowModal = false;
    jobAppFieldsetNameForForm;
    jobAppFieldSetFields;
    newJobAppId;

    @api
    handleNewJobAppModal() {
        this.ShowModal = true;
        this.currentMetadataFieldSetByForm();
    }

    currentMetadataFieldSetByForm() {
        getCurrentMetadataFieldSetsByForm()
        .then((result) => {
            this.jobAppFieldsetNameForForm = result[0].Job_Application_Fieldset_create_form__c;
            this.jobAppCreateFormFields();
        })
        .catch((error) => {
            this.error = error;
        });
    }

    jobAppCreateFormFields() {
        getFieldSetForCreateForm ({ objectName: 'Job_Application__c', fieldSetName: this.jobAppFieldsetNameForForm })
        .then(result => {
            let options = [];
            if (result) {
                result.forEach(element => { 
                    options.push({ label: element, value: element }) 
                });
            }
            this.jobAppFieldSetFields = options;
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    handleSuccess(event) {
        this.newJobAppId = event.detail.id;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Job Application for Candidate  "'+ this.newCandidateId +'"  created',
                variant: 'success'
            })
        );
        this.ShowModal = false;
        this.closeModal();
    }

    closeModal() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.newCandidateId,
                objectApiName: 'Candidate__c',
                actionName: 'view'
            }
        });
    }

}