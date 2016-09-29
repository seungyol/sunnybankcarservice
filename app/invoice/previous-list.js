'use strict';
angular.module('myApp')
  .controller('PreviousListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();   
    $('#PreviousList').DataTable({
        
      "columnDefs": [
        {"render": function(data, type, row) {
          return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
        },"targets": 0}
      ],
      "processing": true,
      "serverSide": true,
      "ajax": "server/SelectInvoiceList.php?type=P" + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
    });    
  }]);