'use strict';
angular.module('myApp')
.controller('InvoiceListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();    
      $('#InvoiceList').DataTable({
      responsive: true,
      "columnDefs": [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 2, targets: -1 },
        { responsivePriority: 3, targets: -1 },
        { responsivePriority: 4, targets: -1 },
        {"render": function(data, type, row) {
          return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
        },"targets": 0}
      ],
      "processing": true,
      "serverSide": true,
      "ajax": "server/SelectInvoiceList.php?type=" + $routeParams.type + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
    });

  }]);