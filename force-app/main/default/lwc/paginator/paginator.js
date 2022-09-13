import { api, LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    
    pageNo = 1;
    pageNumbers = [];
    totalPages;
    _numberOfRecords;

    @api recordsPerPage;
    @api numberOfRecords;
    
    get numberOfRecords() {
        return this._numberOfRecords;
    }
     
    set numberOfRecords(value){
        if(value){
            this._numberOfRecords = value;
            this.totalPages = Math.ceil(Number(this._numberOfRecords)/Number(this.recordsPerPage));
            this.calculateTotalPages();
        } 
    }

    connectedCallback(){
        this.calculateTotalPages();
    }      
    
    calculateTotalPages(){
        console.log('child this.numberOfRecords: ', this.numberOfRecords);
        console.log('child this.recordsPerPage: ', this.recordsPerPage);
        this.pageNo = 1;
        this.totalPages = Math.ceil(Number(this.numberOfRecords)/Number(this.recordsPerPage)); 
        console.log('child this.totalPages: ', this.totalPages); 
        
        this.pageNumbers = Array(this.totalPages).fill().map((event, i) => i + 1);
        console.log('CHILD this.pageNumbers', this.pageNumbers);
    } 

    prevHandler(){
        this.pageNo = this.pageNo-1;
        console.log('child pageNo NOW: ', this.pageNo);
        this.preparePaginationList();
    }

    nextHandler(){
        this.pageNo = this.pageNo+1;
        console.log('child pageNo NOW: ', this.pageNo);
        this.preparePaginationList();
    }

    get disablePrev(){ 
        return this.pageNo <= 1;
    }

    get disableNext(){ 
        return this.pageNo >= this.totalPages;
    }
        
    preparePaginationList(){
        let start = (this.pageNo-1)*this.recordsPerPage;
        console.log('child start: ', start);
        let end = start + this.recordsPerPage;
        console.log('child end: ', end);

        this.dispatchEvent(CustomEvent('pagination', {
            detail:{ start, end }
        }))
    }

    handlePage (event){
        this.pageNo = Number(event.target.label);
        console.log('child this.pageNo: ', this.pageNo);
        this.preparePaginationList();
    }
}
