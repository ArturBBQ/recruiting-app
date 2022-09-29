trigger PositionTrigger on Position__c (before update) {
    PositionTriggerHandler.changePositionStatus(Trigger.New);
}