<?php

$srcDir = '../../../src/';
$files = array_map(function($file) use ($srcDir) {
	return str_replace($srcDir, '', $file);
}, glob($srcDir.'ED/Doodles/**/*.js'));

$jsonString = json_encode($files, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$js = sprintf('window.eyedrawDoodleScripts = %s;', $jsonString);

file_put_contents('../js/doodles.js', $js);
