$(document).ready(function() {
	var i = 1;
	$('#add').click(function() {
		$('#add').before('<div class="form-group"><input type="text" class="form-control" name="choice'+i+'" placeholder="Choice"></div>');
		i++;
	});
	$('form').submit(function(event) {
		var req = $('form').serializeArray();
		var name = req.shift();
		$.post("https://voting-app-raflor.c9users.io/addvote/api/:id",{name:name.value, value:req},function(data, status){
		});
		event.preventDefault();
		window.location.replace('https://voting-app-raflor.c9users.io/vote');
	});
});