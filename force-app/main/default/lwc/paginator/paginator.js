import { api, track, LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    
    pageNo = 1;
    pageNumbers = [];
    totalPages = 0;
    
    @api recordsPerPage;
    @api numberOfRecords;
    
    connectedCallback() {
        console.log('child this.numberOfRecords: ', this.numberOfRecords);
        console.log('child this.recordsPerPage: ', this.recordsPerPage);
        this.totalPages = Math.ceil(Number(this.numberOfRecords)/Number(this.recordsPerPage)); 
        console.log('child this.totalPages: ', this.totalPages);

        for (let i = 1; i <= this.totalPages; i++) {
            this.pageNumbers.push(i);
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
        this.dispatchEvent(new CustomEvent('pagination', {
            details:{
                start: var1,
                end: var2 
            }
        }))
    }

    handlePage (event) {
        this.pageNo = Number(event.target.label);
        this.preparePaginationList();
    }
}
