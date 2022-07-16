public with sharing class PositionController {
    public String selectStatus {get;set;}
    public List<Position__c> positions {get;set;}

  public positionController() {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                  FROM Position__c 
                  ORDER BY Name];
  }
  
  public List<Position__c> getPosition() {
      return positions; 
  }

  public List<SelectOption> getStatusList(){
    List<SelectOption> options = new List<SelectOption>();
    options.add(new SelectOption('All','All'));
    Schema.DescribeFieldResult fieldResult = Position__c.Status__c.getDescribe();
      for(Schema.PicklistEntry getStatus : fieldResult.getPicklistValues()){
        options.add(new SelectOption(getStatus.getLabel(), getStatus.getValue()));
      }
      return options;
  }
  
  public void getFilteredStatus() {
    if(selectStatus == 'All') {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                  FROM Position__c
                  ORDER BY Name];
    } else {
      positions = [SELECT Name, Status__c, Vacancy_opening_date__c, Application_deadline__c, Min_Salary__c, Max_Salary__c 
                  FROM Position__c
                  WHERE Status__c =: selectStatus
                  ORDER BY Name];
    }
  }
  
  public PageReference save() {
    update positions;
    PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
    pageRef.setRedirect(true); 
    return pageRef; 
  }
}