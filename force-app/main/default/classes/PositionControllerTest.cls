@isTest
private class PositionControllerTest {

    @isTest
    static void testGetStatusList() {
        PositionController pageCntrl = new PositionController();
        Schema.DescribeFieldResult status = Position__c.Status__c.getDescribe();
        List<Schema.PicklistEntry> statusValues = status.getPicklistValues();
        List<SelectOption> options = pageCntrl.getStatusList();
        
        System.assertEquals(4, options.size());
        System.assertEquals(3, statusValues.size());
    } 

    @isTest
    static void testGetFilteredStatus() {
        
        Position__c position1 = new Position__c(Name = 'Developer', Status__c = 'Open');
        insert position1;
        Position__c position2 = new Position__c(Name = 'Admin', Status__c = 'Closed');
        insert position2;

        PositionController pageCntrl = new PositionController();
        pageCntrl.selectStatus = 'Closed';
        pageCntrl.getFilteredStatus();
        pageCntrl.positions = [SELECT Name, Status__c FROM Position__c];

        System.assertEquals(2, pageCntrl.positions.size());
        System.assertEquals('Developer', pageCntrl.positions.get(0).Name);
        System.assertEquals('Closed', pageCntrl.selectStatus);
        System.assertEquals('Open', pageCntrl.positions.get(0).Status__c);
    }
    
    @isTest 
    static void testSave() {
        Position__c position1 = new Position__c(Name = 'Developer', Status__c = 'Open');
        insert position1;
        Position__c position2 = new Position__c(Name = 'Admin', Status__c = 'Closed');
        insert position2;

        PositionController pageCntrl = new PositionController();
        PageReference pager = page.PositionVFPage;
        Test.setCurrentPage(pager);

        Test.startTest();
            pageCntrl.save();
        Test.stopTest();
        
        pageCntrl.positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                               FROM Position__c];

        
        System.assertEquals('Open', pageCntrl.positions.get(0).Status__c);
                            
    }
}