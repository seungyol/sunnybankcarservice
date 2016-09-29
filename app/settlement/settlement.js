angular.module('myApp')
.controller('SettlementController',['AuthFactory', '$rootScope', '$http','$scope', function(AuthFactory, $rootScope, $http, $scope) {
    
  //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();
    $("#InvDateFrom").datepicker({format: 'dd/mm/yyyy'});
    $("#InvDateTo").datepicker({format: 'dd/mm/yyyy'});
                      
    $http.get('server/SelectPayMethods.php',
             
              {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
    ).success(function (result) {
//        console.log(result); 
        $scope.paymethods = result;
    });
    
    $scope.search = function (){
        $scope.TotalAmount = 0;
        $scope.PaidAmount = 0;
        var data = $.param({
            InvDateFrom : $scope.InvDateFrom,
            InvDateTo : $scope.InvDateTo,
            QuotationYN : $scope.QuotationYN,
            PreviousYN : $scope.PreviousYN,
            PayMethodCd : $scope.PayMethodCd,
            CompaniesID : $rootScope.loginResult.CompaniesID,
        });
        $http.post('server/SearchSettlement.php',
            data,
            {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
        ).success(function(result) {
//            var resultData = JSON.parse(result);
            $scope.TotalAmount = result.TotalAmount;
            $scope.PaidAmount = result.PaidAmount;   
//            $scope.$apply();
        });
    };
}]);