(function() {
    'use strict';

    angular.module('customer')
    .component('customerEdit', {
        templateUrl: 'customer/customer-edit.html',
        controller: ['$q', '$location','$http','$routeParams','$route', 'AppAlert','ConfirmFactory',  '$uibModal','$rootScope', '$scope','AuthFactory', 'CustomerFactory', 'Suburb',
      function($q, $location, $http, $routeParams,$route, AppAlert,ConfirmFactory, $uibModal,$rootScope, $scope,AuthFactory, CustomerFactory, Suburb){
      //Login check & Add login session to rootScope                                        
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();
        
        if(parseInt($routeParams.id, 10) === 0){
            CustomerFactory.AddBlankCustomer();
            return;
        }

        //Suburb Autocomlete
        $scope.querySearch = function(query) {
            return Suburb.search(query);  
        };

        $scope.CarPopup = {};

        $scope.SaveCustomer = function() {
          if(typeof($scope.selectedSuburb) === 'string'){
              $scope.cust.suburb = $scope.selectedSuburb;
          } else if(typeof($scope.selectedSuburb) === 'object' && $scope.selectedSuburb != null){
              $scope.cust.suburb = $scope.selectedSuburb.label;
          } else {
              $scope.cust.suburb = "";
          }

          CustomerFactory.SaveCustomer($scope.cust);
        };    

        $scope.DeleteCustomer = function() {CustomerFactory.DeleteCustomer($scope.cust);};  

        $scope.GotoInvoice = function(inv) {
            $location.path('/invoice-edit/'+ inv.ID + '/' + inv.CustomersID + '/' + inv.CustomerCarsID);
        };
        $scope.AddInvoice = function() {
            for(var i in $scope.custCars){
                if($scope.custCars[i].checked === true){
                    $location.path('/invoice-edit/0/' + $scope.cust.ID + '/'+ $scope.custCars[i].ID);
                    break;
                }
            }      
        };

        $scope.GotoList = function() {
            $location.path("/customer-list");
        };

        function showCarPopup(car) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CarDetail.html',
                controller: 'CarDetailController',
                controllerAs: '$ctrl',
                resolve: {
                  car: function(){return car;},
                  makers : function(){return $scope.makers;},
                  CompaniesID: function(){return  AuthFactory.getLoginDetail().CompaniesID;},
                  CustomersID : function(){return  $routeParams.id;}
                }
            });

            modalInstance.result.then(function (result) {

            }, function () {
            });
        }

        $scope.AddCar = showCarPopup;
        $scope.showCar = showCarPopup;  
        $scope.selectCar = function(ID) {
          for(var i=0; i< $scope.custCars.length; i++){
              if($scope.custCars[i].ID === ID) {
                  $scope.custCars[i].checked = true;
              } else {
                  $scope.custCars[i].checked = false;
              }
          }
        };

        CustomerFactory.SelectCustomer($routeParams.id, $rootScope.loginResult.CompaniesID,
            function(response){
                $scope.CompaniesID = AuthFactory.getLoginDetail().CompaniesID;
                $scope.cust = response.cust;
                $scope.selectedSuburb = $scope.cust.suburb;
                $scope.selectedItemChange = function(item) {
                    if(typeof(item) === 'object'){
                        $scope.cust.state = item.value.split(',')[1];
                        $scope.cust.postcode = item.value.split(',')[2];
                        $scope.cust.suburb =  item.display;          
                    }
                };      
                $scope.custCars = response.custCars;
                if($scope.custCars != null && $scope.custCars.length > 0) {
                    $scope.custCars[0].checked = true;
                }
                $scope.custInvoices = response.custInvoices;
                $scope.makers = response.makers;  
            }
        );                                             
    }]
    });
})();

