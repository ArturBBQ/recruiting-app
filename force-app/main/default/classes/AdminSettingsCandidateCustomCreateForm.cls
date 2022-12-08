public with sharing class AdminSettingsCandidateCustomCreateForm {
    @AuraEnabled (cacheable=true)
    public static List<Candidate_create_form_Setting__mdt> getCurrentMetadataFieldSets() {
        List<Candidate_create_form_Setting__mdt> mdtList = [SELECT Candidate_Fieldset_create_form__c, Job_Application_Fieldset_create_form__c
                                                           FROM Candidate_create_form_Setting__mdt];
        return mdtList;
    }

    @AuraEnabled (cacheable=true)
    public static List<String> getFieldSetApiNames(String objectName) {
        List<String> listOfFieldSetApiNames = new List<String>();
        Schema.SObjectType sObjType = Schema.getGlobalDescribe().get(objectName);
        if( sObjType != NULL ) {
            Map<String, Schema.FieldSet> fieldSetNameToItsRecord = sObjType.getDescribe().fieldsets.getMap();
            listOfFieldSetApiNames.addAll(fieldSetNameToItsRecord.keySet());
        }
        return listOfFieldSetApiNames;
    }

    @AuraEnabled (cacheable=true)
    public static Map<String, Candidate_create_form_Setting__mdt> getCurrentFieldSetsByForm() {
        Map<String, Candidate_create_form_Setting__mdt> fieldSetsByCreateForm = new Map<String, Candidate_create_form_Setting__mdt>();
        for(Candidate_create_form_Setting__mdt form : [SELECT QualifiedApiName, Candidate_Fieldset_create_form__c, Job_Application_Fieldset_create_form__c
                                                      FROM Candidate_create_form_Setting__mdt]){
            fieldSetsByCreateForm.put(form.QualifiedApiName, form);
        }
        return fieldSetsByCreateForm;
    }

    public static Metadata.DeployContainer constructDeploymentRequest(Map<String, Candidate_create_form_Setting__mdt> customMetadataFieldSetsByForm) {
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        List<String> fieldSetFullNames = new List<String>();
        for (String recordName : customMetadataFieldSetsByForm.keySet()) {
            fieldSetFullNames.add('Candidate_create_form_Setting.' + recordName);
        }
        List<Metadata.Metadata> records = Metadata.Operations.retrieve(Metadata.MetadataType.CustomMetadata, fieldSetFullNames);
        for (Metadata.Metadata record : records) {
            Metadata.CustomMetadata fieldSetRecord = (Metadata.CustomMetadata) record;
            String fieldSetRecordName = fieldSetRecord.fullName.substringAfter('.');
            Candidate_create_form_Setting__mdt fieldSetToCopy = customMetadataFieldSetsByForm.get(fieldSetRecordName);
            for (Metadata.CustomMetadataValue fieldSetRecordValue : fieldSetRecord.values) {
                fieldSetRecordValue.value = fieldSetToCopy.get(fieldSetRecordValue.field);
            }
            container.addMetadata(fieldSetRecord);
        }
        return container;
    }

    @AuraEnabled(cacheable=true)
    public static  List<String> updateCustomMetadataCandidateCreateFormFieldSets(Map<String, Candidate_create_form_Setting__mdt> customMetadataFieldSetsByForm) {
        Metadata.DeployContainer container = AdminSettingsCandidateCustomCreateForm.constructDeploymentRequest(customMetadataFieldSetsByForm);
        Id asyncResultId = Metadata.Operations.enqueueDeployment(container, null);
        return null;
    }
}
