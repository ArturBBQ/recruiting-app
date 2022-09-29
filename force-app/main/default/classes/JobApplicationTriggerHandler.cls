public with sharing class JobApplicationTriggerHandler {
    public static void changeJobApplicationStatus(List<Job_Application__c> jaList) {
        List<Position__c> posList = new List<Position__c>();
        for(Job_Application__c ja : jaList){
            if(ja.Status__c == 'Hired'){ 
                posList.add(new Position__c(id = ja.Position__c, Status__c = 'Closed'));
            }
        }
        update posList;
    }
}
