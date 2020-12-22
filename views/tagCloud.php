<?php
/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */
?>

<?php
echo '
<div id="ed2-no-doodle-elements" class="ed-tag-cloud Arow divider">
	<ul class="MultiSelectList multi-select-selections hide">';
		if (isset($imageUrl))
		{
			$tags = array();
			$decoded_json = json_decode($this->model[$this->attribute]);

			OELog::log(print_r($decoded_json, true));

			foreach ($decoded_json as $doodle)
			{
				if (property_exists($doodle, "tags"))
				{
					$tags = array_merge($tags, $doodle->tags);
				}
			}

			foreach($tags as $tag)
			{
				$decoded_tag = json_decode($tag);
				echo '<li class="ed-tag" pk_id="' . $decoded_tag->pk_id . '" snomed_code="' . $decoded_tag->snomed_code . '"><span class="text">' . $decoded_tag->text . '</span></li>';
			}
		}
echo	'</ul>
</div>';
?>