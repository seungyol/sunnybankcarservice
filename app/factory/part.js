angular.module('commonApp')
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
  }]);