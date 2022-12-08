@isTest
private class PositionHelperTest {
    
    @isTest
    static void testGetPositionList() {        
        List <Position__c> positions = PositionHelper.getPositionList();
        System.assert(positions!=null);      
    }

    @isTest
    static void testUpdatePosition() {
        List<Position__c> positions = TestDataFactory.createPositions(10, 'Open', true);
        positions[0].Status__c = 'Closed';
        
        Test.startTest();
            PositionHelper.updatePosition(positions);
        Test.stopTest(); 

        List<Position__c> updatePositionStatus = [SELECT Name, Status__c FROM Position__c];
        System.debug('updatePositionStatus --------> ' + updatePositionStatus);
        System.assertEquals('Closed', updatePositionStatus.get(0).Status__c);
    }
}
