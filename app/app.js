'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'ngMaterial',
  'ngMessages',
  'myApp.version',
  'ui.bootstrap',
  'MyApp'
  
]).run(function($rootScope) {
    $rootScope.loginResult = null;
})
.config(['$locationProvider', '$routeProvider','$mdDateLocaleProvider', function($locationProvider, $routeProvider, $mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return date ? moment(date).format('DD/MM/YYYY') : '';
  };  

  $mdDateLocaleProvider.parseDate = function(dateString) {
    var m = moment(dateString, 'DD/MM/YYYY', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };    
  $locationProvider.hashPrefix('!');
  $routeProvider
    .when('/customer-list',{
               templateUrl: 'customer/customer-list.html',
               controller: 'CustomerListController'
    }).when('/login', {
      templateUrl: 'login/login.html',
      controller: 'LoginCtrl'
    }).when('/customer-edit/:id',{
       templateUrl: 'customer/customer-edit.html',
       controller: 'CustomerEditController'
    }).when('/invoice-list', {
      templateUrl: 'invoice/invoice-list.html',
      controller: 'InvoiceListController'
    }).when('/previous-list', {
      templateUrl: 'invoice/previous-list.html',
      controller: 'PreviousListController'
    }).when('/quote-list', {
      templateUrl: 'invoice/quote-list.html',
      controller: 'QuoteListController'
    }).when('/invoice-edit/:ID/:CustomersID/:CustomerCarsID',{
               templateUrl: 'invoice/invoice-edit.html',
               controller: 'InvoiceEditController'
    }).when('/user-list', {
        templateUrl: 'user/user-list.html',
        controller: 'UserListController'
    }).when('/user-edit/:ID', {
        templateUrl: 'user/user-edit.html',
        controller: 'UserDetailController'
    }).when('/setlement', {
        templateUrl: 'settlement/settlement.html',
        controller: 'SettlementController'
    }).when('/partinvoice-list', {
        templateUrl: 'partinvoice/partinvoice-list.html',
        controller: 'PartInvoiceListController'
    }).otherwise({redirectTo: '/login'});
}]);
