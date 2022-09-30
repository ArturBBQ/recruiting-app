public with sharing class ReviewTriggerHandler {
    public static void countReview(List<Review__c> reviewList) {
        Set<Id> jaIds = new Set<Id>();
        Decimal averageRating;

        for(Review__c review : reviewList){
            jaIds.add(review.Job_Application__c);
        }

        List<Job_Application__c> jaList = new List<Job_Application__c>();

        Map<Id, Job_Application__c> jaMap = new Map<Id, Job_Application__c>();
        List<AggregateResult> groupedRes = [SELECT Job_Application__c, AVG(Rating__c)ar FROM Review__c WHERE Job_Application__c IN: jaIds GROUP BY Job_Application__c];
        for(AggregateResult aggRes : groupedRes){
            averageRating = (Decimal)aggRes.get('ar'); 
            Job_Application__c ja = new Job_Application__c();
            jaMap.put((Id)aggRes.get('Job_Application__c'), ja);
        }

        List<Job_Application__c> jobAppList = [SELECT Id, Name, Average_rating__c, Number_of_reviews__c, (SELECT Id, Rating__c FROM Reviews__r) 
                                               FROM Job_Application__c 
                                               WHERE Id IN :jaIds];
        for(Job_Application__c ja : jobAppList){
            ja.Number_of_reviews__c = ja.Reviews__r.size();
            ja.Average_rating__c = averageRating;
            jaList.add(ja);
        }
        update jaList;
    }
}
