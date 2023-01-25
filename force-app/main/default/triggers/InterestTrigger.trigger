trigger InterestTrigger on Interest__c (before update, before insert) {
    if (Trigger.isBefore && (Trigger.isUpdate || Trigger.isInsert)) {
        InterestTriggerHandler.createDealAfterInterest(Trigger.new);
    }
}