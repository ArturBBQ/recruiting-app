import { api, track, LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    
    pageNo = 1;
    totalRecords;
    totalPages = 0;
    pageLinks = [];
    @api recordsPerPage;

    get records() {
        return this.recordsToDisplay
    }

    @api
    set records(data) {
        if(data){
            this.totalRecords = data;
            this.recordsPerPage = Number(this.recordsPerPage);
            this.totalPages = Math.ceil(data.length/this.recordsPerPage);
            this.preparePaginationList();

            for (let i = 1; i <= this.totalPages; i++) {
                this.pageLinks.push(i);
            }
            this.preparePaginationList();
        }
    }

    prevHandler(){
        this.pageNo = this.pageNo-1;
        this.preparePaginationList();
    }

    nextHandler(){
        this.pageNo = this.pageNo+1;
        this.preparePaginationList();
    }

    get disablePrev(){ 
        return this.pageNo <= 1;
    }

    get disableNext(){ 
        return this.pageNo >= this.totalPages;
    }

    preparePaginationList() {
        let start = (this.pageNo-1)*this.recordsPerPage;
        let end = this.recordsPerPage*this.pageNo;
        this.recordsToDisplay = this.totalRecords.slice(start, end);
        this.dispatchEvent(new CustomEvent('pagination', {
            detail:{
                records : this.recordsToDisplay 
            }
        }))
    }

    handlePage (button) {
        this.pageNo = button.target.label;
        this.preparePaginationList();
    }
}
