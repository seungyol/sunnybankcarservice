'use strict';

angular.module('myApp')
.controller('InvoiceEditController', 
  ['$location','$http','$routeParams','$route', '$cookies','AppAlert', 'autocompleteFactory','ConfirmFactory','AuthFactory', 'InvoiceFactory','PartFactory', '$rootScope',   '$scope', 
  function($location, $http, $routeParams,$route, $cookies,AppAlert, autocompleteFactory,ConfirmFactory,AuthFactory,InvoiceFactory,PartFactory, $rootScope, $scope){
    //Login check & Add login session to rootScope                                        
    AuthFactory.checkLogin();
    $rootScope.loginResult = AuthFactory.getLoginDetail();

    //Init object for Part Detail Popup's model
    $scope.partdtl = {};
    $scope.invoice = {};

    //for getting input value

    $("#InvDate").on("changeDate", function() {
        $scope.invoice.InvDate = $("#InvDate").val();
    });      
    $("#PayDate").on("changeDate", function() {
        $scope.invoice.PayDate = $("#PayDate").val();
    });         
    //load the invoice & car detail
    InvoiceFactory.selectInvoice($routeParams.ID, $routeParams.CustomersID, $routeParams.CustomerCarsID, $rootScope.loginResult.CompaniesID,
      function(data) {
//        console.log("data.invoice", data.invoice);
        $scope.car = data.car;
        $scope.invoice = data.invoice;
        $("#InvDate").val(data.invoice.InvDate);
        $("#PayDate").val(data.invoice.PayDate);
        $("#InvDate").datepicker('update');
        $("#PayDate").datepicker('update');
        $scope.invoice.amount = $scope.total();
        $scope.customer = data.customer;
        $scope.users = data.users;
        $scope.paymethods = data.paymethods;

        if($scope.invoice.ID > 0){
            if($scope.invoice.QuotationYN != null){
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
        console.log("$scope.invoice.FullyPaidYN", $scope.invoice.FullyPaidYN);
        if($scope.invoice.FullyPaidYN === 'Y'){
            console.log("Number($scope.invoice.PaidAmount)",Number($scope.invoice.PaidAmount));
            if(Number($scope.invoice.PaidAmount) == 0){
                $scope.invoice.PaidAmount = $scope.total();
            }

        }
    };
				
	$scope.printQuote = function(){
        window.open('server/QuotePrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID 
                    + '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
    };
				
    $scope.printInvoice = function(){
        window.open('server/InvoicePrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID 
                    + '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
    };

    $scope.printJobOrder = function(){
        window.open('server/JobOrderPrint.php?ID=' + $scope.invoice.ID  + '&CustomersID=' + $scope.invoice.CustomersID 
                    + '&CustomerCarsID='  + $scope.invoice.CustomerCarsID + '&CompaniesID='+ $rootScope.loginResult.CompaniesID,'_blank');
    };

    $scope.gotoCustomer = function(){
        $location.path('/customer-edit/' + $scope.invoice.CustomersID);
    };      
    
    $scope.part = {};
    $scope.partNameChange = function() {
//      console.log($scope.partname);
//      $scope.id = "";
//      $scope.unitcost = "";
    };

				
    $("#InvDate").datepicker({format: 'dd/mm/yyyy'});
    $("#PayDate").datepicker({format: 'dd/mm/yyyy'});
    $("#divPartPopup").on('shown.bs.modal', function() {
        console.log('show.bs.modal')
        $("#PartName").focus();
    });        
    $scope.AddPart = function(){
//        $scope.shouldBeOpen = true;
        $scope.partdtl = {};
        $( "#divPartPopup").modal("show");
        setupPartAutocomplete();
        $("#PartName").focus();
    };
    
    $scope.saveInvoice = function(){
//      console.log("$scope.parent",$scope.parent);
//      $scope.invoice.InvDate = $scope.parent.InvDate;
//      $scope.invoice.PayDate = $scope.parent.PayDate;
//      console.log("$scope.invoice",$scope.invoice);
      InvoiceFactory.saveInvoice($scope.invoice);    
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
            console.log(tmp1);
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
//        $scope.shouldBeOpen = true;
        $scope.partdtl.id = obj.ID;
        $scope.partdtl.partsid = obj.PartsID;
        $scope.partdtl.qty = obj.Qty;
        $scope.partdtl.unitcost = obj.UnitCost;
        $scope.partdtl.partname = obj.PartName;     
        
    };
    var genPartData = function(action) {
        var part = {
            partaction: action,
            InvoicePartsID: $scope.partdtl.id,
            PartsID: $scope.partdtl.partsid,
            InvoicesID: $scope.invoice.ID,
            PartName: $scope.partdtl.partname,
            Qty: $scope.partdtl.qty,
            UnitCost: $scope.partdtl.unitcost,
            CompaniesID: $rootScope.loginResult.CompaniesID
        };  
        return part;
    };
    $scope.savePart = function(e){
        var part = genPartData("SAVE");
//        console.log("savePart part", part);
        PartFactory.savePart(part, function(data){
            if(Number(data) > 1){
                $scope.partdtl.id = data.trim();
                $scope.parts.push({ID: $scope.partdtl.id, 
                                   PartsID: $scope.partdtl.partsid, 
                                   Qty: $scope.partdtl.qty, 
                                   UnitCost: $scope.partdtl.unitcost, 
                                   PartName: $scope.partdtl.partname,
                                   LineTotal: ($scope.partdtl.qty * $scope.partdtl.unitcost).toFixed(2)} );
            }else {
                for(var i=0; i < $scope.parts.length;i++){
                    if($scope.parts[i].ID == $scope.partdtl.id){
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
        });
    };   
      
    $scope.deletePart = function(){
        var part = genPartData("DELETE");     
        PartFactory.deletePart(part, function(data){
            for(var i=0; i < $scope.parts.length;i++){
                if($scope.parts[i].ID == $scope.id){
                    $scope.parts.splice(i,1);
                }
            }
            $( "#divPartPopup" ).modal("hide");
            AppAlert.add('success','The part is deleted successfully!', $route.reload);
        });          
    };      
}]);
