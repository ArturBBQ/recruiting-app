@isTest
public class CandidateCustomCreateFormHelperTest {
    
    @isTest
    static void testGetFieldSetForCreateForm(){
        List<String> newFieldList = CandidateCustomCreateFormHelper.getFieldSetForCreateForm('Candidate__c', 'Candidate_create_form');
        System.assertEquals(8, newFieldList.size());
    }
    
    @isTest
    static void testGetCurrentMetadataFieldSetsByForm() {
		List<Candidate_create_form_Setting__mdt> mtdList = CandidateCustomCreateFormHelper.getCurrentMetadataFieldSetsByForm();
        System.assertEquals('Candidate_create_form', mtdList[0].Candidate_Fieldset_create_form__c);
	}

}
