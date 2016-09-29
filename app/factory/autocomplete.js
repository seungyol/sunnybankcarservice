angular.module('myApp')
  .factory('autocompleteFactory', function() {
    return {
      suburb : function(suburb, callback) {
	    suburb.autocomplete({
		  source:'server/SelectPostCodes.php',
		  minLength:3,
		  select: function(event, ui){
            if(callback) {
                callback(event, ui);
            }
            
			
		  }				
	    });      
      },
      car: function(makerID, modelInput, focusCallback, selectCallback) {
        modelInput.autocomplete({
          source: 'server/SelectCarModels.php?CarMakersID='+ makerID,
          minLength: 1,
          focus: function(event, ui) {
//            modelName.val(ui.item.label);
//            modelID.val(ui.item.value);
//              modelName = ui.item.label;
//              modelID = ui.item.value;
            if(focusCallback){
              focusCallback(ui.item);
            }
            return false;
          },
          select: function(event, ui) {
//            modelName = ui.item.label;
//            modelID = ui.item.value;
            console.log("selected", ui.item);
            console.log(selectCallback);
            if(selectCallback) {
              selectCallback(ui.item);
            }
            return false;
          }
        });
      }
    };
  });