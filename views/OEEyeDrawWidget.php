<?php
/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */
?>
<div class="EyeDrawWidget ed-widget large-12 column" id="eyedrawwidget_<?php echo $idSuffix ?>">

	<!-- MANIPULATION ICONS -->
	<?php /*
	<?php if ($isEditable && $toolbar) { ?>
	<ul class="ed_toolbar clearfix">
		<?php
			$buttons = array(
				'moveToFront' => 'Move to front',
				'moveToBack' => 'Move to back',
				'deleteSelectedDoodle' => 'Delete',
				'resetEyedraw' => 'Reset eyedraw',
				'lock' => 'Lock',
				'unlock' => 'Unlock',
			);
			foreach ($buttons as $prefix => $label) {
		?>
		<li class="ed_img_button action" id="<?php echo $prefix.$idSuffix ?>">
			<a href="#" data-function="<?php echo $prefix ?>">
				<img src="<?php echo $imgPath.$prefix ?>.gif" />
			</a>
			<span><?php echo $label ?></span>
		</li>
		<?php } ?>

		<!-- See OE-2743 and OE-4114 -->
		<!--
		<li class="ed_img_button action" id="Label<?php echo $idSuffix ?>">
			<a href="#" data-function="addDoodle" data-arg="Label">
				<img src="<?php echo $imgPath ?>Label.gif" />
			</a>
			<span>Label</span>
		</li> -->
	</ul>
	<?php } ?>
	*/?>

	<?php if ($isEditable && count($doodleToolBarArray) > 0) {?>
		<div class="ed-toolbar">
			<?php foreach ($doodleToolBarArray as $row => $rowItems) { ?>
				<ul class="ed-toolbar-panel ed-main-toolbar">
					<?php foreach($rowItems as $item) {?>
						<li id="<?php echo $item['classname'].$idSuffix ?>">
							<a class="ed-button" href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
								<span class="icon-ed-<?php echo $item['classname'];?>"></span>
								<span class="label"><?php echo $item['title'] ?></span>
							</a>
						</li>
					<?php } ?>
				</ul>
			<?php } ?>
		</div>
	<?php } ?>

	<div class="ed-body">
		<div class="ed-editor">

			<!-- CANVAS -->
			<div class="ed-canvas-border"></div>
			<div class="ed-canvas-container">
				<canvas
					id="<?php echo $canvasId ?>"
					class="<?php if ($isEditable) { echo 'ed-canvas-edit'; } else { echo 'ed-canvas-display'; } ?>"
					width="<?php echo $width ?>" height="<?php echo $height ?>"
					tabindex="1"
					data-drawing-name="<?php echo $drawingName ?>"
					<?php if ($canvasStyle) { ?> style="<?php echo $canvasStyle ?>"<?php } ?>>
				</canvas>

				<?php if ($showCanvasToolbar) {?>
					<!-- CANVAS TOOLBAR -->
					<ul class="ed-toolbar-panel ed-canvas-toolbar">
						<li>
							<a class="ed-button" href="#" data-function="resetEyedraw">
								<span class="icon-ed-reset"></span>
								<span class="label">Reset eyedraw</span>
							</a>
						</li>
					</ul>
				<?php }?>
			</div>

			<?php if ($showDoodlePopup) {?>
				<!-- DOODLE POPUP -->
				<div class="ed-doodle-popup closed">
				</div>
			<?php }?>

			<?php if ($inputId) { ?>
				<!-- DATA FIELD -->
				<input
					type="hidden"
					id="<?php echo $inputId ?>"
					name="<?php echo $inputName ?>"
					value='<?php echo $this->model[$this->attribute] ?>' />
			<?php } ?>
		</div>
		<div class="ed-fields">
			<?php if ($showSelectedDoodle) {?>
				<!-- SELECTED DOODLE -->
				<div class="ed-selected-doodle">
					<select class="ed-selected-doodle-select" id="ed_example_selected_doodle">>
					</select>
				</div>
			<?php }?>
			<?php echo $fields;?>
		</div>
	</div>
</div>

