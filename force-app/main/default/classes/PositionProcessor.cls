public class PositionProcessor implements Database.Batchable<sObject>{
        public Database.QueryLocator start(Database.BatchableContext bc) {
            return Database.getQueryLocator(
                'SELECT Id FROM Position__c WHERE Vacancy_opening_date__c < LAST_90_DAYS' 
            );
        }
        public void execute(Database.BatchableContext bc, List<Position__c> scope){
            List<Position__c> positionList = new List<Position__c>();
            for (Position__c position : scope) {
                    position.Status__c = 'Closed';
                    positionList.add(position); 
            }
            update positionList;
        }
        public void finish(Database.BatchableContext bc){
            
        }
}
