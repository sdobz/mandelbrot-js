function scale_value(value, v_low, v_high, s_low, s_high) {
	// Scales value from v_low - v_high to s_low - s_high
	if (v_high - v_low == 0) {
		return s_low;
	}
	return (((value - v_low)/(v_high - v_low)) * (s_high - s_low)) + s_low;
}


max = 1 << 16;
log2 = Math.log(2);
function mandle_continuous_point(x0, y0, iterations) {
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

function render($e, width, height, iterations, top, right, bottom, left) {
	var points = new Float32Array(width*height);
	var hist = new Uint16Array(iterations + 2);
	/* Initialize to 1 past hist[iterations] */
	for (var i = 0; i < iterations + 2; i += 1) {
		hist[i] = 0;
	}
	var total = 0;
	i = 0;
	var v;
	/* First pass
	- Transform point from canvas space to mandle space
	- Calculate # iterations
	- Build histogram
	- Calculate iteration fraction
	 */
	for (var row = 0; row < height; row += 1) {
		for (var col = 0; col < width; col += 1) {
			v = mandle_continuous_point(
				scale_value(col, 0, width, left, right),
				scale_value(row, 0, height, top, bottom),
				iterations);
			points[i] = v;
			i += 1;
			hist[Math.floor(v)] += 1;
			total += v;
		}
	}
	var ctx = $e[0].getContext('2d');
	var pixel_width = $e.width() / width;
	var pixel_height = $e.height() / height;
	i = 0;
	var new_v;
	/*
	Second pass:
	- Sum histogram iterations
	- Render
	*/
	for (row = 0; row < height; row += 1) {
		for (col = 0; col < width; col += 1) {
			/*
			new_v = 0;
			if(points[i] == iterations) {
				new_v = 1;
			}
			else {
				for (var j = 0; j < Math.floor(points[i]); j += 1) {
					new_v += hist[j];
				}
				new_v /= total;
			}
			*/
			new_v = points[i] / iterations;
			ctx.fillStyle = get_color(new_v);
			ctx.fillRect(Math.floor(col * pixel_width), Math.floor(row * pixel_height),
						 Math.ceil(pixel_width), Math.ceil(pixel_height));
			i += 1;
		}
	}
}

function get_color(i) {
	/* i in range 0-1 */
	if (i == 1) {
		return '#000';
	}
	return 'hsl(' + (((i*3)%1)*360).toString() + ',50%,50%);';
}
