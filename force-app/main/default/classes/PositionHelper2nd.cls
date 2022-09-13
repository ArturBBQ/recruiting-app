public with sharing class PositionHelper2nd {
    
    @AuraEnabled (cacheable=true)
    public static List<Position__c> getPositionList() {
        return  [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                FROM Position__c 
                ORDER BY Name];
    }
    
    @AuraEnabled (cacheable=true)
    public static List<Position__c> getRecordsByStatus(String selectStatus, integer offset) {
        String queryPosition = 'SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c ' 
                             + 'FROM Position__c ';
        if (selectStatus != 'All') {
            queryPosition += 'WHERE Status__c =: selectStatus ';
        } 
        queryPosition += 'ORDER BY Name ASC OFFSET :offset';
        return Database.query(queryPosition);                      
    }
     
    @AuraEnabled
    public static void updatePosition (List<Position__c> positions) {
        System.debug(positions);
        update positions;
    } 
}
