angular.module('commonApp')
  .factory('AppAlert', ['$rootScope', function($rootScope) {
    $rootScope.alerts = [];
    alertService = { 
      add: function(type, msg,callback) {
        $rootScope.alerts.push({ type: type, msg: msg, close: function() { 
            alertService.closeAlert(this);
            if(callback) {
                callback();
            }
        }});
      },
      closeAlert: function(alert) {
        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function (index) {
        $rootScope.alerts.splice(index, 1);
      }
    };
      
    return alertService;
  }]);
