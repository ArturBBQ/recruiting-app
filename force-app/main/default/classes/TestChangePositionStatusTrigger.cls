@isTest
private class TestChangePositionStatusTrigger {
    @isTest
    static void TestChangePositionStatus() {
        Position__c position = new Position__c(Name = 'Test Position', Status__c = 'Open', Application_deadline__c = System.today().addDays(5));
        insert position;
        position.Status__c = 'Closed';
                
        Test.startTest();
            update position;
        Test.stopTest(); 

        List<Position__c> updatePositionDeadline = [SELECT Name, Status__c, Application_deadline__c FROM Position__c WHERE Id = :position.Id];
        System.debug('updatePositionDeadline --------> ' + updatePositionDeadline);
        System.assertEquals(System.today(), updatePositionDeadline.get(0).Application_deadline__c);
    }
}
