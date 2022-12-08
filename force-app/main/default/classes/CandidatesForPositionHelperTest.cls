@isTest
private class CandidatesForPositionHelperTest {

    @isTest
    static void testGetCandidatesList (){        
        List <Job_Application__c> jobApp = CandidatesForPositionHelper.getCandidatesList('a017Q00000gbdqbQAA');
        System.assert(jobApp!=null);      
    }

    @isTest
    static void testGetCandidateForModal (){        
        List <Candidate__c> candidate = CandidatesForPositionHelper.getCandidateForModal('a007Q00000BUX8qQAH');
        System.assert(candidate!=null);      
    }

    @isTest
    static void testGetJobAppByCandidate (){        
        List <Job_Application__c> jobApp = CandidatesForPositionHelper.getJobAppByCandidate('a007Q00000BUX8qQAH');
        System.assert(jobApp!=null);      
    }

    @isTest
    static void testGetFieldSetForm(){
        List<String> newFieldList = CandidatesForPositionHelper.getFieldSetForm('Candidate__c', 'Candidate_card_interviewer');
        System.assertEquals(4, newFieldList.size());
    }
    
    @isTest
    static void testGetCurrentMetadataFieldSets() {
		List<Fieldset_Setting__mdt> mtdList = CandidatesForPositionHelper.getCurrentMetadataFieldSets('Recruiter');
        System.assertEquals('Candidate_card_recruiter', mtdList[0].Candidate_Fieldset_in_Card__c);
	}
}
