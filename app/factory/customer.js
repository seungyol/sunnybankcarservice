angular.module('commonApp')
.factory('CustomerFactory',['$http','AuthFactory','AppAlert','$route','ConfirmFactory','$location', function($http, AuthFactory, AppAlert,$route, ConfirmFactory, $location) {
    return {
        AddBlankCustomer : function() {
            var data=$.param({
                action: 'SAVE',
                CustomersID: 0,
                Title: null,
                FirstName: null,
                LastName: null,
                Phone: null,
                Mobile: null,
                Email: null,
                StreetAddress: null,
                suburb: null,
                state: null,
                postcode: null,
                CompaniesID: AuthFactory.getLoginDetail().CompaniesID,
                Notes: null
            });    
            $http.post(
              'server/SaveCustomer.php' ,
              data,
              {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(response){
              if(parseInt(response.affectedRows, 10) === 1) {
                  $location.path('/customer-edit/'+ response.ID);
              }
            }).error(function(response) {
              AppAlert.add("error","FAILURE. "+ response);
            });      		                
        },
        SaveCustomer : function(customer) {
            var data=$.param({
                action: 'SAVE',
                CustomersID: customer.ID,
                Title: customer.Title,
                FirstName: customer.FirstName,
                LastName: customer.LastName,
                Phone: customer.Phone,
                Mobile: customer.Mobile,
                Email: customer.Email,
                StreetAddress: customer.StreetAddress,
                suburb: customer.suburb,
                state: customer.state,
                postcode: customer.postcode,
                CompaniesID: AuthFactory.getLoginDetail().CompaniesID,
                Notes: customer.Notes
            });    
            $http.post(
              'server/SaveCustomer.php' ,
              data,
              {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(response){                
              if(parseInt(response.affectedRows, 10) === 1) {
                  AppAlert.add("success","SAVE SUCCESS", $route.reload);
              }else if(parseInt(response.affectedRows, 10) === 0) {
                  AppAlert.add("warning","NO CHANGE");
              }
            }).error(function(response) {
              AppAlert.add("error","Error occurs!. "+ response);
            });      		      
        },
        DeleteCustomer : function (customer) {
            ConfirmFactory.open("Delete Customer", "Are you really want to delete the customer[ID : "  + customer.ID + "]?", function(){
                var data = $.param({
                  action: 'DELETE',
                  CustomersID: customer.ID
                });

                $http.post(
                  'server/SaveCustomer.php',
                  data,
                  {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}
                ).success(function(response){
                  if(parseInt(response.affectedRows, 10) === 1) {
                    AppAlert.add("success",'DELETE SUCCESS', function(){$location.path('/customer-list');});
                  }else {
                    AppAlert.add("error",'FAILURE');
                  }            
                });
            });      
        },
        SelectCustomer: function(id, companiesID, callback) {
            var data=$.param({
                ID: id,
                CompaniesID: companiesID
            });                
            $http.post(
                'server/SelectCustomerDetail.php' ,
                data,
                {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(response){
                if(callback){
                    callback(response);
                }
            });                 
        }
    };
}]);