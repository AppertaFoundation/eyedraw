<?php

$srcDir = '../../../assets/img/icons/32x32/draw/';
$files = array_map(function($file) use ($srcDir) {
	return str_replace($srcDir, '', $file);
}, glob($srcDir.'**/*.png'));

$jsonString = json_encode($files, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$js = sprintf('window.eyedrawImages = %s;', $jsonString);

file_put_contents('../js/images.js', $js);
