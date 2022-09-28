trigger HiredJobApplicationTrigger on Job_Application__c (before update) {
    List<Position__c> posList = new List<Position__c>();
    for(Job_Application__c ja: Trigger.New) {
        if(ja.Status__c == 'Hired') { 
            posList.add(new Position__c(id = ja.Position__c,
                                        Status__c = 'Closed'));
        }
    }
    update posList;
}