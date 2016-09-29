angular.module('myApp')
  .controller('UserListController',['$http','AuthFactory','$rootScope','AppAlert','$location','$scope', function($http, AuthFactory,$rootScope, AppAlert, $location, $scope){
    //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();
    console.log("$rootScope.loginResult", $rootScope.loginResult);
    
    $('span.link.user').on('click',function(event){
       console.log("click",event); 
    });
    $scope.add = function() {
        $location.path("/user-edit/0");
    };
    $scope.openUser = function(id) {
        var data= $.param({
            ID: id,
            action: "SELECT"
        });
        console.log("data", data);
        $http.post("server/ManageUser.php",
           data,
           {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
        ).success(function(data){
            var usr = JSON.parse(data);
            clearUserPopup();
            $("#ID").val(usr[0].ID);
            $("#FirstName").val(usr[0].FirstName);
            $("#LastName").val(usr[0].LastName);
            $("#Phone").val(usr[0].Phone);
            $("#Mobile").val(usr[0].Mobile);
            $("#Email").val(usr[0].Email);
            $("#Password").val(usr[0].Password);
            $("#StreetAddress").val(usr[0].StreetAddress);
            $("#Suburb").val(usr[0].suburb);
            $("#State").val(usr[0].state);
            $("#PostCode").val(usr[0].postcode);
            $("#RolesID").val(usr[0].RolesID);
            $("#SmtpName").val(usr[0].SmtpName);
            $("#SmtpPort").val(usr[0].SmtpPort);
            $("#SmtpPassword").val(usr[0].SmtpPassword);
            $("#btnDelete").show();
            $("#UserDialog").modal('show');
            setupSuburbAutocomplete();
        });
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