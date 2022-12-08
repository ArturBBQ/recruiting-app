@isTest
private class PositionHelper2ndTest {
    @isTest
    static void testGetPositionList() {        
        List <Position__c> positions = PositionHelper2nd.getPositionList();
        System.assert(positions!=null);      
    }

    @isTest
    static void testGetRecordsByStatus() {
        List <Position__c> positions = TestDataFactory.createPositions(4,'Open', true);

        Test.startTest();
            PositionHelper2nd.getRecordsByStatus('Open', 5);
        Test.stopTest();

        System.assertEquals(4, positions.size());
    }
    

    @isTest
    static void testUpdatePosition() {
        List<Position__c> positions = TestDataFactory.createPositions(10, 'Open', true);
        positions[0].Status__c = 'Closed';
        
        Test.startTest();
            PositionHelper2nd.updatePosition(positions);
        Test.stopTest(); 

        List<Position__c> updatePositionStatus = [SELECT Name, Status__c FROM Position__c];
        System.debug('updatePositionStatus --------> ' + updatePositionStatus);
        System.assertEquals('Closed', updatePositionStatus.get(0).Status__c);
    }
}
