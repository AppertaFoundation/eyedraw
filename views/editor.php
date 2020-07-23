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

<div class="ed2-editor">
	<?php if ($isEditable && $showDoodlePopup) {?>
		<!-- DOODLE POPUP -->
		<div class="ed2-doodle-popup closed<?= $popupDisplaySide == 'left' ? ' ' . $popupDisplaySide : ''?>" data-display-side="<?= $popupDisplaySide ? $popupDisplaySide : ''?>">
		</div>
	<?php }?>

	<!-- CANVAS -->
	<canvas
		id="<?php echo $canvasId ?>"
		class="<?php if ($isEditable) { echo 'ed-canvas-edit'; } else { echo 'ed-canvas-display'; } ?>"
		width="<?php echo $width ?>" height="<?php echo $height ?>"
		data-drawing-name="<?php echo $drawingName ?>"
		<?php if ($canvasStyle) { ?> style="<?php echo $canvasStyle ?>"<?php } ?>>
	</canvas>

	<?php if ($inputId) { ?>
		<!-- DATA FIELD -->
		<input
			type="hidden"
			id="<?php echo $inputId ?>"
			name="<?php echo $inputName ?>"
			value='<?php echo $this->model[$this->attribute] ?>' />
	<?php } ?>
</div>

