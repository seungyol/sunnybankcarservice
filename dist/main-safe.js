(function() {
    "use strict";

    angular.module('commonApp', []);
    angular.module('userEdit', [
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ngResource',
      'ui.bootstrap',
      'commonApp'
    ]);
    angular.module('customer',[
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ui.bootstrap',
      'commonApp'    
    ]);
    // Declare app level module which depends on views, and components
    angular.module('myApp', [
      'ngRoute',
      'ngMaterial',
      'ngMessages',
      'ui.bootstrap',
      'customer',
      'userEdit',
      'commonApp'
    ]).run(['$rootScope', function($rootScope) {
        $rootScope.loginResult = null;
    }])
    .config(['$locationProvider', '$routeProvider','$mdDateLocaleProvider', function($locationProvider, $routeProvider, $mdDateLocaleProvider) {
      $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD/MM/YYYY') : '';
      };  

      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };    
      $locationProvider.hashPrefix('!');
      $routeProvider
        .when('/customer-list',{
            template: '<customer-list></customer-list>'
        }).when('/login', {
          templateUrl: 'login/login.html',
          controller: 'LoginCtrl'
        }).when('/customer-edit/:id',{
           template: '<customer-edit></customer-edit>',
        }).when('/invoice-list', {
          templateUrl: 'invoice/invoice-list.html',
          controller: 'InvoiceListController'
        }).when('/previous-list', {
          templateUrl: 'invoice/previous-list.html',
          controller: 'PreviousListController'
        }).when('/quote-list', {
          templateUrl: 'invoice/quote-list.html',
          controller: 'QuoteListController'
        }).when('/unpaid-list', {
          templateUrl: 'invoice/unpaid-list.html',
          controller: 'UnpaidListController'      
        }).when('/invoice-edit/:ID/:CustomersID/:CustomerCarsID',{
                   templateUrl: 'invoice/invoice-edit.html',
                   controller: 'InvoiceEditController'
        }).when('/user-list', {
            templateUrl: 'user/user-list.html',
            controller: 'UserListController'
        }).when('/user-edit/:ID', {
          template: '<user-edit></user-edit>'
        }).when('/setlement', {
            templateUrl: 'settlement/settlement.html',
            controller: 'SettlementController'
        }).when('/partinvoice-list', {
            templateUrl: 'partinvoice/partinvoice-list.html',
            controller: 'PartInvoiceListController'
        }).otherwise({redirectTo: '/login'});
    }]);
})();

;angular.module('myApp')
  .directive('focusMe',['$timeout','$parse','$window', function($timeout, $parse,$window) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            
            $window.setTimeout(function(){
                element[0].focus();
                element[0].focus();
            },100); 
          });
        }
      });
      element.bind('blur', function() {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}]);;angular.module('myApp')
  .directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            val = '';
        }
        var clean = val.replace( /[^-.0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});;angular.module('commonApp')
  .factory('AppAlert', ['$rootScope', function($rootScope) {
    $rootScope.alerts = [];
    var alertService = { 
      add: function(type, msg,callback) {
        $rootScope.alerts.push({ type: type, msg: msg, close: function() { 
            alertService.closeAlert(this);
            if(callback) {
                callback();
            }
        }});
      },
      closeAlert: function(alert) {
        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function (index) {
        $rootScope.alerts.splice(index, 1);
      }
    };
      
    return alertService;
  }]);
;angular.module('commonApp')
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
}]);;angular.module('commonApp')
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
}]);;angular.module('commonApp')
  .factory('ConfirmFactory',['$rootScope','$uibModal','$log', function($rootScope, $uibModal,$log) {
    var confirmService = {};
    
    confirmService.open = function (title,content, callback) {
      var message = {};
      message.title = title;
      message.content = content;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
//        size: size,
        resolve: {
          message: function () {
            return message;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if(callback) {
            callback();
        }
      }, function () {
        $log.info('Cancel Clicked : ' + new Date());
      });
    };        
    return confirmService;
  }]);


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('myApp').controller('ModalInstanceCtrl', ['$uibModalInstance', 'message', '$scope', function ($uibModalInstance, message, $scope) {
  var $ctrl = this;
  $ctrl.message = message;
  
  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };   
}]);
;angular.module('commonApp')
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
}]);;angular.module('commonApp')
.factory('InvoiceFactory',['$http','AuthFactory','AppAlert','$route','ConfirmFactory','$location', function($http, AuthFactory, AppAlert,$route, ConfirmFactory, $location) {
    return {
        selectInvoice: function(ID, CustomersID, CustomerCarsID, CompaniesID, callback) {
            $http.get('server/SelectInvoiceDetail.php?ID=' + ID+'&CustomersID=' + CustomersID +
                      '&CustomerCarsID='+ CustomerCarsID + '&CompaniesID='+ CompaniesID)
              .success(function(data) {
                if(parseInt(ID, 10) === 0){
                  $location.path("/invoice-edit/"+ data.ID + "/"+ CustomersID+ "/" + CustomerCarsID);
                }else {
                    if(callback) {
                        callback(data);
                    }
                    
                }
            });            
        },
        saveInvoice : function(invoice, InvDate, PayDate){
            var data = $.param({
                action: "SAVE",
                InvoicesID: invoice.ID,
                Odometer : invoice.Odometer,
                InvDate : InvDate,
                JobDescription : invoice.JobDescription,
                ResultNotes : invoice.ResultNotes,
                PreviousYN : invoice.PreviousYN,
                QuotationYN : invoice.QuotationYN,
                FullyPaidYN : invoice.FullyPaidYN,
                amount : invoice.amount,
                PaidAmount : invoice.PaidAmount,
                PayMethodCd : invoice.PayMethodCd,
                PayDate : PayDate,
                CustomerCarsID : invoice.CustomerCarsID,
                technician : invoice.UsersID
            });
        
            $http.post('server/SaveInvoice.php', data, 
                       {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(data){
                if(parseInt(data.trim(),10) === 1){
                    AppAlert.add("success",'SAVE SUCCESS', function(){$location.path('/invoice-edit/'+ invoice.ID +'/'+invoice.CustomersID + '/' +  invoice.CustomerCarsID);});
                }else if(parseInt(data.trim(),10) === 0){
                    AppAlert.add("warning",'NO CHANGE');
                }else {
                    AppAlert.add("success",'FAILURE');
                }			
            });
      },
      deleteInvoice : function(invoice){
        ConfirmFactory.open("Delete Invoice", "Are you really want to delete this invoice[ID:" + invoice.ID + "]?", function(){	
            var data = $.param({
              action: "DELETE",
              InvoicesID: invoice.ID
            });
            $http.post('server/SaveInvoice.php',data,{headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}).success(
                function(data){
                    if(parseInt(data,10) === 1){
                       AppAlert.add("success",'DELETE SUCCESS', function(){$location.path('/customer-edit/'+ invoice.CustomersID);});
                    }
            });			
        });
      }
    };
}]);
                ;angular.module('commonApp')
  .factory('messageFactory', function(){ 
    return {
      successMessage: function(msg, popup , callback) {
          var target = $('div[ng-view]');
          
          if(popup){
              target = $('div.modal-footer');
          }
          var msgDiv = $("<div class='alert alert-success' role='alert'></div>").html(msg);
          target.before(msgDiv);
          msgDiv.show().animate({opacity: 1},1000,function() {
            setTimeout(function(){
                msgDiv.animate({opacity:0});
                msgDiv.remove();
                if(popup){
                    target.closest('.modal').modal('hide');
                }
                if(callback){
                    callback();
                }  
            },2000);
          });              
      },
      errorMessage : function(msg, popup, callback) {
          var target = $('div[ng-view]');
          
          if(popup){
              target = $('div.modal-footer');
          }
          var msgDiv = $("<div class='alert alert-danger' role='alert'></div>").html(msg);
          target.before(msgDiv);
          msgDiv.show().animate({opacity: 1},1000,function() {
            setTimeout(function(){
                msgDiv.animate({opacity:0});
                msgDiv.remove();
                if(popup){
                    target.closest('.modal').modal('hide');
                }
                if(callback){
                    callback();
                } 
            },2000);
          });
      }
    };
  }
);;angular.module('commonApp')
  .factory('numberFactory', function() {
    return {
      integerOnly: function(input, length) {
          input.attr('maxlength',length);          
          input.keydown(function (event) {
            if(
              (event.keyCode >= 48 && event.keyCode <=57) ||
              (event.keyCode >= 96 && event.keyCode <= 105) ||
              (event.keyCode === 8 || event.keyCode === 37 || 
               event.keyCode === 39 || event.keyCode === 46 || 
               event.which === 9
              )
            ) 
            {}
            else {
              event.preventDefault();    
            }
          });
      }  
    };
});;angular.module('commonApp')
  .factory('PartFactory', ['$resource','AppAlert', function($resource, AppAlert) {
    return {
        savePart: function(part,callback) {
            var msg = [];
            if(!part.partname){
                msg.push('PartName');
            }
            if(!part.qty){
                msg.push('Qty');
            }
            if(!part.unitcost){
                msg.push('UnitCost');
            }			

            if(msg.length > 0){
                AppAlert.add("warning","Mandatory inputs : " + msg.join('  '));
                return false;				
            }
            
            var SaveParts = $resource('server/SavePart.php',{},{save: {method: 'POST', headers: {'Content-Type' :'application/x-www-form-urlencoded;charset=utf-8'}}});
            return SaveParts.save($.param(part), callback);
        },
        deletePart : function(part,callback){
            var dialog = BootstrapDialog.confirm('Are you really want to delete this part [' + part.partname + ']?', function(result){
            if(result) {
                var DeletePart = $resource("server/SavePart.php",{}, {save: {method:'POST', headers: {'Content-Type' :'application/x-www-form-urlencoded;charset=utf-8'}}});
                return DeletePart.save($.param(part), callback);
                
            }
          });		
        }     
    };
  }]);;angular.module('commonApp').service('Suburb', ['$q','$http','$resource',function($q, $http, $resource) {
    this.search = function(query) {
        if(query.length >= 3) {
            var PostCodes = $resource('server/SelectPostCodes.php', {term: query}).query();
            return PostCodes.$promise;
            
        } else {
            return [];
        }  
    };  
}]);;angular.module('commonApp').service('User', ['$resource', function($resource) {
    var UserDetails = $resource('server/SelectUserDetail.php');
    this.get = function(id, roleId, callback) {
        return UserDetails.get({ID: id, RolesID: roleId}, callback);        
    };
    
    var SaveUser = $resource('server/ManageUser.php',{},{save: {method: 'POST', headers: {'Content-Type' :'application/x-www-form-urlencoded;charset=utf-8'}}});
    this.save = function(data, callback) {
        return SaveUser.save(data, callback);
    };
}]);;angular.module('myApp').filter('decimal2', function() {
    return function(input) {
        return parseFloat(Math.round(input * 100) / 100).toFixed(2);
    };
});;(function() {
    'use strict';
    angular.module('myApp')
    .controller('LoginCtrl', ['$http','$scope','$rootScope', '$location','AuthFactory','$window', function($http,$scope,$rootScope, $location,AuthFactory, $window) {
      $('body').addClass('full');
      $('.menu').hide();
      //log out
      AuthFactory.logout();
      $rootScope.loginResult = null;
        
      $("#Password").keyup(function(event){
        event.which = event.which || event.keyCode;
        if(event.which === 13) {
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
        if($("#Email").val() === ""){
            $("#Email").parent().addClass("has-error");
            msg += 'Email is required\n';
        }
        if($("#Password").val() === ""){
            $("#Password").parent().addClass("has-error");
            msg += 'Password is required\n';
        }
        if(msg !== ''){
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
        
        });


      };
    }]);
})();

;angular.module('customer')
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

;(function() {
    'use strict';

    angular.module('customer')
    .component('customerEdit', {
        templateUrl: 'customer/customer-edit.html',
        controller: ['$q', '$location','$http','$routeParams','$route', 'AppAlert','ConfirmFactory',  '$uibModal','$rootScope', '$scope','AuthFactory', 'CustomerFactory', 'Suburb',
      function($q, $location, $http, $routeParams,$route, AppAlert,ConfirmFactory, $uibModal,$rootScope, $scope,AuthFactory, CustomerFactory, Suburb){
      //Login check & Add login session to rootScope                                        
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();
        
        if(parseInt($routeParams.id, 10) === 0){
            CustomerFactory.AddBlankCustomer();
            return;
        }

        //Suburb Autocomlete
        $scope.querySearch = function(query) {
            return Suburb.search(query);  
        };

        $scope.CarPopup = {};

        $scope.SaveCustomer = function() {
          if(typeof($scope.selectedSuburb) === 'string'){
              $scope.cust.suburb = $scope.selectedSuburb;
          } else if(typeof($scope.selectedSuburb) === 'object' && $scope.selectedSuburb != null){
              $scope.cust.suburb = $scope.selectedSuburb.label;
          } else {
              $scope.cust.suburb = "";
          }

          CustomerFactory.SaveCustomer($scope.cust);
        };    

        $scope.DeleteCustomer = function() {CustomerFactory.DeleteCustomer($scope.cust);};  

        $scope.GotoInvoice = function(inv) {
            $location.path('/invoice-edit/'+ inv.ID + '/' + inv.CustomersID + '/' + inv.CustomerCarsID);
        };
        $scope.AddInvoice = function() {
            for(var i in $scope.custCars){
                if($scope.custCars[i].checked === true){
                    $location.path('/invoice-edit/0/' + $scope.cust.ID + '/'+ $scope.custCars[i].ID);
                    break;
                }
            }      
        };

        $scope.GotoList = function() {
            $location.path("/customer-list");
        };

        function showCarPopup(car) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CarDetail.html',
                controller: 'CarDetailController',
                controllerAs: '$ctrl',
                resolve: {
                  car: function(){return car;},
                  makers : function(){return $scope.makers;},
                  CompaniesID: function(){return  AuthFactory.getLoginDetail().CompaniesID;},
                  CustomersID : function(){return  $routeParams.id;}
                }
            });

            modalInstance.result.then(function (result) {

            }, function () {
            });
        }

        $scope.AddCar = showCarPopup;
        $scope.showCar = showCarPopup;  
        $scope.selectCar = function(ID) {
          for(var i=0; i< $scope.custCars.length; i++){
              if($scope.custCars[i].ID === ID) {
                  $scope.custCars[i].checked = true;
              } else {
                  $scope.custCars[i].checked = false;
              }
          }
        };

        CustomerFactory.SelectCustomer($routeParams.id, $rootScope.loginResult.CompaniesID,
            function(response){
                $scope.CompaniesID = AuthFactory.getLoginDetail().CompaniesID;
                $scope.cust = response.cust;
                $scope.selectedSuburb = $scope.cust.suburb;
                $scope.selectedItemChange = function(item) {
                    if(typeof(item) === 'object'){
                        $scope.cust.state = item.value.split(',')[1];
                        $scope.cust.postcode = item.value.split(',')[2];
                        $scope.cust.suburb =  item.display;          
                    }
                };      
                $scope.custCars = response.custCars;
                if($scope.custCars != null && $scope.custCars.length > 0) {
                    $scope.custCars[0].checked = true;
                }
                $scope.custInvoices = response.custInvoices;
                $scope.makers = response.makers;  
            }
        );                                             
    }]
    });
})();

;(function() {
    'use strict';

    angular.module('customer')
    .component('customerList', {
        templateUrl: 'customer/customer-list.html',
        controller: ['$location','$scope','$rootScope', 'AuthFactory', function( $location, $scope,$rootScope, AuthFactory){
      AuthFactory.checkLogin();
      $rootScope.loginResult = AuthFactory.getLoginDetail();
        var oTable = $("#CustomerList").dataTable({
        "columnDefs": [
          {
            "render": function ( data, type, row ) {
                return "<a href='#!/customer-edit/" + data +"'>"+ data + "</a>";
            },
            "targets": 0
          },
          {"render": function (data, type, row) {
              return "<a href='#!/customer-edit/" + row.ID +"'>"+ data + "</a>";
          },"targets":1}

        ],      
        "bJQueryUI": true,
        "processing": true,
        "serverSide": true,
        "ajax": "server/SelectCustomerList.php?CompaniesID=" + $rootScope.loginResult.CompaniesID
      });
      $scope.goNew = function(){
        $location.path('/customer-edit/0').replace();
      };		
      $("button").button();    
    }]    
    });    
})();
;(function() {
    'use strict';

    angular.module('myApp')
    .controller('InvoiceEditController', 
      ['$location','$http','$routeParams','$route', 'AppAlert','ConfirmFactory','AuthFactory', 'InvoiceFactory','PartFactory', '$rootScope', '$scope', 
      function($location, $http, $routeParams,$route, AppAlert,ConfirmFactory,AuthFactory,InvoiceFactory,PartFactory, $rootScope, $scope){
        //Login check & Add login session to rootScope                                        
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();

        //Init object for Part Detail Popup's model
        $scope.partdtl = {};
        $scope.invoice = {};

        //load the invoice & car detail
        InvoiceFactory.selectInvoice($routeParams.ID, $routeParams.CustomersID, $routeParams.CustomerCarsID, $rootScope.loginResult.CompaniesID,
          function(data) {
            $scope.car = data.car;
            $scope.invoice = data.invoice;
            $scope.invoice.InvDate = moment(data.invoice.InvDate,'DD/MM/YYYY').toDate();
            $scope.invoice.PayDate =data.invoice.PayDate ? moment(data.invoice.PayDate,'DD/MM/YYYY').toDate() : null;
            $scope.invoice.amount = $scope.total();
            $scope.customer = data.customer;
            $scope.users = data.users;
            $scope.paymethods = data.paymethods;

            if($scope.invoice.ID > 0){
                if($scope.invoice.QuotationYN ==='Y'){
                    $scope.title= "Quote Details (No : " + $scope.invoice.ID + ")";
                }else {
                    $scope.title= "Invoice Details (No : " + $scope.invoice.ID + ")";
                }
            }       
        });

        //load the invoice's parts
        $scope.parts = [];
        $http({method: 'GET', url: 'server/SelectInvoiceParts.php?ID=' + $routeParams.ID}).
            success(function(data, status, headers, config) {
                for(var i=0;i<data.length;i++){
                    $scope.parts.push(data[i]);
                }
            }).error(function(data, status, headers, config) {alert('error');
        });	
        //Calculate Total amount				
        $scope.total = function(){
            var totalAmt = 0;
            for(var i=0;i < $scope.parts.length;i++){
                totalAmt += Number($scope.parts[i].LineTotal.replace(/,/g,''));
            }
            return totalAmt;
        };

        $scope.changePaidAmount = function(){
            if($scope.invoice.FullyPaidYN === 'Y'){
                if(Number($scope.invoice.PaidAmount) === 0){
                    $scope.invoice.PaidAmount = $scope.total();
                }
            }
        };

        $scope.printQuote = function(){
            window.open('server/QuotePrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID +
                        '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
        };

        $scope.printInvoice = function(){
            window.open('server/InvoicePrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID + 
                        '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
        };

        $scope.printJobOrder = function(){
            window.open('server/JobOrderPrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID + 
                        '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
        };

        $scope.gotoCustomer = function(){
            $location.path('/customer-edit/' + $scope.invoice.CustomersID);
        };      

        $scope.part = {};

        $("#divPartPopup").on('shown.bs.modal', function() {
            $("#PartName").focus();
            $("#PartName").select();
        });        
        $scope.AddPart = function(){
            $scope.partdtl = {};
            $( "#divPartPopup").modal("show");
            setupPartAutocomplete();
            $scope.isPartSaveDisabled = false;
            $scope.isPartDeleteDisabled = true;
        };

        $scope.saveInvoice = function(){        
          InvoiceFactory.saveInvoice($scope.invoice,moment($scope.invoice.InvDate).format('DD/MM/YYYY'),moment($scope.invoice.PayDate).format('DD/MM/YYYY'));    
        };

        $scope.deleteInvoice = function(){
          InvoiceFactory.deleteInvoice($scope.invoice);    
        };

        function setupPartAutocomplete(){
            $("#PartName").autocomplete(
            {source: 'server/SelectParts.php?CompaniesID='+ $rootScope.loginResult.CompaniesID,
             minLength: 2,
             focus : function(event,ui){
                var tmp1 = ui.item.value.split('|');
                $scope.partdtl.partname = tmp1[1];
                return false;
             },
             select: function(event, ui){
                var tmp1 = ui.item.value.split('|');
                $scope.partdtl.partname = tmp1[1];
                $scope.partdtl.partsid = tmp1[0];
                $scope.partdtl.unitcost = tmp1[2];
                $scope.$apply();
                return false;
             }
            });
        }
        setupPartAutocomplete();      

        //Part Popup
        $scope.open = function(obj){

            $("#divPartPopup").modal('show');
            $scope.partdtl.id = obj.ID;
            $scope.partdtl.partsid = obj.PartsID;
            $scope.partdtl.qty = obj.Qty;
            $scope.partdtl.unitcost = obj.UnitCost;
            $scope.partdtl.partname = obj.PartName;     
            $scope.isPartSaveDisabled = false;
            $scope.isPartDeleteDisabled = false;

        };
        var genPartData = function(action) {
            var part = {
                partaction: action,
                id: $scope.partdtl.id,
                partsid: $scope.partdtl.partsid,
                InvoicesID: $scope.invoice.ID,
                partname: $scope.partdtl.partname,
                qty: $scope.partdtl.qty,
                unitcost: $scope.partdtl.unitcost,
                CompaniesID: $rootScope.loginResult.CompaniesID
            };  
            return part;
        };
        $scope.savePart = function(e){
            $scope.isPartSaveDisabled = true;
            $scope.isPartDeleteDisabled = true;

            $scope.partdtl.partaction= 'SAVE';
            $scope.partdtl.CompaniesID = $rootScope.loginResult.CompaniesID;
            $scope.partdtl.InvoicesID = $routeParams.ID;

            var validateResult = PartFactory.savePart($scope.partdtl, function(data){

                if(Number(data.ID) > 0){
                    $scope.partdtl.id = data.ID;
                    $scope.parts.push({ID: $scope.partdtl.id, 
                                       PartsID: $scope.partdtl.partsid, 
                                       Qty: $scope.partdtl.qty, 
                                       UnitCost: $scope.partdtl.unitcost, 
                                       PartName: $scope.partdtl.partname,
                                       LineTotal: ($scope.partdtl.qty * $scope.partdtl.unitcost).toFixed(2)} );
                }else {
                    for(var i=0; i < $scope.parts.length;i++){
                        if($scope.parts[i].ID === $scope.partdtl.id){
                            $scope.parts[i].PartsID = $scope.partdtl.partsid;
                            $scope.parts[i].Qty = $scope.partdtl.qty;
                            $scope.parts[i].UnitCost = $scope.partdtl.unitcost;
                            $scope.parts[i].PartName = $scope.partdtl.partname;
                            $scope.parts[i].LineTotal = ($scope.parts[i].Qty * $scope.parts[i].UnitCost).toFixed(2);
                        }
                    }						
                }
                $scope.partdtl = {};
                $('#PartName').focus();
                $scope.isPartSaveDisabled = false;
                $scope.isPartDeleteDisabled = true;            
            });
            if(validateResult === true) {
                $scope.isPartSaveDisabled = false;
            }
        };   

        $scope.deletePart = function(){

            var part = genPartData("DELETE");     
            var confirmResult = PartFactory.deletePart(part, function(data){
                for(var i=0; i < $scope.parts.length;i++){
                    if($scope.parts[i].ID === $scope.id){
                        $scope.parts.splice(i,1);
                    }
                }
                $( "#divPartPopup" ).modal("hide");
                AppAlert.add('success','The part is deleted successfully!', $route.reload);
            });  
        };      
    }]);


})();
;(function() {
    'use strict';
    angular.module('myApp')
    .controller('InvoiceListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();    
          $('#InvoiceList').DataTable({
          responsive: true,
          "columnDefs": [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 },
            { responsivePriority: 3, targets: -1 },
            { responsivePriority: 4, targets: -1 },
            {"render": function(data, type, row) {
              return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
            },"targets": 0}
          ],
          "processing": true,
          "serverSide": true,
          "ajax": "server/SelectInvoiceList.php?type=" + $routeParams.type + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
        });
    }]);    
})();

;(function() {
    'use strict';
    angular.module('myApp')
      .controller('PreviousListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();   
        $('#PreviousList').DataTable({

          "columnDefs": [
            {"render": function(data, type, row) {
              return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
            },"targets": 0}
          ],
          "processing": true,
          "serverSide": true,
          "ajax": "server/SelectInvoiceList.php?type=P" + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
        });    
      }]);
})();;(function() {
    'use strict';
    angular.module('myApp')
      .controller('QuoteListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();   
        $('#QuoteList').DataTable({

          "columnDefs": [
            {"render": function(data, type, row) {
              return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
            },"targets": 0}
          ],
          "processing": true,
          "serverSide": true,
          "ajax": "server/SelectInvoiceList.php?type=Q" + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
        });       
      }]);
})();;(function() {
    'use strict';
    angular.module('myApp')
      .controller('UnpaidListController',['$location','$routeParams', 'AuthFactory','$rootScope', '$scope', function($location,$routeParams, AuthFactory,$rootScope, $scope) {
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();   
        $('#UnpaidList').DataTable({

          "columnDefs": [
            {"render": function(data, type, row) {
              return "<a href='#!/invoice-edit/" + row.ID + "/" + row.CustomersID + "/" + row.CustomerCarsID + "'>"+ data + "</a>"; 
            },"targets": 0}
          ],
          "processing": true,
          "serverSide": true,
          "ajax": "server/SelectInvoiceList.php?type=U" + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
        });       
      }]);
})();;angular.module('myApp')
.controller('PartInvoiceListController', ['$route', 'AuthFactory', '$rootScope', '$http','$scope', function($route, AuthFactory, $rootScope, $http, $scope) {
    
  //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();
    
	function split2(str,needle, nth){
		var max = str.length;
		var n = 0;
		for(var i=0; i< max; i++){
			if(str[i] === needle){
				n++;
				if(n>=nth){
					break;
				}
			}
		}
		return str.substring(0,i);
	}    
    
    var oTable = $("#partlist").dataTable({
        "columnDefs": [
          {
            "render": function ( data, type, row ) {
                if(row.InvoiceNos == null){
			         return '<button type="button"  data-id="' + row.ID + '" class="btn btn-warning delete-btn">Delete Part</button>';
                }else {
                    var html='', arrInvs, idx;
                    if(row.InvoiceNos.length > 10){
                        var tmpInvs =  split2(row.InvoiceNos,',',10);
                        arrInvs = tmpInvs.split(',');
                    
                        for(idx in arrInvs){
                            html += "<a href='#!/invoice-edit/" + arrInvs[idx] + "/0/0'>" + arrInvs[idx] + "</a>,";				
                        }
                        html +=  ".....";
                    }else {
                        arrInvs = row.InvoiceNos.split(',');
                        for(idx in arrInvs){
                            html += "<a href='#!/invoice-edit/" + arrInvs[idx] + "/0/0'>" + arrInvs[idx] + "</a>,";				
                        }
                    }
                    return html;
                }                
            },
            "targets": 2
          }
        ],      
        "bJQueryUI": true,
        "processing": true,
        "serverSide": false,
        "ajax": 'server/SelectPartInvoiceList.php?RoleName=' +$rootScope.loginResult.RoleName + "&CompaniesID=" + $rootScope.loginResult.CompaniesID
    });
    
    $("#partlist").on("click", ".delete-btn",function(){
        var row = $(this).closest('tr');
        var partID = $(this).data("id");
        $http.post("server/AjaxProcess.php", $.param({partID: partID}),
           {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
        ).success(function(data){
            if(Number(data) === 1){			
                location.reload();
            }
        });

    });
}]);

;angular.module('myApp')
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
}]);;angular.module('userEdit').component('userEdit', {
    templateUrl: 'user/user-edit.html',
    controller: ['$route', 'AppAlert', '$location', '$rootScope', 'AuthFactory', '$routeParams', 'Suburb', 'User', '$scope', 
                 function($route, AppAlert, $location, $rootScope, AuthFactory, $routeParams, Suburb, User, $scope) {
        //Login check & Add login session to rootScope                                        
        AuthFactory.checkLogin();
        $rootScope.loginResult = AuthFactory.getLoginDetail();

        $scope.ID =  $routeParams.ID;
        $scope.loginID = $rootScope.loginResult.ID;
        this.querySearch = function(query) {
            return Suburb.search(query);
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(model) {
                return (model.value.indexOf(lowercaseQuery) === 0);
            };
        }
        User.get($routeParams.ID, $rootScope.loginResult.RolesID, 
            function(userResult) {
                $scope.user = userResult.user== null? {}: userResult.user;
                $scope.roles = userResult.roles;
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
                  if(parseInt(SaveResult.affectedRows, 10) === 1) {
                      AppAlert.add("success","User is successfully updated!", $route.reload);
                  }else { 
                      if(SaveResult.Error !== "") {
                        AppAlert.add("danger","Error occurred.["+ SaveResult.Error + "]");
                      }else {
                        AppAlert.add("warning","Nothing changed!");  
                      }
                  }
              }else {
                  if(parseInt(SaveResult.affectedRows, 10) > 0) {
                      AppAlert.add("success","User is successfully added!", function(){ $location.path("/user-list");});
                  }else {
                      if(SaveResult.Error !== "") {
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
              if(parseInt(SaveResult.affectedRows,10) === 1) {
                  AppAlert.add("success","User is successfully deleted!", function(){ $location.path("/user-list");});
              }else {
                    AppAlert.add("danger","Error occurred.[]"+ response.Error + "]");
              }
          });
        };
}]});;angular.module('myApp')
  .controller('UserListController',['$http','AuthFactory','$rootScope','AppAlert','$location','$scope', function($http, AuthFactory,$rootScope, AppAlert, $location, $scope){
    //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();

    $scope.add = function() {
        $location.path("/user-edit/0");
    };
     
	if($rootScope.loginResult.RoleName !== "Director" && $rootScope.loginResult.RoleName !== "Super User"){
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