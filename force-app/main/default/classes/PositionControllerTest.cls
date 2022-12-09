@isTest
private class PositionControllerTest {

    @isTest
    static void testGetStatusList() {
        PositionController pageCntrl = new PositionController();
        Schema.DescribeFieldResult status = Position__c.Status__c.getDescribe();
        List<Schema.PicklistEntry> statusValues = status.getPicklistValues();
        List<SelectOption> options = pageCntrl.getStatusList();
        
        System.assertEquals(statusValues.size()+1, options.size());
    } 

    @isTest
    static void testGetFilteredStatus() {
        Position__c[] positions = TestDataFactory.createPositions(4,'Open', true);
        PositionController pageCntrl = new PositionController();
        pageCntrl.selectStatus = 'Open';

        Test.startTest();
            pageCntrl.getFilteredStatus();
        Test.stopTest();

        System.assertEquals(4, pageCntrl.positions.size());
    }
    
    @isTest 
    static void testSave() {
        Position__c position1 = new Position__c(Name = 'Developer', Status__c = 'Open');
        insert position1;
        
        PositionController pageCntrl = new PositionController();           
        position1.Name = 'Admin';
        update position1;
        pageCntrl.positions = [SELECT Name, Status__c FROM Position__c WHERE Id = :position1.id]; 

        Test.startTest();        
            PageReference pager = page.PositionVFPage;
            Test.setCurrentPage(pager);
            pageCntrl.save();
        Test.stopTest();

        List <Position__c> savedPos = [SELECT Name, Status__c FROM Position__c WHERE Id = :position1.id LIMIT 1];
        System.assertEquals('Admin', savedPos.get(0).Name);
    }
}