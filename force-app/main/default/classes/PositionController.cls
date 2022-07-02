public with sharing class PositionController {
    public String selectStatus {get;set;}
    public List<Position__c> positions {get;set;}
  
  public list<SelectOption> getStatus() {
    List<SelectOption> options = new List<SelectOption>();
    Set<String> posit = new set<String>();
    options.add(new SelectOption('All','All'));
    for(Position__c getStatus : [SELECT Name, Status__c FROM Position__c]){
      if(!posit.contains(getStatus.Status__c)){
        options.add(new SelectOption(getStatus.Status__c, getStatus.Status__c));
        posit.add(getStatus.Status__c);
      }
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
        return null;
    }
  }