$(document).ready(function() {
	
	$(document).one('ready', function() {
		$('.panel .collapse:first').addClass('in');
		draw.call($('.panel .collapse:first'));
	});
	
	//voting
	$('#list').on('click', 'button', function() {
		var that = this;
		var value = $(this).attr("id");
		var parent = $(this).parents(".collapse");
		$.post("/vote/api/", {
			id: parent.attr("id"),
			value: value
		}, function(data, status) {
			//$(that).attr('data-votes', data.choices[0].votes);
			$(that).siblings().addBack().each(function(i) {
				$(this).attr('data-votes', data.choices[i].votes)
			});
			draw.call($(that).parents('.collapse'));
		});
	});
	
	// filter button
	$('#filter').click(function() {
		if ($(this).hasClass('active')) {
			$('.panel').show();
			$(this).removeClass('active');
		}
		else {
			$(this).addClass('active');
			$.getJSON("/vote/api/user_data", function(data) {
				// Make sure the data contains the username as expected before using it
				if (data.hasOwnProperty('id')) {
					$('a[data-user][data-user!="' + data.id + '"]').each(function() {
						console.log($(this).attr('data-user'));
						$(this).parents('.panel:first').hide();
					});
				}
			});
		}

	});
	
	// update graph
	$('.collapse').on('show.bs.collapse', function() {
		draw.call(this);
	});
	
	//draw graph
	var myChart;
	function draw(that) {
		if (myChart) {
			myChart.destroy();
		}
		var labels = [];
		var data = [];
		$(this).find("button").each(function() {
			labels.push($(this).attr("value"));
			data.push(Number($(this).attr("data-votes")));
		});
		var ctx = document.getElementById("myChart").getContext("2d");
		myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					label: '# of Votes',
					data: data,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				legend: false,
				responsive: false
			}
		});
	}
});
