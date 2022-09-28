@isTest
private class TestHiredJobApplicationTrigger {
    @isTest
    static void TestHiredJobApplicationTrigger() {
        Position__c position = new Position__c(Name = 'Test Position', Status__c = 'Open');                                      
        insert position;
        Candidate__c candidate = new Candidate__c(Name = 'Test Name', First_Name__c = 'Test FName');
        insert candidate;
        Job_Application__c ja = new Job_Application__c(Status__c = 'Reject', Candidate__c = candidate.Id, Position__c = position.Id);
        insert ja;
        ja.Status__c = 'Hired';
        
        Test.startTest();
            update ja;
        Test.stopTest(); 

        List<Position__c> updatePositionStatus = [SELECT Name, Status__c FROM Position__c WHERE Id = :position.Id];
        System.debug('updatePositionStatus --------> ' + updatePositionStatus);
        System.assertEquals('Closed', updatePositionStatus.get(0).Status__c);
    }
}
