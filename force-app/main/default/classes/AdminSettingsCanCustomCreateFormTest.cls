@isTest
private class AdminSettingsCanCustomCreateFormTest {
    
    @isTest
    static void testGetFieldSetApiNames() {
        List<String> listOfFieldSetApiNames = new List<String>();
        Schema.SObjectType sObjType = Schema.getGlobalDescribe().get('Candidate__c');
        Map<String, Schema.FieldSet> fieldSetNameToItsRecord = sObjType.getDescribe().fieldsets.getMap();
        listOfFieldSetApiNames.addAll( fieldSetNameToItsRecord.keySet() );
        System.assertEquals(AdminSettingsCandidateCustomCreateForm.getFieldSetApiNames('Candidate__c'), listOfFieldSetApiNames);
    }

    @isTest
    static void testGetCurrentFieldSetsByForm(){          
        Map<String, Candidate_create_form_Setting__mdt> fieldSetsByForm = AdminSettingsCandidateCustomCreateForm.getCurrentFieldSetsByForm();
        System.assertEquals(1, fieldSetsByForm.size());
    }

    @isTest
    static void testConstructDeploymentRequest() {
        Map<String, Candidate_create_form_Setting__mdt> customMetadataRecords = Candidate_create_form_Setting__mdt.getAll();
		Map<String, Candidate_create_form_Setting__mdt> customMetadataRecordsForUpdate = customMetadataRecords.deepClone();
		customMetadataRecordsForUpdate.get('Create_form_New_Candidate').Candidate_Fieldset_create_form__c = 'Candidate_create_form';
        Test.startTest();        
            Metadata.DeployContainer container = AdminSettingsCandidateCustomCreateForm.constructDeploymentRequest(customMetadataRecordsForUpdate);
        Test.stopTest();
        System.assertEquals(1, container.getMetadata().size());
    }

}
