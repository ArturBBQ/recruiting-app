import { api, track, LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    
    @api records;
    @api recordsPerPage;
    @api recordsToDisplay;

    pageLinks = [];
    totalRecords;
    totalPages;
    pageNo;

    setRecordsToDisplay(){
        this.totalRecords = this.records.length;
        this.pageNo = 1;
        this.totalPages = Math.ceil(this.totalRecords / recordsPerPage);
        this.preparePaginationList();

        for (let i = 1; i <= this.totalPages; i++) {
            this.pageLinks.push(i);
        }
    }

    handleClick(event) {
        let label = event.target.label;
        if (label === "Prev") {
            this.handlePrevious();
        } else if (label === "Next") {
            this.handleNext();
        }
    }

    handlePrevious() {
        this.pageNo = this.pageNo - 1;
        this.preparePaginationList();
    }

    handleNext() {
        this.pageNo = this.pageNo + 1;
        this.preparePaginationList();
    }

    get disablePrev(){ 
        return this.pageNo <= 1;
    }

    get disableNext(){ 
        return this.pageNo >= this.totalPages;
    }

    preparePaginationList(){
        let start = (this.pageNo - 1) * this.recordsPerPage;
        let end = start + this.recordsPerPage;
        this.recordsToDisplay = this.records.slice(start, end);
        this.dispatchEvent(new CustomEvent ('pagination', {
            detail: {
                records : this.recordsToDisplay
            }
        }))  
    }

    handlePage (button) {
        this.pageNo = button.target.label;
        this.preparePaginationList();
    }

}