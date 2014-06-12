<?php

$srcDir = '../../../src/';

$pattern = sprintf('{%s}', implode(',', array_map(function($p) use ($srcDir) {
	return $srcDir.$p;
}, array(
	'ED.js',
	'ED/Drawing.js',
	'ED/Drawing/*.js',
	'ED/*.js',
	'ED/Doodles/**/*.js',
	'ED/Misc/*.js',
	'ED/Views/*.js',
	'ED/Views/**/*.js',
	'OEEyeDraw.js'
))));

$files = array_map(function($file) use ($srcDir) {
	return str_replace($srcDir, '', $file);
}, glob($pattern, GLOB_BRACE));

$jsonString = json_encode($files, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$js = sprintf('window.eyedrawScripts = %s;', $jsonString);

file_put_contents('../js/scripts.js', $js);
