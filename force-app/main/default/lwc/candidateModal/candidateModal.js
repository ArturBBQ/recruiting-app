import { LightningElement, api } from 'lwc';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import getCandidateForModal from '@salesforce/apex/CandidatesForPositionHelper.getCandidateForModal';
import getJobAppByCandidate from '@salesforce/apex/CandidatesForPositionHelper.getJobAppByCandidate';
import { NavigationMixin } from 'lightning/navigation';

export default class CandidateModal extends NavigationMixin(LightningElement) {

    @api candidateId;
    @api candidateObjectApiName = 'Candidate__c';
    @api jaObjectApiName = 'Job_Application__c';
    @api candidateLongFieldSet = 'Candidate_modal_recruiter';
    @api jobAppFieldSet = 'Job_App_recruiter';
    ShowModal = false;
    candidate;
    longCandidateFieldSet = [];
    jaFieldSet = [];
    jobApp;
    jaId;
    error;
    
    @api 
    handleCandidateModal(event) {
        console.log('CHILD event (id)' + event);
        this.candidateId = event;
        this.ShowModal = true;
        this.candidateForModal();
        this.getLongCandidateInfo();
        this.jaListbyCandidate();
        this.getJobAppInfo();
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

    getLongCandidateInfo() {
        getFieldSetForm ({ objectName: this.candidateObjectApiName, fieldSetName: this.candidateLongFieldSet })
        .then(result => {
            this.longCandidateFieldSet = result;
            for(let key in result) {
                if (result.hasOwnProperty(key)) { 
                    this.longCandidateFieldSet.push({value:result[key], key:key});
                }
            }
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    jaListbyCandidate() {
        getJobAppByCandidate({ candidateId: this.candidateId })
        .then(result => {
            this.jobApp = result;
        })
        .catch(error => {
            this.error = error;
        });
    }

    getJobAppInfo() {
        getFieldSetForm({ objectName: this.jaObjectApiName, fieldSetName: this.jobAppFieldSet })
        .then(result => {
            this.jaFieldSet = result;
            for(let key in result) {
                if (result.hasOwnProperty(key)) { 
                    this.jaFieldSet.push({value:result[key], key:key});
                }
            }
        }) 
        .catch(error => {
            console.log('error:'+ error);
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
        this.jaId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.jaId,
                objectApiName: 'Job_Application__c',
                actionName: 'view'
            }
        });
    }
}