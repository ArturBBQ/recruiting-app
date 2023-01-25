trigger ProductTrigger on Product__c (before insert, before update) {
    if(Trigger.isInsert || Trigger.isUpdate) {
        ProductTriggerHandler.availabilityOfProducts(Trigger.new);
    }
}