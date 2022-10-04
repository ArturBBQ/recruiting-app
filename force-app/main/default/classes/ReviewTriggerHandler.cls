public with sharing class ReviewTriggerHandler {
    public static void countReview(List<Review__c> reviewList) {
        Set<Id> jaIds = new Set<Id>();
        for(Review__c review : reviewList){
            jaIds.add(review.Job_Application__c);
        }

        Map<Id, Job_Application__c> jobAppMap = new Map<Id, Job_Application__c>([SELECT Id, Name, Average_rating__c, Number_of_reviews__c, 
                                                                                (SELECT Id, Rating__c FROM Reviews__r) 
                                                                                FROM Job_Application__c 
                                                                                WHERE Id IN :jaIds]);

        List<AggregateResult> groupedRes = [SELECT Job_Application__c, AVG(Rating__c)avRating 
                                            FROM Review__c 
                                            WHERE Job_Application__c IN: jaIds 
                                            GROUP BY Job_Application__c];

        for(AggregateResult ar : groupedRes){
            Id recordId = (Id)ar.get('Job_Application__c');
            List<Review__c> allChildReviews = jobAppMap.get(recordId).Reviews__r;
            jobAppMap.get(recordId).Number_of_reviews__c = allChildReviews != null ? allChildReviews.size() : 0;
            jobAppMap.get(recordId).Average_rating__c = (Decimal)ar.get('avRating');
        }
        update jobAppMap.values();
    }
}
