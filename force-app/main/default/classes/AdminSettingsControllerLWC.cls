public with sharing class AdminSettingsControllerLWC {

    @AuraEnabled (cacheable=true)
    public static List<Fieldset_Setting__mdt> getCurrentMetadataProfiles() {
        List<Fieldset_Setting__mdt> profiles = new List<Fieldset_Setting__mdt>();
        for(Fieldset_Setting__mdt profile : [SELECT QualifiedApiName FROM Fieldset_Setting__mdt]){
            profiles.add(profile);
        }
        System.debug('profiles===> ' + profiles);
        return profiles;
    }
    
    @AuraEnabled (cacheable=true)
    public static Map<String, Fieldset_Setting__mdt> getFieldSetsByProfile() {
        Map<String, Fieldset_Setting__mdt> fieldSetsByApiName = new Map<String, Fieldset_Setting__mdt>();
        for(Fieldset_Setting__mdt profile : [SELECT QualifiedApiName,  Candidate_Fieldset_in_Card__c, 
                                            Candidate_Fieldset_in_Modal__c, Job_Application_Fieldset_in_Modal__c 
                                            FROM Fieldset_Setting__mdt]){
            fieldSetsByApiName.put(profile.QualifiedApiName, profile);
        }
        System.debug('MAP fieldSetsByApiName===> ' + fieldSetsByApiName);
        return fieldSetsByApiName;
    }
   
    @AuraEnabled (cacheable=true)
    public static List<String> getFieldSetApiNames(String objectName) {
        List<String> listOfFieldSetApiNames = new List<String>();
        Schema.SObjectType sObjType = Schema.getGlobalDescribe().get(objectName);
        if( sObjType != NULL ) {
            Map<String, Schema.FieldSet> fieldSetNameToItsRecord = sObjType.getDescribe().fieldsets.getMap();
            listOfFieldSetApiNames.addAll( fieldSetNameToItsRecord.keySet() );
        }
        System.debug('listOfFieldSetApiNames===> ' + listOfFieldSetApiNames);
        return listOfFieldSetApiNames;
    }
  
    public static Metadata.DeployContainer constructDeploymentRequest(Map<String, Fieldset_Setting__mdt> customMetadataFieldSetsByProfile) {
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        List<String> fieldSetFullNames = new List<String>();
        for (String recordName : customMetadataFieldSetsByProfile.keySet()) {
            fieldSetFullNames.add('Fieldset_Setting.' + recordName);
        }
        System.debug('fieldSetFullNames===> ' + fieldSetFullNames);
        List<Metadata.Metadata> records = Metadata.Operations.retrieve(Metadata.MetadataType.CustomMetadata, fieldSetFullNames);
        for (Metadata.Metadata record : records) {
            Metadata.CustomMetadata fieldSetRecord = (Metadata.CustomMetadata) record;
            String fieldSetRecordName = fieldSetRecord.fullName.substringAfter('.');
            Fieldset_Setting__mdt fieldSetToCopy = customMetadataFieldSetsByProfile.get(fieldSetRecordName);
            for (Metadata.CustomMetadataValue fieldSetRecordValue : fieldSetRecord.values) {
                fieldSetRecordValue.value = fieldSetToCopy.get(fieldSetRecordValue.field);
            }
            container.addMetadata(fieldSetRecord);
        }
        return container;
    }

    @AuraEnabled(cacheable=true)
    public static  List<String> updateCustomMetadataFieldSetSettings(Map<String, Fieldset_Setting__mdt> customMetadataFieldSetsByProfile) {
        Metadata.DeployContainer container = AdminSettingsControllerLWC.constructDeploymentRequest(customMetadataFieldSetsByProfile);
        Id asyncResultId = Metadata.Operations.enqueueDeployment(container, null);
        return null;
    }

}
