'use strict';

angular.module('customer')
.component('customerList', {
    templateUrl: 'customer/customer-list.html',
    controller: ['$location','$scope','$rootScope', 'AuthFactory', function( $location, $scope,$rootScope, AuthFactory){
  AuthFactory.checkLogin();
  $rootScope.loginResult = AuthFactory.getLoginDetail();
    var oTable = $("#CustomerList").dataTable({
    "columnDefs": [
      {
        "render": function ( data, type, row ) {
            return "<a href='#!/customer-edit/" + data +"'>"+ data + "</a>";
        },
        "targets": 0
      },
      {"render": function (data, type, row) {
          return "<a href='#!/customer-edit/" + row.ID +"'>"+ data + "</a>";
      },"targets":1}
      
    ],      
    "bJQueryUI": true,
    "processing": true,
    "serverSide": true,
    "ajax": "server/SelectCustomerList.php?CompaniesID=" + $rootScope.loginResult.CompaniesID
  });
  $scope.goNew = function(){
    $location.path('/customer-edit/0').replace();
  };		
  $("button").button();    
}]    
});