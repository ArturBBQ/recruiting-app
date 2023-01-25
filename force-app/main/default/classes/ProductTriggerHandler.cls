public with sharing class ProductTriggerHandler {
    public static void availabilityOfProducts (List<Product__c> productsList) {
        for(Product__c product : productsList) {
            if (product.Balance__c > 0) {
                product.Available__c = true;
            } else if (product.Balance__c == 0) {
                product.Available__c = false;
            }
        }
    }
}