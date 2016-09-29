angular.module('myApp')
  .factory('ConfirmFactory',['$rootScope','$uibModal','$log', function($rootScope, $uibModal,$log) {
    var confirmService = {};
    
    confirmService.open = function (title,content, callback) {
      var message = {};
      message.title = title;
      message.content = content;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
//        size: size,
        resolve: {
          message: function () {
            return message;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if(callback) {
            callback();
        }
      }, function () {
        $log.info('Cancel Clicked : ' + new Date());
      });
    };        
    return confirmService;
  }]);


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('myApp').controller('ModalInstanceCtrl', function ($uibModalInstance, message, $scope) {
  var $ctrl = this;
  $ctrl.message = message;
  
  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };   
});
