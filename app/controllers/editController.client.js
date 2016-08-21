$(document).ready(function() {
	var i = 1;
	$('#add').click(function() {
		$('#add').parent().prev().before('<li class="list-group-item"><div class="form-group"><div class="row"><div class="input-group"><input class="form-control" name="choice'+i+' type="text" placeholder="choice"><span class="input-group-btn"><div class="btn btn-default del" type="button"><span class="glyphicon glyphicon-trash" aria-lsbrl="delete"></span></div></span></input></div></div></div></li>');
		i++;
	});
	$(document).on('click', '.del',function() {
		console.log('del');
		$(this).parents('.list-group-item').first().remove();
		var req = $(this).parents('form').serializeArray();
		var id = $(this).parents('form').parent().attr('id');
		//console.log(req);
		$.post("https://voting-app-raflor.c9users.io/editpoll/api/:id",{id:id, value:req},function(data, status){
			window.location.reload();
		});
	});
	
	$('form').submit(function(event) {
		var ok = $('#ok');
		var req = $(this).serializeArray();
		console.log(req);
		ok.parents('.list-group-item').first().after('<li class="list-group-item"><div class="form-group"><div class="row"><div class="input-group"><input class="form-control anonym" name="choice'+i+'" type="text" placeholder="choice"><span class="input-group-btn"><button class="btn btn-default" id="ok" type="submit"><span class="glyphicon glyphicon-ok" aria-lsbrl="submit"></span></button></span></input></div></div></div></li>');
		ok.parent().prev().removeAttr('placeholder');
		ok.replaceWith('<div class="btn btn-default del" type="button"><span class="glyphicon glyphicon-trash" aria-lsbrl="delete"></span></div>');
		i++;
		var id = $(this).parent().attr('id');
		console.log(req);
		$.post("https://voting-app-raflor.c9users.io/editpoll/api/:id",{id:id, value:req},function(data, status){
			window.location.reload();
		});
		return false;
	});
	
	$('#delete_poll').click(function(){
		console.log('delete');
		var id = $(this).prev().attr('href').slice(1);
		$(this).parents('.panel').first().remove();
		$.post("https://voting-app-raflor.c9users.io/deletepoll/api/:id",{id:id},function(data, status){
			//window.location.reload();
		});
	});
});
