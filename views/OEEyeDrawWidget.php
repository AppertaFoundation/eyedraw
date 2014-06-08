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
<div class="EyeDrawWidget" id="eyedrawwidget_<?php echo $idSuffix ?>">

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

	<?php if ($isEditable && count($doodleToolBarArray) > 0) {
		foreach ($doodleToolBarArray as $row => $rowItems) { ?>
	<ul class="ed_toolbar clearfix" id="<?php echo $canvasId.'doodleToolbar' . $row ?>">
		<?php
			$main_items = array_slice($rowItems, 0, 7);
			$extra_items = array_slice($rowItems, 7);
			foreach ($main_items as $item) {
		?>
		<li class="ed_img_button action" id="<?php echo $item['classname'].$idSuffix ?>">
			<a href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
				<img src="<?php echo $imgPath.$item['classname'] ?>.gif" />
			</a>
			<span><?php echo $item['title'] ?></span>
		</li>
		<?php
			}
			if (count($extra_items)) {
		?>
		<li class="ed_img_button drawer">
			<a href="#">
				<img src="<?php echo $imgPath ?>more.gif" />
			</a>
			<span>More...</span>
			<ul class="clearfix">
				<?php foreach ($extra_items as $item) { ?>
				<li class="ed_img_button action"  id="<?php echo $item['classname'].$idSuffix ?>">
					<a href="" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
						<img src="<?php echo $imgPath.$item['classname'] ?>.gif" />
					</a>
					<span><?php echo $item['title'] ?></span>
				</li>
				<?php } ?>
			</ul>
		</li>
		<?php } ?>
	</ul>
	<?php } ?>
	<?php } ?>

	<span class="canvasTooltip" id="<?php echo $canvasId.'Tooltip' ?>"></span>
	<canvas id="<?php echo $canvasId ?>"
		class="<?php if ($isEditable) { echo 'ed_canvas_edit'; } else { echo 'ed_canvas_display'; } ?>"
		width="<?php echo $width ?>" height="<?php echo $height ?>"
		tabindex="1" data-drawing-name="<?php echo $drawingName ?>"
		<?php if ($canvasStyle) { ?> style="<?php echo $canvasStyle ?>"<?php } ?>>
	</canvas>
	<?php if ($inputId) {?>
		<?php echo CHtml::hiddenField($inputName,$this->model[$this->attribute])?>
	<?php }?>
</div>

<script type="text/javascript">

	// Use jQuery.hoverIntent if available
	var hover_event = 'hover';
	if ($.fn.hoverIntent) {
		hover_event = 'hoverIntent';
	}
	$('#eyedrawwidget_<?php echo $idSuffix ?> .ed_toolbar a')[hover_event](
			function(e) {
				$(this).next().addClass('active');
			},
			function(e) {
				$(this).next().removeClass('active');
			}
	);

	$('#eyedrawwidget_<?php echo $idSuffix ?> .ed_toolbar li.action a').click(function(e) {
		var fn = $(this).attr('data-function');
		var arg = $(this).attr('data-arg');
		if (typeof(<?php echo $drawingName?>[fn]) == "function") {
			<?php echo $drawingName?>[fn](arg);
		}
		$(".EyeDrawWidget .drawer").removeClass('active');
		e.preventDefault();
	});

	// Show/hide drawer when clicked on/away
	$(document).click(function() {
		$(".EyeDrawWidget .drawer").removeClass('active'); //click came from somewhere else
	});
	$('#eyedrawwidget_<?php echo $idSuffix ?> .ed_toolbar li.drawer > a').click(function(e) {
		$(".EyeDrawWidget .drawer").removeClass('active');
		$(this).parent().addClass('active');
		e.stopPropagation();
		e.preventDefault();
	});

</script>
