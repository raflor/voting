$(document).ready(function() {
	$('#list').on('click', 'button', function() {
		var that = this;
		var value = $(this).attr("value");
		var parent = $(this).parents(".collapse");
		$.post("https://voting-app-raflor.c9users.io/vote/api/:id", {
			id: parent.attr("id"),
			value: value
		}, function(data, status) {
			//$(that).attr('data-votes', data.choices[0].votes);
			$(that).siblings().addBack().each(function(i) {
				$(this).attr('data-votes', data.choices[i].votes)
			});
		});
		
	});
});
