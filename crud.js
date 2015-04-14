;(function(window, document,undefined) {
    
    'use strict'
    
    var crud = (function(){
    	 var exports = {};
    	 var paramsDelete = '';
    	 var callbackDelete = null;
         
         var _initSelects = function(context) {
         	$("select.select2", context).select2();
         };
         
         var _initDatePickers = function(context) {
        	 $("input.date-picker", context).datepicker({
				  format: 'dd/mm/yyyy',
				  language: 'pt-BR'
			}); 
         };
         
         var _initInputNumbers = function(context){
        	 $("input.input-number", context).each(function(index,data) {
        		 var input = $(this);
        		 maskUtil.maskNumber(input, input.attr("decimal-limit-size"));
        	 });
        	 
         }
    	 
         var _new = function(context, callback) {
        	var contentBlock = $(".content-block", context);
         	$('.btn-new', context).click(function() {
         		var uri = $(this).attr("href");
         		loader.startLoaderBox($(".list-loader", contentBlock), contentBlock);
         		ajax.read(uri, {}, function(data) {
         			contentBlock
 	        			.html(data.template)
 	        			.hide()
 	        			.fadeIn('slow');
         			if (!callback) {
         				_save(context);
         				_list(context);
         				_initSelects(context);
         				_initDatePickers(context);
         				_initInputNumbers(context);
         			} else {
         				callback(context);
         			}
         		});
         		return false;
         	});
         };
         
         var _list = function(context, callback) {
        	 var contentBlock = $(".content-block", context);
         	$('.btn-list', context).click(function() {
         		var uri = $(this).attr("href");
         		_search({isAjax : true}, uri, context, callback);
         		return false;
         	});
         };
         
         var _save = function(context, callback) {
        	 var contentBlock = $(".content-block", context);
         	$('.btn-save', context).click(function(e) {
         		e.preventDefault();
         		var form = $("form", context),
         			uri = form.attr("action");

         		loader.startLoaderBox($(".list-loader", contentBlock), contentBlock);
         		ajax.save(uri, form, function(data) {
         			contentBlock
 	        			.html(data.template)
 	        			.hide()
 	        			.fadeIn('slow');
         			if (!callback) {
         				_list(context);
         				_initSelects(context);
         				_initDatePickers(context);
         				_initInputNumbers(context);
         				if(data.status == ajax.CREATED) {
         					message.info(data.message);
         					_update(context);
         					_new(context);
         					_btnDelete(context);
         				} else {
         					_save(context);
         				}         				
         			} else {
         				callback(context);
         				if(data.status !== ajax.CREATED) {
         					_save(context, callback);
         				}
         			}
         		});
         		return false;
         	});
         };
         
         var _edit = function(context, callback) {
        	 var contentBlock = $(".content-block", context);
         	$('.btn-edit', context).click(function() {
         		var uri = $(this).attr("href");
         		loader.startLoaderBox($(".list-loader", contentBlock), contentBlock);
         		ajax.read(uri, {}, function(data) {
         			contentBlock
 	        			.html(data.template)
 	        			.hide()
 	        			.fadeIn('slow');
         			if (!callback) {
	         			_new(context);
	         			_list(context);
	         			_update(context);
	         			_btnDelete(context);
	         			_initSelects(context);
	         			_initDatePickers(context);
	         			_initInputNumbers(context);
         			} else {
         				callback(context);
         			}
         		});
         		return false;
         	});
         };
         
         var _update = function(context, callback) {
        	 var contentBlock = $(".content-block", context);
         	$('.btn-update', context).click(function(e) {
         		e.preventDefault();
         		var form = $("form", context),
     				uri = form.attr("action");

         		ajax.update(uri, form, function(data) {
         			contentBlock
 	        			.html(data.template)
 	        			.hide()
 	        			.fadeIn('slow');
         			if (!callback) {
	         			_update(context);
	         			_new(context);
	         			_list(context);
	         			_btnDelete(context);
	         			_initSelects(context);
	         			_initDatePickers(context);
	         			_initInputNumbers(context);
         			} else {
         				callback(context);
         			}
         			if(data.status === ajax.OK) {
         				message.info(data.message);
         			} else if(data.status === ajax.METHOD_NOT_ALLOWED) {
         				message.warning(data.message);
         			} else if(data.status === ajax.INTERNAL_SERVER_ERROR) {
         				message.error(data.message);
         			} else if(data.status === ajax.INTERNAL_SERVER_ERROR || data.status === ajax.UNPROCESSABLE_ENTITY) {
         				message.error(data.message);
         			}
         		});
         		return false;
         	});
         };
         
         var _btnSearch = function(context, callback) {
         	$('.btn-search', context).click(function() {
         		var termo = $("input[name='termo']", $(this).parents(".dataTables_filter")).val();
         		_search({termo: termo, isAjax : true}, url("/" + context.attr("id") + "/list"), context, callback);
         	});
         };
         
         var _enterSearch = function(context, callback) {
         	var inputTermo = $("input[name='termo']", context);
         	inputTermo.keypress(function(e) {
     			var tecla = (e.keyCode?e.keyCode:e.which);
     			if ( tecla === 13 ) {
             		_search({termo: inputTermo.val(), isAjax : true}, url("/" +context.attr("id") + "/list"), context, callback);        			
     			}
     		});
         };
         
         var _search = function(data, uri, context, callback) {
        	 var contentBlock = $(".content-block", context);
         	loader.startLoaderBox($(".list-loader", contentBlock), contentBlock);
         	var success = function(data) {
         		contentBlock
         			.html(data.template)
         			.hide()
         			.fadeIn('slow');
         		if (!callback) {
         			_btnSearch(context);
         			_enterSearch(context);
         			_pagination(context);
         			_btnDelete(context);
         			_new(context);
         			_edit(context);         			
         		} else {
         			callback(context);
         		}
     		};
         	ajax.read(uri, data, success);
         }
         
         var _pagination = function(context, callback) {
         	$(".pagination .pg-steps a", context).click(function(e) {
         		e.preventDefault();
         		var link = $(this).attr("href")
         		_search({isAjax : true}, link, context, callback);
         		return false;
         	});
         };
         
         var _btnDelete = function(context, callback) {
          	$('a.btn-delete', context).click(function() {
          		paramsDelete = $(this).attr("href").toString().split("?")[1];
          		callbackDelete = callback;
          		alertMessages.delete("Confirma a exclusão do Item?", {onclick: "crud.delete('"+context.attr("id") + "','" + $(this).attr("data-id") + "')"} );
          		return false;
          	});
          };
          
          var _delete = function(idContexto, idItem) {
           	alertMessages.close();
           	var contexto = $("#" + idContexto);
           	var linkDelete = url("/"+idContexto+"/delete/"+idItem)
           	ajax.remove(linkDelete, {}, function(data) {
   				if(data.status === ajax.OK) {
   					_search({isAjax : true}, url("/"+idContexto+"/list?"+idItem+"&"+paramsDelete), contexto, callbackDelete);
   					message.info(data.message);
   					callbackDelete = null;
   				} else if(data.status === ajax.METHOD_NOT_ALLOWED) {
     				message.warning(data.message);
   				} else {
   					message.error(data.message);
   				}
           	});
           };
           
          var _initAll = function(content){
        	  _save(content);
              _update(content);
              _btnDelete(content);
              _btnSearch(content);
              _enterSearch(content)
              _pagination(content)
              _new(content);
              _list(content);
              _edit(content);
              _btnDelete(content);
          };
         
         exports.pagination = _pagination;
         exports.search = _search;
         exports.enterSearch = _enterSearch;
         exports.btnSearch = _btnSearch;
         exports.btnDelete = _btnDelete;
         exports.update = _update;
         exports.save = _save;
         exports.list = _list;
         exports.edit = _edit;
         exports.delete = _delete;
         exports.new = _new;
         exports.initSelects = _initSelects;
         exports.initDatePickers = _initDatePickers;
         exports.initInputNumbers = _initInputNumbers;
         exports.initAll = _initAll;
         
         return exports;
         
     })();
     
     window.crud = crud;
})(window, document);