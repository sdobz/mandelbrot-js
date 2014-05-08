<?php
/* High performance mandlebrot set renderer

(lol)

GET Parameters:
width = # width columns
height = # height rows
iterations = # iterations
top = top side of mandlebrot set
right = right ...
bottom = bottom ...
left = left ...

Returns:
JSON array of normalized intensities according to histogram method
http://en.wikipedia.org/wiki/Mandelbrot_set#Computer_drawings

*/

function scale_value($value, $v_low, $v_high, $s_low, $s_high)
{
	// Scales value from v_low - v_high to s_low - s_high
	if ($v_high - $v_low == 0)
	{
		return $s_low;
	}
	return ((($value - $v_low)/($v_high - $v_low)) * ($s_high - $s_low)) + $s_low;
}

function mandle_point($x0, $y0, $iterations)
{
	// Returns how many iterations it takes for the complex point $u + $vi to have a magnitude > 2
	// with the recursive function z(n+1) = z(n)^2 + c
	// Copied from pseudocode on wikipedia
	$x = 0.0;
	$y = 0.0;
	$i = 0; // iteration index
	$max = 2 * 2;
	while ($x*$x + $y*$y < $max and $i < $iterations)
	{
		$xtemp = $x*$x - $y*$y + $x0;
		$y = 2*$x*$y + $y0;
		$x = $xtemp;
		$i += 1;
	}
	return $i;
}

$max = (1 << 16);
$log2 = log(2);

function mandle_continuous_point($x0, $y0, $iterations)
{
	global $max, $log2;
	$x = 0.0;
	$y = 0.0;
	$i = 0;

	// Here N=2^8 is chosen as a reasonable bailout radius.
	while ($x*$x + $y*$y < $max and  $i < $iterations) {
		$xtemp = $x*$x - $y*$y + $x0;
		$y = 2*$x*$y + $y0;
		$x = $xtemp;
		$i += 1;
	}
	// Used to avoid floating point issues with points inside the set.
	if ($i < $iterations) {
		$zn = sqrt($x*$x + $y*$y);
		$nu = log(log($zn) / $log2) / $log2;
		$i += 1 - $nu;
	}
	return $i;
}

function mandle_area($width, $height, $iterations, $top, $right, $bottom, $left)
{
	// Interpolate over the area defined by top right ... and compute the mandle_point for each
	// Returns an array of rows of values of the number of iterations
	$rows = [];
	for ($row = 0; $row < $height; $row += 1)
	{
		$cols = [];
		for ($col = 0; $col < $width; $col += 1)
		{
			$cols[] = mandle_continuous_point(scale_value($col, 0, $width, $left, $right),
								   scale_value($row, 0, $height, $top, $bottom),
								   $iterations);
		}
		$rows[] = $cols;
	}
	return $rows;
}

function gen_histogram($rows, $iterations)
{
	// Returns a normalized histogram-colored version of the iterations defined in $rows
	$hist = array_fill(0, $iterations + 1, 0);
	$total = 0;
	// This loop should occur during mandle_area, but speed is not really what we're going for...
	foreach ($rows as $cols)
	{
		foreach ($cols as $val)
		{
			$hist[$val] += 1;
			$total += 1;
		}
	}

	foreach ($rows as $row=>$cols)
	{
		foreach ($cols as $col=>$val)
		{
			$new_val = 0;
			for($i = 0; $i < $val; $i += 1)
			{
				$new_val += (float)$hist[$i]/$total;
			}
			$rows[$row][$col] = $new_val;
		}
	}
	return $rows;
}

function normalize_rows($rows, $iterations) {
	foreach ($rows as $row=>$cols)
	{
		foreach ($cols as $col=>$val)
		{
			$rows[$row][$col] = (float)$val/$iterations;
		}
	}
	return $rows;
}

function str_2d_array($rows)
{
	// Just for fun, there are much better ways to do this
	return '[' . join(',' . PHP_EOL, array_map(function($row) {
		return '[' . join(',', array_map(function($val) {
			return (string)$val;
		}, $row)) . ']';
	}, $rows)) . ']';
}

function tabbed_2d_array($rows) {
	# Appropriate for pasting into excel etc.
	return join(PHP_EOL, array_map(function($row) {
		return join("\t", array_map(function($val) {
			return (string)$val;
		}, $row));
	}, $rows));
}

?>