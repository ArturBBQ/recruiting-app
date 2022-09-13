public with sharing class PositionHelper {  

    @AuraEnabled (cacheable=true)
    public static List<Position__c> getPositionList() {
        return [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                FROM Position__c 
                ORDER BY Name];
    }
    
    @AuraEnabled
    public static void updatePosition (List<Position__c> positions) {
        System.debug(positions);
        update positions;
    } 
}
