<?php
include 'mandlebrot.php';

class MandlebrotTest extends PHPUnit_Framework_TestCase
{
	public function test_scle_value_zero_division()
	{
		$this->assertEquals(scale_value(0, 0, 0, 0, 0), 0);
		$this->assertEquals(scale_value(0, 5, 5, 8, 10), 8);
	}
	public function test_scale_value()
	{
		$this->assertEquals(scale_value(0, 0, 1, 0, 1), 0);
		$this->assertEquals(scale_value(1, 0, 1, 0, 1), 1);
		$this->assertEquals(scale_value(1, 0, 1, 0, 2), 2);
		$this->assertEquals(scale_value(0.5, 0, 1, 0, 10), 5);
		$this->assertEquals(scale_value(1, 0, 1, 0, 10), 10);
		$this->assertEquals(scale_value(0, 1, 2, 0, 1), -1);
	}
	public function test_mandle_point()
	{
		// Inside bulb
		$this->assertEquals(mandle_point(0, 0, 10), 10);
		// On outer edge
		$this->assertEquals(mandle_point(2, 2, 10), 1);
		// Random point, TODO: verify value
		$this->assertEquals(mandle_point(-1, .5, 10), 5);
	}
	public function test_mandle_area()
	{
		// Visual tests are p.sweet
		$this->assertEquals(tabbed_2d_array(mandle_area(20, 20, 100, -1, 1, 1, -2.5)),
"1	1	1	1	1	2	3	3	3	3	3	4	4	6	11	4	3	3	2	2
1	1	1	1	1	2	3	3	3	3	4	4	5	9	11	5	4	3	2	2
1	1	1	1	2	3	3	3	3	4	4	5	6	55	100	6	5	3	3	2
1	1	1	1	2	3	3	3	3	4	5	8	8	100	100	8	6	4	3	2
1	1	1	1	3	3	3	3	4	5	6	14	26	100	100	100	15	5	3	3
1	1	1	1	3	3	3	4	5	5	6	41	100	100	100	100	100	5	3	3
1	1	1	1	3	3	4	10	7	7	8	100	100	100	100	100	100	7	3	3
1	1	1	2	4	4	5	8	12	17	11	100	100	100	100	100	100	6	3	3
1	1	1	3	4	5	5	12	100	100	16	100	100	100	100	100	100	6	4	3
1	1	1	4	4	6	8	15	100	100	33	100	100	100	100	100	100	5	4	3
1	1	1	100	100	100	100	100	100	100	100	100	100	100	100	100	12	5	4	3
1	1	1	4	4	6	8	15	100	100	33	100	100	100	100	100	100	5	4	3
1	1	1	3	4	5	5	12	100	100	16	100	100	100	100	100	100	6	4	3
1	1	1	2	4	4	5	8	12	17	11	100	100	100	100	100	100	6	3	3
1	1	1	1	3	3	4	10	7	7	8	100	100	100	100	100	100	7	3	3
1	1	1	1	3	3	3	4	5	5	6	41	100	100	100	100	100	5	3	3
1	1	1	1	3	3	3	3	4	5	6	14	26	100	100	100	15	5	3	3
1	1	1	1	2	3	3	3	3	4	5	8	8	100	100	8	6	4	3	2
1	1	1	1	2	3	3	3	3	4	4	5	6	55	100	6	5	3	3	2
1	1	1	1	1	2	3	3	3	3	4	4	5	9	11	5	4	3	2	2");
	}
	public function test_str_2d_array()
	{
		$this->assertEquals(str_2d_array([[1, 2], [3, 4]]), '[[1,2],' . PHP_EOL . '[3,4]]');
	}
	public function test_tabbed_2d_array()
	{
		$this->assertEquals(tabbed_2d_array([[1, 2], [3, 4]]), "1\t2" . PHP_EOL . "3\t4");
	}
}

?>