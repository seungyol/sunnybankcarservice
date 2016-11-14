angular.module('commonApp').service('Suburb', ['$q','$http','$resource',function($q, $http, $resource) {
    this.search = function(query) {
        if(query.length >= 3) {
            var PostCodes = $resource('server/SelectPostCodes.php', {term: query}).query();
            return PostCodes.$promise;
            
        } else {
            return [];
        }  
    };  
}]);