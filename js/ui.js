var zooms = [];
var current_zoom = -1; // Once add_zoom is called zooms[current_zoom] will make sense
var zoom_e = [];

function get_current_region() {
	return zooms[current_zoom];
}

function add_zoom(top, right, bottom, left) {
	current_zoom += 1;
	zooms = zooms.slice(0, current_zoom);
	zooms.push([top, right, bottom, left]);
	draw_zooms();
}

function draw_zooms() {
	$ul = $('#zoom-list');
	$ul.empty();
	var region, x, y;
	for (var i = 0; i < zooms.length; i += 1) {
		region = zooms[i];
		x = (region[1] + region[3])/2;
		y = (region[0] + region[2])/2;
		$e = $('<li>').attr('data-zoom-level', i).text('x: ' + x.toFixed(16) + ' y: ' + y.toFixed(16) + ' ' + Math.pow(2, i) + 'x');
		zoom_e.push($e);
		$ul.append($e);
		if (i == current_zoom) {
			$e.addClass('current-zoom');
		}
		if (i > current_zoom) {
			$e.addClass('over-zoom');
		}
	}
	$('#zoom-list li').click(function() {
		current_zoom = parseInt($(this).attr('data-zoom-level'));
		draw_zooms();
		render($render_out, 200, 200, get_iterations(), zooms[current_zoom]);
	});
}

function register_keys() {
	$(document).keydown(function(e){
		if (e.keyCode == 38) { 
			if(current_zoom > 0) {
				current_zoom -= 1;
				draw_zooms();
				render($render_out, 200, 200, get_iterations(), zooms[current_zoom]);
			}
			return false;
		}
		if (e.keyCode == 40) { 
			if(current_zoom < zooms.length - 1) {
				current_zoom += 1;
				draw_zooms();
				render($render_out, 200, 200, get_iterations(), zooms[current_zoom]);
			}
			return false;
		}
	});
}

function get_iterations() {
	return parseInt($('#iterations').val());
}
