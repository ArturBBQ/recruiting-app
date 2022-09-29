trigger ReviewTrigger on Review__c (after insert, after update, after delete, after undelete) {
    if (Trigger.isAfter && Trigger.isDelete){
        ReviewTriggerHandler.countReviewTriggerHandler(Trigger.Old);
    } else {
        ReviewTriggerHandler.countReviewTriggerHandler(Trigger.New);
    }   
}
