@isTest
private class PositionControllerTest {
    
    @isTest
    static void testPositionController() {
        Position__c posit = new Position__c();
		posit.Name = 'Accountant';
		posit.Status__c = 'Open';
        insert posit;
		Position__c lstPosit=[SELECT Name, Status__c FROM Position__c WHERE Name='Accountant' LIMIT 1];
        System.assert(lstPosit!=null);   
    }

    @isTest
    static void testGetStatusList() {
        PositionController pageCntrl = new PositionController();
        Test.startTest();
            List<SelectOption> options = pageCntrl.getStatusList();
        Test.stopTest();
        System.assertEquals(options.get(0).getValue(), 'All');
    }


    @TestSetup static void setup() {
        Position__c position1 = new Position__c(Name = 'Developer', Status__c = 'Open');
        insert position1;
        Position__c position2 = new Position__c(Name = 'Admin', Status__c = 'Closed');
        insert position2;
    }  

    @isTest
    static void testGetFilteredStatus() {
        Test.startTest();
            PositionController pageCntrl = new PositionController();
            pageCntrl.selectStatus = 'Closed';
            pageCntrl.getFilteredStatus();
        Test.stopTest();
        
        List<Position__c> positions = [SELECT Name, Status__c FROM Position__c];

        System.assertEquals(2, positions.size());
        System.assertEquals('Developer', positions.get(0).Name);
        System.assertEquals('Closed', pageCntrl.selectStatus);
        System.assertEquals('Admin', positions.get(1).Name);
    }
    
    @isTest 
    static void testSave() {
        PositionController pageCntrl = new PositionController();
        List<Position__c> positions = new List<Position__c> ();
        PageReference pager = page.PositionVFPage;
        Test.setCurrentPage(pager);
        update positions;
        pageCntrl.save();
    }
}