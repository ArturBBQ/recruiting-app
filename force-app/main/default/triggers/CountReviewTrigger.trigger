trigger CountReviewTrigger on Review__c (after insert, after update, after delete, after undelete) {
    if (Trigger.isAfter && Trigger.isUpdate){
        CountReviewTrigger.countReviewUpdate(Trigger.New, Trigger.OldMap); 
    } else if (Trigger.isAfter && Trigger.isDelete){ 
        CountReviewTrigger.countReview(Trigger.Old);
    } else if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUndelete)){ 
        CountReviewTrigger.countReview(Trigger.New);
    }
}
