public with sharing class PositionHelper2nd {
    
    @AuraEnabled (cacheable=true)
    public static List<Position__c> getPositionList() {
        List<Position__c> positions;
        if (Position__c.SObjectType.getDescribe().isAccessible() &&
            Schema.SObjectType.Position__c.fields.Name.isAccessible() &&
            Schema.SObjectType.Position__c.fields.Status__c.isAccessible() &&
            Schema.SObjectType.Position__c.fields.Vacancy_opening_date__c.isAccessible() &&
            Schema.SObjectType.Position__c.fields.Application_deadline__c.isAccessible() &&
            Schema.SObjectType.Position__c.fields.Min_Salary__c.isAccessible() &&
            Schema.SObjectType.Position__c.fields.Max_Salary__c.isAccessible()
            ) {
            positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                        FROM Position__c 
                        ORDER BY Name];
        }
        return positions;
    }
    
    @AuraEnabled (cacheable=true)
    public static List<Position__c> getRecordsByStatus(String selectStatus, integer offset) {
        String queryPosition = 'SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c ' 
                             + 'FROM Position__c ';
        if (selectStatus != 'All') {
            queryPosition += 'WHERE Status__c =: selectStatus ';
        } 
        queryPosition += 'ORDER BY Name ASC OFFSET :offset';
        List<Position__c> positions;
        try {
            if (Position__c.SObjectType.getDescribe().isAccessible() &&
                Schema.SObjectType.Position__c.fields.Name.isAccessible() &&
                Schema.SObjectType.Position__c.fields.Status__c.isAccessible() &&
                Schema.SObjectType.Position__c.fields.Vacancy_opening_date__c.isAccessible() &&
                Schema.SObjectType.Position__c.fields.Application_deadline__c.isAccessible() &&
                Schema.SObjectType.Position__c.fields.Min_Salary__c.isAccessible() &&
                Schema.SObjectType.Position__c.fields.Max_Salary__c.isAccessible()
                ) {
                positions = Database.query(queryPosition);
                }
        } catch (System.QueryException e) {
                System.debug('System.QueryException: ' + e.getMessage());
        } 
        return positions;                     
    }
     
    @AuraEnabled
    public static void updatePosition (List<Position__c> positions) {
        try {
            if (Schema.sObjectType.Position__c.isUpdateable()){
                update positions;
            }
        } catch (DMLException e) {
            System.debug('DMLException: ' + e.getMessage());
        } 
    }
}
