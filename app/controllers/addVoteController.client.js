$(document).ready(function() {
	var i = 1;
	$('#add').click(function() {
		$('#add').before('<div class="form-group"><input type="text" class="form-control" name="choice'+i+'" placeholder="Choice"></div>');
		i++;
	});
	$('form').submit(function(event) {
		var req = $('form').serializeArray();
		var name = req.shift();
		$.post("/addvote/api",{name:name.value, value:req},function(data, status){
			window.location.assign('/vote');
		});
		event.preventDefault();
		
	});
});