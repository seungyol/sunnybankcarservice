(function() {
    "use strict";

    angular.module('commonApp', []);
    angular.module('userEdit', [
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ngResource',
      'ui.bootstrap',
      'commonApp'
    ]);
    angular.module('customer',[
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ui.bootstrap',
      'commonApp'    
    ]);
    // Declare app level module which depends on views, and components
    angular.module('myApp', [
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ui.bootstrap',
      'customer',
      'userEdit',
      'commonApp'
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
            template: '<customer-list></customer-list>'
        }).when('/login', {
          templateUrl: 'login/login.html',
          controller: 'LoginCtrl'
        }).when('/customer-edit/:id',{
           template: '<customer-edit></customer-edit>',
        }).when('/invoice-list', {
          templateUrl: 'invoice/invoice-list.html',
          controller: 'InvoiceListController'
        }).when('/previous-list', {
          templateUrl: 'invoice/previous-list.html',
          controller: 'PreviousListController'
        }).when('/quote-list', {
          templateUrl: 'invoice/quote-list.html',
          controller: 'QuoteListController'
        }).when('/unpaid-list', {
          templateUrl: 'invoice/unpaid-list.html',
          controller: 'UnpaidListController'      
        }).when('/invoice-edit/:ID/:CustomersID/:CustomerCarsID',{
                   templateUrl: 'invoice/invoice-edit.html',
                   controller: 'InvoiceEditController'
        }).when('/user-list', {
            templateUrl: 'user/user-list.html',
            controller: 'UserListController'
        }).when('/user-edit/:ID', {
          template: '<user-edit></user-edit>'
        }).when('/setlement', {
            templateUrl: 'settlement/settlement.html',
            controller: 'SettlementController'
        }).when('/partinvoice-list', {
            templateUrl: 'partinvoice/partinvoice-list.html',
            controller: 'PartInvoiceListController'
        }).otherwise({redirectTo: '/login'});
    }]);
})();

