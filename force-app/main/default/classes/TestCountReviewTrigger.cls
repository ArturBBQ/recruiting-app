@isTest
private class TestCountReviewTrigger {
    @isTest
    static void TestReviewInsert() {
        Position__c position = new Position__c(Name = 'Test Position');
        insert position;
        Candidate__c candidate = new Candidate__c(Name = 'Test Name', First_Name__c = 'Test FName');
        insert candidate;
        Job_Application__c ja = new Job_Application__c(Candidate__c = candidate.Id, Position__c = position.Id);
        insert ja;
        Review__c review1 = new Review__c(Job_Application__c = ja.Id, Rating__c = 5);                                      
        insert review1;
        Review__c review2 = new Review__c(Job_Application__c = ja.Id, Rating__c = 9);  
        Review__c review3 = new Review__c(Job_Application__c = ja.Id, Rating__c = 4);  

        Test.startTest();                            
            insert review2;
            insert review3;
        Test.stopTest();

        List<Job_Application__c> countJAFields = [SELECT Name, Number_of_reviews__c, Average_rating__c FROM Job_Application__c WHERE Id = :ja.Id];
        System.debug('countJAFields --------> ' + countJAFields);
    }

    @isTest
    static void TestReviewDelete() {
        Position__c position = new Position__c(Name = 'Test Position');                                      
        insert position;
        Candidate__c candidate = new Candidate__c(Name = 'Test Name', First_Name__c = 'Test FName');
        insert candidate;
        Job_Application__c ja = new Job_Application__c(Candidate__c = candidate.Id, Position__c = position.Id);
        insert ja;
        Review__c review1 = new Review__c(Job_Application__c = ja.Id, Rating__c = 5);                                      
        insert review1;
        Review__c review2 = new Review__c(Job_Application__c = ja.Id, Rating__c = 9);                                      
        insert review2;

        Test.startTest();
            delete review1;
        Test.stopTest();

        List<Job_Application__c> countJAFields = [SELECT Name, Number_of_reviews__c, Average_rating__c FROM Job_Application__c WHERE Id = :ja.Id];
        System.debug('countJAFields --------> ' + countJAFields);
    }
}
