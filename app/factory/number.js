angular.module('myApp')
  .factory('numberFactory', function() {
    return {
      integerOnly: function(input, length) {
          console.log(input);
          input.attr('maxlength',length);
          
          input.keydown(function (event) {
            console.log("keydown", event);
            if(
              (event.keyCode >= 48 && event.keyCode <=57) ||
              (event.keyCode >= 96 && event.keyCode <= 105) ||
              (event.keyCode === 8 || event.keyCode === 37
                || event.keyCode === 39 || event.keyCode === 46
                || event.which === 9
              )
            ) 
            {}
            else {
              event.preventDefault();    
            }
          });
      }  
    };
});