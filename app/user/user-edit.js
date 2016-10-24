angular.module('myApp')
  .controller('UserDetailController',['autocompleteFactory',  '$route', 'AppAlert', '$location', '$rootScope', 'AuthFactory', '$routeParams', '$http','$scope', function(autocompleteFactory, $route, AppAlert, $location, $rootScope, AuthFactory, $routeParams, $http, $scope) {
  //Login check & Add login session to rootScope                                        
  AuthFactory.checkLogin();
  $rootScope.loginResult = AuthFactory.getLoginDetail();

  $scope.ID =  $routeParams.ID;
  $scope.loginID = $rootScope.loginResult.ID;
  $scope.querySearch   = function (query) {  
        if(query.length >=3){
            return $http.get('server/SelectPostCodes.php?term=' + query)
              .then(function(response) {
                    return response.data;
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data.records);
                }
            );      
        }else {
            return [];
        }
  };

  function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(model) {
            return (model.value.indexOf(lowercaseQuery) === 0);
        };
  }
      
  $http.get('server/SelectUserDetail.php?ID=' + $routeParams.ID + '&RolesID='+ $rootScope.loginResult.RolesID).success(function(result) {
      $scope.user = result.user== null? {}: result.user;
      $scope.roles = result.roles;
      $scope.selectedSuburb = $scope.user.suburb;
      $scope.selectedItemChange = function(item) {
          if(typeof(item) === 'object'){
              $scope.user.state = item.value.split(',')[1];
              $scope.user.postcode = item.value.split(',')[2];
              $scope.user.suburb =  item.display;          
          }
      };        
  });
  $scope.save = function(form) {    
      $scope.user.suburb = $scope.selectedSuburb != null ? $scope.selectedSuburb.label : null;
      console.log(form, form.$invalid);
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
      $http.post('server/ManageUser.php', 
        data,
        {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
      ).success(function(response){
//          console.log(response);
          if($scope.user.ID > 0) {
              if(response.affectedRows == 1) {
                  AppAlert.add("success","User is successfully updated!", $route.reload);
              }else { 
                  if(response.Error != "") {
                    AppAlert.add("danger","Error occurred.["+ response.Error + "]");
                  }else {
                    AppAlert.add("warning","Nothing changed!");  
                  }
              }
          }else {
              if(response.affectedRows > 0) {
                  AppAlert.add("success","User is successfully added!", function(){ $location.path("/user-list");});
              }else {
                  if(response.Error != "") {
                    AppAlert.add("danger","Error occurred.[]"+ response.Error + "]");
                  }else {
                    AppAlert.add("warning","Nothing changed!");
                  }
              }              
          }
      });
      return false;
  };
      
  $scope.delete = function() {
      $scope.user.action = "DELETE";
      var data = $.param($scope.user);
      $http.post('server/ManageUser.php', 
        data,
        {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
      ).success(function(response){
          if(response.affectedRows == 1) {
              AppAlert.add("success","User is successfully deleted!", function(){ $location.path("/user-list");});
          }else {
                AppAlert.add("danger","Error occurred.[]"+ response.Error + "]");
          }  
      });
  };
}]);