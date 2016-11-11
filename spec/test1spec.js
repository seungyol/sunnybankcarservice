//describe('UserDetailController', function() {
//    beforeEach(module('myApp'));
//    var $controller;
//    
//    beforeEach(inject(function(_$controller_){
//        $controller = _$controller_;
//    }));
//    
//    describe('$scope.querySearch', function(){
//        it('returns "RUNCORN" if entering "RUNC"', function() {
//            var $route = {}, AppAlert = {}, $location = {}, $rootScope = {}, AuthFactory = {}, $routeParams = {}, $http = {}, $scope = {};
//            var controller = $controller('UserDetailController', {
//                $route: $route, AppAlert: AppAlert, $location: $location, 
//                $rootScope: $rootScope, AuthFactory: AuthFactory, $routeParams: $routeParams,
//                $http: $http, 
//                $scope: $scope
//            });
//       
//            var result = $scope.querySearch("RUNC");
//            expect(result).toEqual('RUNCORN');
//        });
//    });
//   
//});