public with sharing class PositionTriggerHandler {
    public static void changePositionStatus(List <Position__c> posList) {
        for(Position__c position : posList){
            if(position.Status__c == 'Closed'){
                position.Application_deadline__c = System.today();
            }
        }
    }
}
