angular.module('myApp')
  .controller('UserListController',['$http','AuthFactory','$rootScope','AppAlert','$location','$scope', function($http, AuthFactory,$rootScope, AppAlert, $location, $scope){
    //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();

    $scope.add = function() {
        $location.path("/user-edit/0");
    };
     
	if($rootScope.loginResult.RoleName != "Director" && $rootScope.loginResult.RoleName != "Super User"){
        AppAlert.add('warning', 'You are not allowed to access this page. Please log on as Director', function() {
          $location.path('/login');
        });        
	}
      
    var oTable = $("#userlist").dataTable({
        "columnDefs": [
          {
            "render": function ( data, type, row ) {
                return row.ID;
            },
            "targets": 0
          },
          {"render": function (data, type, row) {
              return '<a href="#!/user-edit/' + row.ID +'">' + row.FirstName + '</span>';
          },"targets":1},
          {
            "render": function ( data, type, row ) {
                return row.LastName;
            },
            "targets": 2
          },
          {"render": function (data, type, row) {
              return row.Phone;
          },"targets":3},
          {
            "render": function ( data, type, row ) {
                return row.Mobile;
            },
            "targets": 4
          },
          {"render": function (data, type, row) {
              return row.RoleName;
          },"targets":5}            ],      
        "bJQueryUI": true,
        "processing": true,
        "serverSide": false,
        "ajax": "server/SelectUserList.php?RoleName=" + $rootScope.loginResult.RoleName + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
    });
      
   
}]);