import { LightningElement, api } from 'lwc';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import getCandidateForModal from '@salesforce/apex/CandidatesForPositionHelper.getCandidateForModal';
import getJobAppByCandidate from '@salesforce/apex/CandidatesForPositionHelper.getJobAppByCandidate';
import getCurrentMetadataFieldSets from '@salesforce/apex/CandidatesForPositionHelper.getCurrentMetadataFieldSets';
import { NavigationMixin } from 'lightning/navigation';

export default class CandidateModal extends NavigationMixin(LightningElement) {

    candidateId;
    ShowModal = false;
    candidate;
    error;
    jobAppsByCandidate;
    @api profileNameAccessing;
    candidateModalFieldsetName;
    jobAppModalFieldsetName;
    candidateModalFieldSetFields = [];
    jaFieldSetFields = [];
    jobAppId;
    
    @api 
    handleCandidateModal(event) {
        this.candidateId = event;
        this.ShowModal = true;
        this.candidateForModal();
        this.jaListbyCandidate();
        this.currentMetadataFieldSets();
    }

    candidateForModal() {
        getCandidateForModal({ candidateId: this.candidateId })
        .then(result => {
            this.candidate = result;
        })
        .catch(error => {
            this.error = error;
        });
    }

    jaListbyCandidate() {
        getJobAppByCandidate({ candidateId: this.candidateId })
        .then(result => {
            this.jobAppsByCandidate = result;
        })
        .catch(error => {
            this.error = error;
        });
    }

    currentMetadataFieldSets() {
        getCurrentMetadataFieldSets({ profileApiName: this.profileNameAccessing })
        .then((result) => {
            this.candidateModalFieldsetName = result[0].Candidate_Fieldset_in_Modal__c;
            this.getModalCandidateInfo();
            this.jobAppModalFieldsetName = result[0].Job_Application_Fieldset_in_Modal__c;
            this.getJobAppInfo();
        })
        .catch((error) => {
            this.error = error;
        });
    }

    getModalCandidateInfo() {
        getFieldSetForm ({ objectName: 'Candidate__c', fieldSetName: this.candidateModalFieldsetName })
        .then(result => {
            let options = [];
            if (result) {
                result.forEach(element => { 
                    options.push({ label: element, value: element }) 
                });
            }
            this.candidateModalFieldSetFields = options;
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    getJobAppInfo() {
        getFieldSetForm({ objectName: 'Job_Application__c', fieldSetName: this.jobAppModalFieldsetName })
        .then(result => {
            let options = [];
            if (result) {
                result.forEach(element => { 
                    options.push({ label: element, value: element }) 
                });
            }
            this.jaFieldSetFields = options;
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    closeModal() {
        this.ShowModal = false;
    }

    navigateToCandidatePage(event) {
        this.candidateId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.candidateId,
                objectApiName: 'Candidate__c',
                actionName: 'view'
            }
        });
    }
    
    navigateToJobAppPage(event) {
        this.jobAppId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.jobAppId,
                objectApiName: 'Job_Application__c',
                actionName: 'view'
            }
        });
    }
}