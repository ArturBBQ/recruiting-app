trigger JobApplicationTrigger on Job_Application__c (before update) {
    JobApplicationTriggerHandler.changeJobApplicationStatus(Trigger.New);
}