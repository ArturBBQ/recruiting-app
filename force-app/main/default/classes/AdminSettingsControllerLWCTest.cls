@isTest
private class AdminSettingsControllerLWCTest {

    @isTest
    static void testGetCurrentMetadataProfiles(){          
        List<Fieldset_Setting__mdt> profiles = AdminSettingsControllerLWC.getCurrentMetadataProfiles();
        System.assertEquals(2, profiles.size());
    }

    @isTest
    static void testGetFieldSetsByProfile(){          
        Map<String, Fieldset_Setting__mdt> fieldSetsByApiName = AdminSettingsControllerLWC.getFieldSetsByProfile();
        System.assertEquals(2, fieldSetsByApiName.size());
    }

    @isTest
    static void testGetFieldSetApiNames() {
        List<String> listOfFieldSetApiNames = new List<String>();
        Schema.SObjectType sObjType = Schema.getGlobalDescribe().get('Candidate__c');
        Map<String, Schema.FieldSet> fieldSetNameToItsRecord = sObjType.getDescribe().fieldsets.getMap();
        listOfFieldSetApiNames.addAll( fieldSetNameToItsRecord.keySet() );
        System.assertEquals(AdminSettingsControllerLWC.getFieldSetApiNames('Candidate__c'), listOfFieldSetApiNames);
    }

    @isTest
    static void testConstructDeploymentRequest() {
        Map<String, Fieldset_Setting__mdt> customMetadataRecords = Fieldset_Setting__mdt.getAll();
		Map<String, Fieldset_Setting__mdt> customMetadataRecordsForUpdate = customMetadataRecords.deepClone();
		customMetadataRecordsForUpdate.get('Recruiter').Candidate_Fieldset_in_Card__c = 'Candidate_card_recruiter';
        Test.startTest();        
            Metadata.DeployContainer container = AdminSettingsControllerLWC.constructDeploymentRequest(customMetadataRecordsForUpdate);
        Test.stopTest();
        System.assertEquals(2, container.getMetadata().size());
    }
}
