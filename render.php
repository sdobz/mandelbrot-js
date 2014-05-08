<?php
if(!isset($_GET['width']) or
	!isset($_GET['height']) or
	!isset($_GET['iterations']) or
	!isset($_GET['top']) or
	!isset($_GET['right']) or
	!isset($_GET['bottom']) or
	!isset($_GET['left']) or
	!isset($_GET['histogram']))
{
	die('Required GET parameters: width, height, iterations, top, right, bottom, left, histogram');
}

include 'mandlebrot.php';

$data = mandle_area((int)$_GET['width'],
					(int)$_GET['height'],
					(int)$_GET['iterations'],
					(float)$_GET['top'],
					(float)$_GET['right'],
					(float)$_GET['bottom'],
					(float)$_GET['left']);
if($_GET['histogram'] == 1) {
	$data = gen_histogram($data, (int)$_GET['iterations']);
}
else {
	$data = normalize_rows($data, (int)$_GET['iterations']);
}
echo(str_2d_array($data));
?>
