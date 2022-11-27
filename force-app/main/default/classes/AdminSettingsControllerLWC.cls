public with sharing class AdminSettingsControllerLWC {

    @AuraEnabled (cacheable=true)
    public static List<Fieldset_Setting__mdt> getCurrentFieldSets(String profileApiName){
        List<Fieldset_Setting__mdt> mdtList = [SELECT Candidate_Fieldset_in_Card__c, Candidate_Fieldset_in_Modal__c, 
                                                Job_Application_Fieldset_in_Modal__c, Inaccessible_fields__c 
                                               FROM Fieldset_Setting__mdt
                                               WHERE MasterLabel =: profileApiName];
        return mdtList;
    }

    @AuraEnabled (cacheable=true)
    public static Map<String, Fieldset_Setting__mdt> getProfileApiNames(){
        List<Fieldset_Setting__mdt> fieldSets = new List<Fieldset_Setting__mdt>();
        Map<String, Fieldset_Setting__mdt> fieldSetsByApiName = new Map<String, Fieldset_Setting__mdt>();
        for(Fieldset_Setting__mdt profile : [SELECT QualifiedApiName,  Candidate_Fieldset_in_Card__c, Candidate_Fieldset_in_Modal__c, 
                                                    Job_Application_Fieldset_in_Modal__c, Inaccessible_fields__c 
                                            FROM Fieldset_Setting__mdt]){
            fieldSets.add(profile);
            fieldSetsByApiName.put(profile.QualifiedApiName, profile);
        }
        System.debug('fieldSets=======> ' + fieldSets);
        System.debug('fieldSetsByApiName=======> ' + fieldSetsByApiName);
        return fieldSetsByApiName;
    }
   
    @AuraEnabled (cacheable=true)
    public static List<String> getFieldsetApiNames(String objectName) {
        List<String> listOfFieldSetApiNames = new List<String>();
        Schema.SObjectType sObjType = Schema.getGlobalDescribe().get(objectName);
        if( sObjType != NULL ) {
            Map<String, Schema.FieldSet> fieldSetNameToItsRecord = sObjType.getDescribe().fieldsets.getMap();
            listOfFieldSetApiNames.addAll( fieldSetNameToItsRecord.keySet() );
        }
        System.debug('listOfFieldSetApiNames=======> ' + listOfFieldSetApiNames);
        return listOfFieldSetApiNames;
    }
  
    public static Metadata.DeployContainer constructDeploymentRequest(Map<String, Fieldset_Setting__mdt> customMetadataRecords) {
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        List<String> fieldSetFullNames = new List<String>();
        for (String recordName : customMetadataRecords.keySet()) {
            fieldSetFullNames.add('Fieldset_Setting.' + recordName);
        }
        System.debug('fieldSetFullNames====> ' + fieldSetFullNames);
        List<Metadata.Metadata> records = Metadata.Operations.retrieve(Metadata.MetadataType.CustomMetadata, fieldSetFullNames);
        for (Metadata.Metadata record : records) {
            Metadata.CustomMetadata fieldSetRecord = (Metadata.CustomMetadata) record;
            String fieldSetRecordName = fieldSetRecord.fullName.substringAfter('.');
            Fieldset_Setting__mdt fieldSetToCopy = customMetadataRecords.get(fieldSetRecordName);
            for (Metadata.CustomMetadataValue fieldSetRecordValue : fieldSetRecord.values) {
                fieldSetRecordValue.value = fieldSetToCopy.get(fieldSetRecordValue.field);
            }
            container.addMetadata(fieldSetRecord);
        }
        return container;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> updateCustomMetadataRecords(Map<String, Fieldset_Setting__mdt> customMetadataRecords) {
        try {
            Metadata.DeployContainer container = AdminSettingsControllerLWC.constructDeploymentRequest(customMetadataRecords);
            Id asyncResultId = Metadata.Operations.enqueueDeployment(container, null);
            List<String> result  = new List<String>();
            result.add('Success');
            result.add( (String)asyncResultId );
            System.debug('result====> ' + result);
            return result;
        } catch (Exception e) {
            List<String> result  = new List<String>();
            result.add('Error');
            result.add(e.getMessage());
            System.debug('result error====> ' + result);
            return result;
        }
    }

}
