<?php //-->
$url = 'http:/'.str_replace('//', '/', $_SERVER['REQUEST_URI']);

$path = explode('/', $_SERVER['REQUEST_URI']);
$file = array_pop($path);

if(strpos($file, '.') !== false) {
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	header('Content-Type: '.finfo_file($finfo, $url));
	echo file_get_contents($url);
	exit;
}

exec("bin/phantomjs phantom.js $url 2>&1", $output);
$output = implode("\n", $output);
$boundaries = explode("--BOUNDARY", $output);
echo trim($boundaries[1]);