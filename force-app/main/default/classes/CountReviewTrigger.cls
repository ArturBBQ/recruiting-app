public with sharing class CountReviewTrigger {
    public static void countReview (List<Review__c> reviewList) {
        Set<Id> jaIds = new Set<Id>();
        List<Job_Application__c> jaList = new List<Job_Application__c>();
        Decimal averageRating;

        for(Review__c review : reviewList){
            jaIds.add(review.Job_Application__c); 
        }
        List<Job_Application__c> jobAppList = [SELECT Id, Name, Number_of_reviews__c, (SELECT Id, Rating__c FROM Reviews__r) 
                                                FROM Job_Application__c 
                                                WHERE Id IN :jaIds];
        for(Job_Application__c ja : jobAppList){
            List<AggregateResult> groupedRes = [SELECT AVG(Rating__c)ar FROM Review__c WHERE Job_Application__c =: ja.Id];
            for(AggregateResult aggRes : groupedRes){
                averageRating = (Decimal)aggRes.get('ar'); 
            }
            ja.Number_of_reviews__c = ja.Reviews__r.size();
            ja.Average_rating__c = averageRating;
            jaList.add(ja);
            
        }
        update jaList;
    }

    public static void countReviewUpdate (List<Review__c> reviewList, Map<Id, Review__c> oldMap){
        Set<Id> jaIds = new Set<Id>();
        List<Job_Application__c> jaList = new List<Job_Application__c>();
        Decimal averageRating;

        for(Review__c review : reviewList){
                jaIds.add(review.Job_Application__c); 
            if(review.Job_Application__c != oldMap.get(review.Id).Job_Application__c){
                jaIds.add(oldMap.get(review.Id).Job_Application__c);  // old parent id 
            }
        }
        List<Job_Application__c> jobAppList = [SELECT Id, Name, Average_rating__c, Number_of_reviews__c, (SELECT Id, Rating__c FROM Reviews__r) 
                                               FROM Job_Application__c 
                                               WHERE Id IN :jaIds];
        for(Job_Application__c ja : jobAppList){
            List<AggregateResult> groupedRes = [SELECT AVG(Rating__c)ar FROM Review__c WHERE Job_Application__c =: ja.Id];
            for(AggregateResult aggRes : groupedRes){
                averageRating = (Decimal)aggRes.get('ar'); 
            }
            ja.Number_of_reviews__c = ja.Reviews__r.size();
            ja.Average_rating__c = averageRating;
            jaList.add(ja);
        }
        update jaList; 
    }
}