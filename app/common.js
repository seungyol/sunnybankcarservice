function setupSuburbAuto(suburb, state, postcode){
	suburb.autocomplete({
		source:'server/SelectPostCodes.php',
		minLength:3,
		// focus: function(event, ui){
			// $("#Suburb").val(ui.item.label);
			// return false;
		// },
		select: function(event, ui){
			var vals = ui.item.value.split(',');
			suburb.val(vals[0]);
			state.val(vals[1]);
			postcode.val(vals[2]);
			return false;
		}				
	});
}