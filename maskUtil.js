;(function(window, document,undefined) {
    
	 var maskUtil = (function(){
		 
		 var exports = {};
		 
		 var _maskNumber = function(input, decimalLimitSize) {
			 
			 if(!decimalLimitSize){
				 decimalLimitSize = 2;
			 }
			 
			 input.keydown(function (e) {
		        // Allow: backspace, delete, tab, escape, enter, comma and .
		        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 188, 190]) !== -1 ||
		             // Allow: Ctrl+A
		            (e.keyCode == 65 && e.ctrlKey === true) ||
		             // Allow: Ctrl+C
		            (e.keyCode == 67 && e.ctrlKey === true) ||
		             // Allow: Ctrl+X
		            (e.keyCode == 88 && e.ctrlKey === true) ||
		             // Allow: home, end, left, right
		            (e.keyCode >= 35 && e.keyCode <= 39)) {
		                 // let it happen, don't do anything
		                 return;
			        }
			        // Ensure that it is a number and stop the keypress
			        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			            e.preventDefault();
			        }
			    });
			 
			 input.focusout(function(e){
				 var val = input.val();
				 if(val.indexOf(",") > 0 || val.indexOf(".") > 0){
					 val = val.replace(",", ".");
					 var valueList = val.split(".");
					 
					 if(valueList[1].length > decimalLimitSize){
						 valueList[1] =  valueList[1].substring(0,3);
					 }
					 if(valueList[1].length < 1){
						 input.val(valueList[0]);
					 }else {
						 input.val(valueList[0] +"."+ valueList[1]);
					 }
					// input.val(parseFloat(val).toFixed(decimalLength));
				 }
			 });
			 
		}
		 
		 exports.maskNumber = _maskNumber;
		 
		 return exports;
	 })();
     
     window.maskUtil = maskUtil;
})(window, document);