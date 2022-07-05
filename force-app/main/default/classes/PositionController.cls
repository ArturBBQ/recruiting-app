public with sharing class PositionController {
    public String selectStatus {get;set;}
    public List<Position__c> positions {get;set;}


  public List<SelectOption> getStatusList(){
    List<SelectOption> options = new List<SelectOption>();
    options.add(new SelectOption('All','All'));
    Schema.DescribeFieldResult fieldResult = Position__c.Status__c.getDescribe();
    List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
    for( Schema.PicklistEntry getStatus : ple){
      options.add(new SelectOption(getStatus.getLabel(), getStatus.getValue()));
      }
    return options;
  }
  
  public void getFilteredStatus() {
    if(selectStatus.equals('All')) {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c FROM Position__c];
    } else {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c FROM Position__c WHERE Status__c =: selectStatus];
    }
  }
  
  public PositionController() {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c FROM Position__c ORDER BY Name];
  }
  
  public List<Position__c> getPosition() {
      return positions; 
  }
  
  public PageReference save() {
    update positions;
    PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
    pageRef.setRedirect(true); 
    return pageRef; 
  }
}
