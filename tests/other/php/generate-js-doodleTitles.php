<?php

include '../../../DoodleInfo.php';

$titles = DoodleInfo::$titles;
$jsonString = json_encode($titles, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$js = sprintf('window.eyedrawDoodleTitles = %s;', $jsonString);
file_put_contents('../js/doodleTitles.js', $js);
