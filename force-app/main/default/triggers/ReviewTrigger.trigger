trigger ReviewTrigger on Review__c (after insert, after update, after delete) {
    if (Trigger.isAfter && Trigger.isDelete){
        ReviewTriggerHandler.countReview(Trigger.Old);
    } else if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)){
        ReviewTriggerHandler.countReview(Trigger.New);
    }   
}
