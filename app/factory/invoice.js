angular.module('myApp')
.factory('InvoiceFactory',['$http','AuthFactory','AppAlert','$route','ConfirmFactory','$location', function($http, AuthFactory, AppAlert,$route, ConfirmFactory, $location) {
    return {
        selectInvoice: function(ID, CustomersID, CustomerCarsID, CompaniesID, callback) {
            $http.get('server/SelectInvoiceDetail.php?ID=' + ID+'&CustomersID=' + CustomersID 
                      + '&CustomerCarsID='+ CustomerCarsID + '&CompaniesID='+ CompaniesID)
              .success(function(data) {
                if(ID == 0){
                  $location.path("/invoice-edit/"+ data.ID + "/"+ CustomersID+ "/" + CustomerCarsID);
                }else {
                    if(callback) {
                        callback(data);
                    }
                    
                }
            });            
        },
        saveInvoice : function(invoice){
            console.log("saveInvoice", invoice);
            var data = $.param({
                action: "SAVE",
                InvoicesID: invoice.ID,
                Odometer : invoice.Odometer,
                InvDate : invoice.InvDate,
                JobDescription : invoice.JobDescription,
                ResultNotes : invoice.ResultNotes,
                PreviousYN : invoice.PreviousYN,
                QuotationYN : invoice.QuotationYN,
                FullyPaidYN : invoice.FullyPaidYN,
                amount : invoice.amount,
                PaidAmount : invoice.PaidAmount,
                PayMethodCd : invoice.PayMethodCd,
                PayDate : invoice.PayDate,
                CustomerCarsID : invoice.CustomerCarsID,
                technician : invoice.UsersID
            });
        
            $http.post('server/SaveInvoice.php', data, 
                       {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(data){
                if(data.trim() == "1"){
                    AppAlert.add("success",'SAVE SUCCESS', function(){$location.path('/invoice-edit/'+ invoice.ID +'/'+invoice.CustomersID + '/' +  invoice.CustomerCarsID)});
                }else if(data.trim() == "0"){
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
                    if(data == 1){
                       AppAlert.add("success",'DELETE SUCCESS', function(){$location.path('/customer-edit/'+ invoice.CustomersID)});
                    }
            });			
        });
      }
    };
}]);
                