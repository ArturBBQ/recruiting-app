import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USERPROFILE_NAME from '@salesforce/schema/User.Profile.Name';
import getCandidatesList from '@salesforce/apex/CandidatesForPositionHelper.getCandidatesList';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import { NavigationMixin } from 'lightning/navigation';

export default class CandidatesForPositionLWC extends NavigationMixin(LightningElement) {

    @api recordId;
    @api candidateId;
    @api candidateObjectApiName = 'Candidate__c';
    @api candidateShortFieldSet = 'Candidate_card_recruiter';
    candidateCards;
    error;
    shortCandidateFieldSet = [];
    userProfileName;
    isProfileAdmin = false;
    
    //variables for pagination
    @api numberOfRecords;
    @api recordsPerPage;
    _recordsPerPage;
    startIndex = 0;
    endIndex;

    @wire(getRecord, { recordId: USER_ID, fields: [USERPROFILE_NAME]}) 
        userDetails({error, data}) {
        if (data) {
                this.userProfileName = data.fields.Profile.value.fields.Name.value;
                console.log('this.userProfileName:'+ this.userProfileName);
                this.checkUser();
        }
    }

    checkUser(){
        if(this.userProfileName === 'System Administrator'){
            this.isProfileAdmin = true;
        }
    }

    connectedCallback() {
        this.candidateList();
        this.getShortCandidateInfo();
    }
  
    candidateList() {
        getCandidatesList({recordId: this.recordId})
        .then(result => {
            this.candidateCards = result;
            console.log('candidateCards:'+ JSON.stringify(result));
        })
        .catch(error => {
            this.error = error;
        });
    }

    getShortCandidateInfo() {
        getFieldSetForm ({ objectName: this.candidateObjectApiName, fieldSetName: this.candidateShortFieldSet})
        .then(result => {
            this.shortCandidateFieldSet = result;
            for(let key in result) {
                if (result.hasOwnProperty(key)) { 
                    this.shortCandidateFieldSet.push({value:result[key], key:key});
                }
            }
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    handleConfig(){
        this.template.querySelector("c-admin-settings-modal").handleAdminSettings();
    }

    handleModal(event) {
        this.candidateId = event.currentTarget.dataset.id;
        this.template.querySelector("c-candidate-modal").handleCandidateModal(event.currentTarget.dataset.id);
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

    handlePagination(event){
        this.startIndex = event.detail.start;
        this.endIndex = event.detail.end;
    }

    get visibleRecords() {
        if(this.candidateCards){
            return this.candidateCards.slice(this.startIndex, this.endIndex);
        }
    }

    get numberOfRecords() {
        if(this.candidateCards){
            return this.candidateCards.length;
        }
    }

    get recordsPerPage(){
        return this._recordsPerPage;
    } 
      
    set recordsPerPage(value){
        if(value){
            this._recordsPerPage = value;
            this.endIndex = value;
        }
    }

}