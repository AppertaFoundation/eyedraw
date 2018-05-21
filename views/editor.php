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

<div class="ed-editor">
	<?php if ($showDrawingControls && $mode !== 'view') {?>
		<div class="ed-drawing-controls<?= $toggleScale ? ' ed-feature-zoom': '';?>">
			<!-- DRAWING TOOLBAR -->
			<ul class="ed-toolbar-panel ed-drawing-toolbar">
				<li>
					<a class="ed-button" href="#" data-function="resetEyedraw">
						<span class="icon-ed-reset"></span>
						<span class="label">Reset eyedraw</span>
					</a>
				</li>
				<?php if ($toggleScale) {?>
					<li>
						<a class="ed-button" href="#" data-function="toggleZoom">
							<span class="icon-ed-zoom-out"></span>
							<span class="label">Toggle Zoom</span>
						</a>
					</li>
				<?php }?>
			</ul>
			<!-- SELECTED DOODLE -->
			<div class="ed-selected-doodle">
				<select class="ed-selected-doodle-select cols-full" id="ed_example_selected_doodle">
				</select>
			</div>
		</div>
	<?php }?>

	<?php if ($isEditable && $showDoodlePopup) {?>
		<!-- DOODLE POPUP -->
		<div class="ed-doodle-popup closed<?= $popupDisplaySide == 'left' ? ' ' . $popupDisplaySide : ''?>" data-display-side="<?= $popupDisplaySide ? $popupDisplaySide : ''?>">
		</div>
	<?php }?>

	<!-- CANVAS -->
	<canvas
		id="<?php echo $canvasId ?>"
		class="<?php if ($isEditable) { echo 'ed-canvas-edit'; } else { echo 'ed-canvas-display'; } ?>"
		width="<?php echo $width ?>" height="<?php echo $height ?>"
		tabindex="1"
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