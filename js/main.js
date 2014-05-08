function get_url(width, height, iterations, top2, right, bottom, left, histogram) {
	return "http://localhost/mandlebrot/render.php?width=" + width + "&height=" + height + "&iterations=" + iterations + "&top=" + top2 + "&right=" + right + "&bottom=" + bottom + "&left=" + left + "&histogram=" + histogram
}

function scale_value(value, v_low, v_high, s_low, s_high)
{
	// Scales value from v_low - v_high to s_low - s_high
	if (v_high - v_low == 0)
	{
		return s_low;
	}
	return (((value - v_low)/(v_high - v_low)) * (s_high - s_low)) + s_low;
}

function render($e, data) {
	var ctx = $e[0].getContext('2d');
	// Possible error indexing data
	var pixel_width = $e.width() / data[0].length;
	var pixel_height = $e.height() / data.length;

	for (var row = 0; row < data.length; row += 1) {
		for (var col = 0; col < data[row].length; col += 1) {
			if(col == 100) {
				console.log(data[row][col]);
			}
			ctx.fillStyle = get_color(data[row][col]);
			ctx.fillRect(Math.floor(col * pixel_width), Math.floor(row * pixel_height),
						 Math.ceil(pixel_width), Math.ceil(pixel_height));
		}
	}
}

function to_color(r, g, b) {
	return '#' + (b | (g << 8) | (r << 16)).toString(16);
}

function get_color(i) {
	return 'hsl(' + (i*360).toString() + ',50%,50%);';
}
