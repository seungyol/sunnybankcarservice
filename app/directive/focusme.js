angular.module('myApp')
  .directive('focusMe', function($timeout, $parse,$window) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            
            $window.setTimeout(function(){
                element[0].focus();
                element[0].focus();
            },100); 
          });
        }
      });
      element.bind('blur', function() {
        scope.$apply(model.assign(scope, false));
      })
    }
  };
});