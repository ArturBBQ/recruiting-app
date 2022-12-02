import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USERPROFILE_NAME from '@salesforce/schema/User.Profile.Name';
import getCandidatesList from '@salesforce/apex/CandidatesForPositionHelper.getCandidatesList';
import getFieldSetForm from '@salesforce/apex/CandidatesForPositionHelper.getFieldSetForm';
import getCurrentMetadataFieldSets from '@salesforce/apex/CandidatesForPositionHelper.getCurrentMetadataFieldSets';
import { NavigationMixin } from 'lightning/navigation';

export default class CandidatesForPositionLWC extends NavigationMixin(LightningElement) {

    @api recordId;
    candidateId;
    candidateCardFieldsetName;
    candidateCards = [];
    error;
    candidateCardFieldSetFields = [];
    userProfileName;
    isProfileAdmin;
    profileNameAccessing;
    
    //variables for pagination
    @api numberOfRecords;
    @api recordsPerPage;
    _recordsPerPage;
    startIndex = 0;
    endIndex;

    connectedCallback() {
        this.candidateList();
    }
  
    candidateList() {
        getCandidatesList({ recordId: this.recordId })
        .then(data => {
            this.candidateCards = data;
        })
        .catch(error => {
            this.error = error;
        });
    }

    @wire(getRecord, { recordId: USER_ID, fields: [USERPROFILE_NAME] }) 
        userDetails({error, data}) {
        if (data) {
            this.userProfileName = data.fields.Profile.value.fields.Name.value;
            this.checkUserForConfigButton();
            this.checkUserForShowDetailInCard();
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

    checkUserForShowDetailInCard() {
        if(this.userProfileName === 'Recruiter' || this.userProfileName === 'System Administrator') {
            this.profileNameAccessing = 'Recruiter';
        } else if (this.userProfileName === 'Interviewer') {
            this.profileNameAccessing = 'Interviewer';
        }
        this.currentMetadataFieldSets();
    }

    currentMetadataFieldSets() {
        getCurrentMetadataFieldSets({ profileApiName: this.profileNameAccessing })
            .then((result) => {
                this.candidateCardFieldsetName = result[0].Candidate_Fieldset_in_Card__c;
                this.cardCandidateInfo();
            })
            .catch((error) => {
                this.error = error;
            });
    }

    cardCandidateInfo() {
        getFieldSetForm ({ objectName: 'Candidate__c', fieldSetName: this.candidateCardFieldsetName })
        .then(result => {
            let options = [];
            if (result) {
                result.forEach(element => { 
                    options.push({ label: element, value: element }) 
                });
            }
            this.candidateCardFieldSetFields = options;
        }) 
        .catch(error => {
            this.error = error;
        });
    }

    handleConfig() {
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

    handlePagination(event) {
        this.startIndex = event.detail.start;
        this.endIndex = event.detail.end;
    }

    get visibleRecords() {
        if(this.candidateCards) {
            return this.candidateCards.slice(this.startIndex, this.endIndex);
        }
    }

    get numberOfRecords() {
        if(this.candidateCards) {
            return this.candidateCards.length;
        }
    }

    get recordsPerPage() {
        return this._recordsPerPage;
    } 
      
    set recordsPerPage(value) {
        if(value) {
            this._recordsPerPage = value;
            this.endIndex = value;
        }
    }

}