angular.module('myApp')
  .factory('PartFactory', ['$http','AppAlert', function($http, AppAlert) {
    return {
        savePart: function(part,callback) {
            var msg = [];

            if(!part.PartName){
                msg.push('PartName');
            }
            if(!part.Qty){
                msg.push('Qty');
            }
            if(!part.UnitCost){
                msg.push('UnitCost');
            }			

            if(msg.length > 0){
                AppAlert.add("warning","Mandatory inputs : " + msg.join('  '));
                return false;				
            }
    
            $http.post("server/SavePart.php",
                $.param(part),
                {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
            ).success(function(data){
                if(callback) {
                    callback(data);
                }
            });
        },
        deletePart : function(part,callback){
          var dialog = BootstrapDialog.confirm('Are you really want to delete this part[' + part.PartName + ']?', function(result){
            if(result) {
                $http.post("server/SavePart.php",
                    $.param(part),
                    {headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
                ).success(function(data){
                    dialog.close();
                    if(callback) {
                        callback(data);
                       
                    }
                });
            }
          });		
        }     
    }
  }]);