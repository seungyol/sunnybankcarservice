angular.module('commonApp')
  .factory('AuthFactory', ['$rootScope','$location', function($rootScope, $location) {
  return {
    checkLogin: function() {
      if(sessionStorage.getItem('CompaniesID') === null){
        alert("You must login first!");
        $location.path('/login');
      }
    },
    getLoginDetail : function() {
        return {
            ID : sessionStorage.getItem('ID'),
            FirstName : sessionStorage.getItem('FirstName'),
            LastName : sessionStorage.getItem('LastName'),
            Email : sessionStorage.getItem('Email'),
            RolesID : sessionStorage.getItem('RolesID'),
            RoleName : sessionStorage.getItem('RoleName'),
            CompaniesID : sessionStorage.getItem('CompaniesID')
        };
    },
    setLoginDetail : function(loginDetail) {
        sessionStorage.setItem('ID', loginDetail.ID);
        sessionStorage.setItem('FirstName', loginDetail.FirstName);
        sessionStorage.setItem('LastName', loginDetail.LastName);
        sessionStorage.setItem('Email', loginDetail.Email);
        sessionStorage.setItem('RolesID', loginDetail.RolesID);
        sessionStorage.setItem('RoleName', loginDetail.RoleName);
        sessionStorage.setItem('CompaniesID', loginDetail.CompaniesID);
        
//        sessionStorage.setItem('CompaniesID', loginDetail.CompaniesID);
//        $rootScope.loginResult = loginDetail;
    },
    logout : function() {
        sessionStorage.removeItem('ID');
        sessionStorage.removeItem('FirstName');
        sessionStorage.removeItem('LastName');
        sessionStorage.removeItem('Email');
        sessionStorage.removeItem('RolesID');
        sessionStorage.removeItem('RoleName');
        sessionStorage.removeItem('CompaniesID');
    }
  };    
}]);