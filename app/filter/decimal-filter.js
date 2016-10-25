angular.module('myApp').filter('decimal2', function() {
    return function(input) {
        return parseFloat(Math.round(input * 100) / 100).toFixed(2);
    };
});