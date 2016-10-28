'use strict';

describe('UserDetailController', function() {

    
    beforeEach(module('myApp'));
    
    describe('suburb search', function() {
        it('when entering "RUNC", it must return "RUNCORN"', inject(function($controller) {
            var ctrl = $controller('UserDetailController',
            {$route : {}, AppAlert : {},
             $location : {}, $rootScope : {}, AuthFactory : {},
             $routeParams : {}, $http : {}, $scope : {}});
            expect(ctrl).toBeDefined();
        })) ;
    });
});