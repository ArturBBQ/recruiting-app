@isTest
private class PositionProcessorTest {
    @isTest 
    static void test() {
        Position__c[] positions = TestDataFactory.createPositions(20, 'Open', true);
        
        Test.startTest();
        PositionProcessor posProc = new PositionProcessor();
        Database.executeBatch(posProc);
        Test.stopTest();

        System.debug('positions ----->' + [SELECT Name, Status__c  FROM Position__c]);
        System.assertEquals(20, [SELECT count() FROM Position__c WHERE Status__c = 'Closed']);
    }
}
