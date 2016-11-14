angular.module('myApp')
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

