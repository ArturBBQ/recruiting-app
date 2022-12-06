public with sharing class CandidateCustomCreateFormHelper {
    @AuraEnabled (cacheable=true)
    public static List<String> getFieldSetForCreateForm(String objectName, String fieldSetName) {
        Set<String> usedFields = new Set<String>();
        for(Schema.FieldSetMember fieldSet : Schema.getGlobalDescribe().get(objectName).getDescribe().fieldSets.getMap().get(fieldSetName).getFields()) {
            usedFields.add(fieldSet.getFieldPath());
        }
        List<String> fieldList = new List<String>(usedFields);
        return fieldList;
    }

    @AuraEnabled (cacheable=true)
    public static List<Candidate_create_form_Setting__mdt> getCurrentMetadataFieldSetsByForm() {
        List<Candidate_create_form_Setting__mdt> mdtList = [SELECT Candidate_Fieldset_create_form__c, Job_Application_Fieldset_create_form__c
                                                            FROM Candidate_create_form_Setting__mdt];
        return mdtList;
    }
}
