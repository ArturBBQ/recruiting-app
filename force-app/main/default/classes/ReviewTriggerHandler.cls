public with sharing class ReviewTriggerHandler {
    public static void countReviewTriggerHandler(List<Review__c> reviewList) {
        Set<Id> jaIds = new Set<Id>();
        Decimal averageRating;

        for(Review__c review : reviewList){
            jaIds.add(review.Job_Application__c);
        }
        List<AggregateResult> groupedRes = [SELECT AVG(Rating__c)ar FROM Review__c WHERE Job_Application__c IN: jaIds];
        for(AggregateResult aggRes : groupedRes){
                averageRating = (Decimal)aggRes.get('ar'); 
        }
        List<Job_Application__c> jaList = new List<Job_Application__c>();
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
