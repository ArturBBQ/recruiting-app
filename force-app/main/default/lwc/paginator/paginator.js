import { api, LightningElement } from 'lwc';

export default class Paginator extends LightningElement {

    currentPage = 1;
    totalRecords;
    recordSize = 5;
    totalPage = 0;
    pages=[];

    get records() {
        return this.visibleRecords;
    }

    @api
    set records(data) {
        if(data){
            this.totalRecords = data;
            this.recordSize = Number(this.recordSize)
            this.totalPage = Math.ceil(data.length/this.recordSize);
            this.updateRecords();
        }
    }

    get disablePrev(){ 
        return this.currentPage <= 1;
    }

    get disableNext(){ 
        return this.currentPage >= this.totalPage;
    }

    prevHandler(){
        if(this.currentPage > 1){
           this.currentPage = this.currentPage-1;
           console.log('prevHandler: ', this.currentPage);
           this.updateRecords();
        }
    }

    nextHandler(){
        if(this.currentPage < this.totalPage){
           this.currentPage = this.currentPage+1;
           console.log('nextHandler: ', this.currentPage);
           this.updateRecords();
        }

    }

    updateRecords() {
        let start = (this.currentPage-1)*this.recordSize;
        let end = this.recordSize*this.currentPage;
        this.visibleRecords = this.totalRecords.slice(start, end);
        this.dispatchEvent(new CustomEvent('update', {
            detail : { 
                records : this.visibleRecords 
            }
        }))
    } 
    
    get pagesList(){
        let mid = Math.floor(this.recordSize/2)+1;
        if(this.currentPage>mid){
            return this.pages.slice(this.currentPage-mid, this.currentPage+mid-1);
        }
        return this.pages.slice(0, this.recordSize);
    }

    onPageClick = (event) =>{
        this.currentPage = parseInt(event.target.dataset.id, 10);
    }

}