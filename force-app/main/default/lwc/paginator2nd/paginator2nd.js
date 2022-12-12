import { LightningElement, api } from 'lwc';

export default class Paginator2nd extends LightningElement {

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
          console.log('SETTER child value: ', value);
          console.log('SETTER child this.recordsPerPage: ', this.recordsPerPage);
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
        console.log('child this.pageNo: ', this.pageNo);
        this.totalPages = Math.ceil(Number(this.numberOfRecords)/Number(this.recordsPerPage)); 
        console.log('child this.totalPages: ', this.totalPages); 
        this.pageNumbers = Array(this.totalPages).fill().map((event, i) => i + 1);
        console.log('CHILD this.pageNumbers', this.pageNumbers);
    } 

    get disablePrev(){ 
        return this.pageNo <= 1;
    }

    get disableNext(){ 
        return this.pageNo >= this.totalPages;
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

    preparePaginationList(){
        let offset = (this.pageNo-1)*this.recordsPerPage;
        console.log('child offset: ', offset);
        this.dispatchEvent(CustomEvent('pagination', {
            detail:{ offset : offset }
        }))
    }

    handlePage (event){
        this.pageNo = Number(event.target.label);
        console.log('child this.pageNo NOW: ', this.pageNo);
        this.preparePaginationList();
    }
}