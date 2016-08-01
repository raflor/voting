$(document).ready(function(){
	$('#list').on('click','button',function () {
		var value = $(this).attr("value");
		var parent = $(this).parents(".collapse");
		$.post("https://voting-app-raflor.c9users.io/vote/api",{name:parent.attr("id"), value:value},function(data, status){
			//var response = JSON.parse(data);
		parent.prev().children().html(data.votes.yae);
		});
	});
});