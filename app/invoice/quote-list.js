'use strict';
angular.module('myApp')
  .controller('QuoteListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();   
    $('#QuoteList').DataTable({
        
      "columnDefs": [
        {"render": function(data, type, row) {
          return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
        },"targets": 0}
      ],
      "processing": true,
      "serverSide": true,
      "ajax": "server/SelectInvoiceList.php?type=Q" + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
    });       
  }]);