angular.module('customer')
.controller('CarDetailController',['$route', '$scope','car','makers', '$http','CompaniesID','CustomersID','AppAlert','numberFactory','CarFactory',
                                   function($route, $scope, car, makers,$http, CompaniesID,CustomersID,AppAlert, numberFactory, CarFactory ) {
  var self = this;  
  $scope.shouldBeOpen = true;
  $scope.makers = makers;
  
  if(car == null){
    car = {};
  }        
  numberFactory.integerOnly($('#year'), 4);
  $scope.CarPopup = car;                                       
  $scope.CarModelsID = car.CarModelsID;  
  var mission = car.Transmission;
  $scope.SaveCar = function() {      
    if($scope.CarPopup.CarModelsID == null) {
      $scope.CarPopup.ModelName =  $('.modal-dialog md-autocomplete input').val();  
    }

    CarFactory.SaveCar($scope.CarPopup,CustomersID,CompaniesID,$scope);  
  };
  $scope.DeleteCar = function() {
    CarFactory.DeleteCar($scope.CarPopup,$scope);
  };                                           
    
    // list of `state` value/display objects
  $scope.changeMake = function() {
    loadModels();
  };
                                       
  $scope.changeMake();
  $scope.querySearch   = querySearch;
  $scope.selectedItemChange = selectedItemChange;
  $scope.selectedItem = car.ModelName;

  function querySearch (query) {
      var results = query ? $scope.models.filter( createFilterFor(query) ) : $scope.models;
      return results;
  }

  function selectedItemChange(item) {
      if(item != null){
          $scope.CarPopup.CarModelsID = item.value.split('|')[1];
          $scope.CarPopup.ModelName =  item.display;          
      }
  }

    /**
     * Build `states` list of key/value pairs
     */
  function loadModels() {
      $http.get('server/SelectCarModels.php?term=&CompaniesID=' + CompaniesID + '&CarMakersID='+ $scope.CarPopup.CarMakersID)
        .then(function(result) { 
            $scope.models =  result.data.map(function(model) {
                return {value:model.label.toLowerCase() + "|" + model.value, display: model.label};
            });  
       });      
  }

    /**
     * Create filter function for a query string
     */
  function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(model) {
        return (model.value.indexOf(lowercaseQuery) === 0);
      };
  }      
}]);

