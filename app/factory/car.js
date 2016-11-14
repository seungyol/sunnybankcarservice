angular.module('commonApp')
.factory('CarFactory', ['$http','AppAlert', '$route', function($http,AppAlert, $route){
//  var loginDetail = AuthFactory.getLoginDetail();
  return {
    SaveCar : function(car,CustomersID,CompaniesID, scope) {
    var data = $.param({
      caraction: "SAVE",
      CustomerCarsID: car.ID,
      CustomersID: CustomersID,
      CarModelsID: car.CarModelsID,
      RegNo: car.RegNo,
      model: car.ModelName,
      Year: car.Year,
      VIN: car.VIN,
      EngineNo: car.EngineNo,
      ManualTransmissionYN: car.ManualTransmissionYN,
      CompaniesID: CompaniesID,
      make: car.CarMakersID
    });
    $http.post('server/SaveCar.php' ,
        data,
        {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
    ).success(function(data){
      if(data.affectedRow >= 1){
          AppAlert.add("success","SAVE SUCCESS", function() {
            scope.$dismiss('close');
            $route.reload();
          });
      }
    });				  
  }, DeleteCar : function(car, scope) {
    var data = $.param({
      caraction: "DELETE",
      CustomerCarsID: car.ID
    });    
    $http.post('server/SaveCar.php' ,
        data,
        {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
    ).success(function(data){
      if(data.affectedRow >= 1){
          AppAlert.add("success", "DELETE SUCCESS",function() {
              scope.$dismiss('close');
              $route.reload();
          });
      }
    });		  
  }    
};
}]);