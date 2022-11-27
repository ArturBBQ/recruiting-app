public with sharing class CandidatesForPositionHelper {

    @AuraEnabled (cacheable=true)
    public static List<Job_Application__c> getCandidatesList(Id recordId) {
        System.debug(recordId);
        String query = 'SELECT Name, Position__c, Candidate__r.Name, Candidate__r.First_Name__c '
                     + 'FROM Job_Application__c WHERE Position__c =: recordId';
        return Database.query(query);
    }  
    
    @AuraEnabled (cacheable=true)
    public static List<Candidate__c> getCandidateForModal(Id candidateId) {
        System.debug(candidateId);
        String query = 'SELECT Name, First_Name__c, (SELECT Id, Name FROM Job_Applications__r) '
                     + 'FROM Candidate__c WHERE Id =: candidateId';
        return Database.query(query);
    } 

    @AuraEnabled (cacheable=true)
    public static List<Job_Application__c> getJobAppByCandidate(Id candidateId){
        System.debug(candidateId);
        String query = 'SELECT Id FROM Job_Application__c WHERE Candidate__c =: candidateId';
        return Database.query(query);
    }
    
    @AuraEnabled
    public static List<String> getFieldSetForm (String objectName, String fieldSetName){
        System.debug('objectName-------> ' + objectName);
        System.debug('fieldSetName-------> ' + fieldSetName);
        Set<String> usedFields = new Set<String>();
            for(Schema.FieldSetMember fieldSet : Schema.getGlobalDescribe().get(objectName).getDescribe().fieldSets.getMap().get(fieldSetName).getFields()) {
                usedFields.add(fieldSet.getFieldPath());
            }
        List<String> fieldList = new List<String>(usedFields);
        System.debug('fieldList=======> ' + fieldList);
        return fieldList;
    }

}