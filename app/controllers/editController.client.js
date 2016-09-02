$(document).ready(function() {
	var i = 1;
	$('.add').click(function() {
		$('.add').parent().prev().before('<li class="list-group-item"><div class="form-group"><div class="row"><div class="input-group"><input class="form-control" name="choice' + i + ' type="text" placeholder="choice"><span class="input-group-btn"><div class="btn btn-default del" type="button"><span class="glyphicon glyphicon-trash" aria-lsbrl="delete"></span></div></span></input></div></div></div></li>');
		i++;
	});

	$(document).on('click', '.del', function() {
		var form = $(this).parents('form')
		$(this).parents('.list-group-item').first().remove();
		var req = form.serializeArray();
		var id = form.parent().attr('id');
		console.log(req);
		var name = req.shift();
		$.post("https://immense-dawn-70417.herokuapp.com/editpoll/api", {
			id: id,
			name: name,
			value: req
		}, function(data, status) {
			//window.location.reload();
		});
	});

	$('form').submit(function(event) {
		var req = $(this).serializeArray();
		var name = req.shift();
		var id = $(this).parent().attr('id');
		$(this).find('#ok').parents('.list-group-item').first().after('<li class="list-group-item"><div class="form-group"><div class="input-group"><input class="form-control anonym" name="choice'+i+'" type="text" placeholder="choice"><span class="input-group-btn"><button class="btn btn-default" id="ok" type="submit"><span class="glyphicon glyphicon-ok" aria-lsbrl="submit"></span></button></span></input></div></div></li>');
		$(this).find('#ok').parent().prev().removeAttr('placeholder');
		$(this).find('#ok').replaceWith('<div class="btn btn-default del" type="button"><span class="glyphicon glyphicon-trash" aria-lsbrl="delete"></span></div>');
		var that = this;
		i++;
		$.post("https://immense-dawn-70417.herokuapp.com/editpoll/api",{id:id, name:name, value:req},function(data, status){
			$(that).find('input[name^="choice"]').attr('name',data.choices[data.choices.length-1]._id)
		});
		return false;
	});

	// change title
	$(document).on('click', '.title', function() {
		var req = $(this).parents('form').serializeArray();
		var name = req.shift();
		var id = $(this).parents('panel-collapse').attr('id');
		$.post("https://immense-dawn-70417.herokuapp.com/editpoll/api", {
			id: id,
			name: name,
			value: req
		}, function(data, status) {
			window.location.reload();
		});
	})

	$(document).on('click', '#delete_poll', function() {
		var id = $(this).prev().attr('href').slice(1);
		$(this).parents('.panel').first().remove();
		$.post("https://immense-dawn-70417.herokuapp.com/deletepoll/api", {
			id: id
		}, function(data, status) {
			//window.location.reload();
		});
	});

	/*$('.panel-collapse').on('hide.bs.collapse', function() {
		var req = $(this).serializeArray();
		var name = req.shift();
		var id = $(this).parent().attr('id');
		$.post("https://immense-dawn-70417.herokuapp.com/editpoll/api",{id:id, name:name, value:req},function(data, status){
		});
		return false;
	});*/
});
