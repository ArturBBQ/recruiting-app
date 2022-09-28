@isTest
public with sharing class TestDataFactory {
            
    public static List<Position__c> createPositions(Integer numPos, String status, Boolean doInsert){
        List<Position__c> positions = new List<Position__c>();
        for(Integer i=1;i<numPos;i++) {
                Position__c pos = new Position__c(Name = 'position' + i, Status__c = status);
                positions.add(pos);
        }
        if (doInsert) {
            insert positions;
        }
        return positions;
        } 
}
