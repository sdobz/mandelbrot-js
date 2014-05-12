function scale_value(value, v_low, v_high, s_low, s_high) {
	// Scales value from v_low - v_high to s_low - s_high
	if (v_high - v_low == 0) {
		return s_low;
	}
	return (((value - v_low)/(v_high - v_low)) * (s_high - s_low)) + s_low;
}


max = 1 << 16;
log2 = Math.log(2);
function mandel_continuous_point(x0, y0, iterations) {
	// TODO: Cartioid/2nd bulb check
	var x = 0.0;
	var y = 0.0;
	var i = 0;
	var xtemp, ytemp;

	// Here N=2^8 is chosen as a reasonable bailout radius.
	while (x*x + y*y < max &&  i < iterations) {
		xtemp = x*x - y*y + x0;
		ytemp = 2*x*y + y0;
		if (x == xtemp && y == ytemp) {
			i = iterations;
			break;
		}
		x = xtemp;
		y = ytemp;
		i += 1;
	}
	// Used to avoid floating point issues with points inside the set.
	if (i < iterations) {
		var zn = Math.sqrt(x*x + y*y);
		var nu = Math.log(Math.log(zn) / log2) / log2;
		i += 1 - nu;
	}
	return i;
}


var cycle = 20;
var m, h, l;
function get_color(i, iterations) {
	/* i in range 0-1 */
	if (i == iterations) {
		return '#000';
	}
	m = (i % cycle)/cycle;
	if (m < 0.5) {
		h = 240; // blue
		// black to white
		l = scale_value(m, 0, 0.5, 0, 100);
	}
	else {
		h = 30; // orange
		l = scale_value(m, 0.5, 1, 100, 0);
	}

	return 'hsl(' + h.toString() + ',50%,' + l.toString() + '%);';
}

function render($e, width, height, iterations, region) {
	var top    = region[0],
	    right  = region[1],
	    bottom = region[2],
	    left   = region[3];
	var total = 0;
	var v;
	var ctx = $e[0].getContext('2d');
	var pixel_width = $e.width() / width;
	var pixel_height = $e.height() / height;
	/*
	- Transform point from canvas space to mandel space
	- Calculate # iterations
	- Calculate iteration fraction
	- Get color
	- Plot point(rect)
	 */
	for (var row = 0; row < height; row += 1) {
		for (var col = 0; col < width; col += 1) {
			ctx.fillStyle = get_color(mandel_continuous_point(
			    scale_value(col, 0, width, left, right),
			    scale_value(row, 0, height, top, bottom),
			    iterations), iterations);
			ctx.fillRect(Math.floor(col * pixel_width), Math.floor(row * pixel_height),
			             Math.ceil(pixel_width), Math.ceil(pixel_height));
		}
	}
}
