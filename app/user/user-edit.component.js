angular.module('userEdit').component('userEdit', {
    templateUrl: 'user/user-edit.html',
    controller: ['$route', 'AppAlert', '$location', '$rootScope', 'AuthFactory', '$routeParams', 'Suburb', 'User', '$scope', 
                 function($route, AppAlert, $location, $rootScope, AuthFactory, $routeParams, Suburb, User, $scope) {
        //Login check & Add login session to rootScope                                        
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();

        $scope.ID =  $routeParams.ID;
        $scope.loginID = $rootScope.loginResult.ID;
        this.querySearch = query => Suburb.search(query);

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(model) {
                return (model.value.indexOf(lowercaseQuery) === 0);
            };
        }
        User.get($routeParams.ID, $rootScope.loginResult.RolesID, 
            userResult => {
                $scope.user = userResult.user== null? {}: userResult.user;
                $scope.roles = userResult.roles;
                $scope.selectedSuburb = $scope.user.suburb;
                $scope.selectedItemChange = item => {
                  if(typeof(item) === 'object'){
                      $scope.user.state = item.value.split(',')[1];
                      $scope.user.postcode = item.value.split(',')[2];
                      $scope.user.suburb =  item.display;          
                  }
                }; 
        });
                      
        $scope.save = function(form) {    
          if(typeof($scope.selectedSuburb) === 'string'){
              $scope.user.suburb = $scope.selectedSuburb;
          } else if(typeof($scope.selectedSuburb) === 'object' && $scope.selectedSuburb != null) {
              $scope.user.suburb = $scope.selectedSuburb.label;
          } else {
              $scope.user.suburb = "";
          }

          if(form.$invalid){
            var requiredFields = form.$error.required.map(function(obj){ return obj.$name;});
            AppAlert.add("warning","Entry is invalid. Required fields[" + requiredFields.join(',') + ']');  
            for(var idx in requiredFields){
                form[requiredFields[idx]].$touched = true;
            }
            return;
          }
          $scope.user.action = "SAVE";
          $scope.user.CompaniesID = $rootScope.loginResult.CompaniesID;
          var data = $.param($scope.user);
//          console.log("data", data);
          User.save(data, function(SaveResult){
              if($scope.user.ID > 0) {
                  if(SaveResult.affectedRows == 1) {
                      AppAlert.add("success","User is successfully updated!", $route.reload);
                  }else { 
                      if(SaveResult.Error != "") {
                        AppAlert.add("danger","Error occurred.["+ SaveResult.Error + "]");
                      }else {
                        AppAlert.add("warning","Nothing changed!");  
                      }
                  }
              }else {
                  if(SaveResult.affectedRows > 0) {
                      AppAlert.add("success","User is successfully added!", function(){ $location.path("/user-list");});
                  }else {
                      if(SaveResult.Error != "") {
                        AppAlert.add("danger","Error occurred.[]"+ SaveResult.Error + "]");
                      }else {
                        AppAlert.add("warning","Nothing changed!");
                      }
                  }              
              }                    
          });
        };

        $scope.delete = function() {
          $scope.user.action = "DELETE";
          var data = $.param($scope.user);
          User.save(data, function(SaveResult){
              if(SaveResult.affectedRows == 1) {
                  AppAlert.add("success","User is successfully deleted!", function(){ $location.path("/user-list");});
              }else {
                    AppAlert.add("danger","Error occurred.[]"+ response.Error + "]");
              }
          });
        };
}]});