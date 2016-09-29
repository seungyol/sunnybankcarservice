'use strict';

angular.module('myApp')
.controller('LoginCtrl', ['$http','$scope','$rootScope', '$location','AuthFactory','$window', function($http,$scope,$rootScope, $location,AuthFactory, $window) {
  $('body').addClass('full');
  $('.menu').hide();
  //log out
  AuthFactory.logout();
  $rootScope.loginResult = null;
//  console.log($window.document.getElementById("Email"));
//  $($window.document.getElementById("Email")).focus();    
  
  $("#Password").keyup(function(event){
    event.which = event.which || event.keyCode;
    if(event.which == 13) {
      $('button').click();
    }	
  });
  $scope.shouldBeOpen = true;    
  $scope.Login = function(){
    var msg = '';
    var data=$.param({
      Email: $scope.Email,
      Password: $scope.Password
    });
    if($("#Email").val() == ""){
        $("#Email").parent().addClass("has-error");
        msg += 'Email is required\n';
    }
    if($("#Password").val() == ""){
        $("#Password").parent().addClass("has-error");
        msg += 'Password is required\n';
    }
    if(msg!=''){
        BootstrapDialog.alert(msg);

        return false;
    }
    $http.post(
      'server/CheckLogin.php',
      data,
      {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
    ).success(function (response) {
        var loginDetail = {ID: response.ID,
          FirstName: response.FirstName,
          LastName : response.LastName,
          Email : response.Email,
          RolesID: response.RolesID,
          RoleName: response.RoleName,
          CompaniesID: response.CompaniesID
        };
                 
        if(response.Result === "SUCCESS"){
            AuthFactory.setLoginDetail(loginDetail);
            $rootScope.loginResult  = loginDetail;
            $('body').removeClass('full');
            $location.path("/customer-list").replace();
        }else {
            BootstrapDialog.alert(response.Message);
        } 
    }).error(function (response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
      
    
  };

//  var element = $window.document.getElementById("Email");
//  element.focus();
}]);
