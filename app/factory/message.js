angular.module('commonApp')
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
);