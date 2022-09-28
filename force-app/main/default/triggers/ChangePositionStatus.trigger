trigger ChangePositionStatus on Position__c (before update) {
    for(Position__c position : Trigger.New){
        if(position.Status__c == 'Closed'){
            position.Application_deadline__c = System.today();
        }
    }
}