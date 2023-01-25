public with sharing class InterestTriggerHandler {
    public static void createDealAfterInterest(List<Interest__c> interestList) {
        List<Deal__c> deal = new List<Deal__c>();
        for(Interest__c i : interestList) {
            if (i.Status__c == 'Converted') {
                i.Converted_Date__c = System.today();
                deal.add(new Deal__c(Name=i.Deal_Info__c, Stage__c='New', Interest__c=i.Id));
            }
        }
        insert deal;
    }
}