<!-- Uncomment following line to re-enable doodle hover tooltips once layer bug is fixed (OE-1583) -->
<!-- <span id="canvasTooltip"></span> -->
<div data-side="<?php echo $side?>">
	<canvas id="<?php echo $canvasId?>" class="<?php if ($isEditable) { echo 'edit'; } else { echo 'display'; }?>" width="<?php echo $size?>" height="<?php echo $size?>" tabindex="1"<?php if ($canvasStyle) {?> style="<?php echo $canvasStyle?>"<?php }?>></canvas>
	<input type="hidden" id="<?php echo $inputId?>"
		name="<?php echo $inputName?>"
		value='<?php echo $this->model[$this->attribute]?>' />
	<?php if ($isEditable && $toolbar) {?>
	<div style="float: left">
		<div class="ed_toolbar">
			<button class="ed_img_button" disabled=true
				id="moveToFront<?php echo $idSuffix?>" title="Move to front"
				onclick="<?php echo $drawingName?>.moveToFront(); return false;">
				<img src="<?php echo $imgPath?>moveToFront.gif" />
			</button>
			<button class="ed_img_button" disabled=true
				id="moveToBack<?php echo $idSuffix?>" title="Move to back"
				onclick="<?php echo $drawingName?>.moveToBack(); return false;">
				<img src="<?php echo $imgPath?>moveToBack.gif" />
			</button>
			<button class="ed_img_button" disabled=true
				id="deleteDoodle<?php echo $idSuffix?>" title="Delete"
				onclick="<?php echo $drawingName?>.deleteDoodle(); return false;">
				<img src="<?php echo $imgPath?>deleteDoodle.gif" />
			</button>
			<button class="ed_img_button" disabled=true
				id="lock<?php echo $idSuffix?>" title="Lock"
				onclick="<?php echo $drawingName?>.lock(); return false;">
				<img src="<?php echo $imgPath?>lock.gif" />
			</button>
			<button class="ed_img_button" id="unlock<?php echo $idSuffix?>"
				title="Unlock"
				onclick="<?php echo $drawingName?>.unlock(); return false;">
				<img src="<?php echo $imgPath?>unlock.gif" />
			</button>
		</div>
		<div class="ed_toolbar">
			<?php foreach ($doodleToolBarArray as $i => $item) {?>
			<?php if ($i>0 && $i%6 == 0) {?>
		</div>
		<div class="ed_toolbar">
			<?php }?>
			<button class="ed_img_button"
				id="<?php echo $item['classname'].$idSuffix?>"
				title="<?php echo $item['title']?>"
				onclick="<?php echo $drawingName?>.addDoodle('<?php echo $item['classname']?>'); return false;">
				<img src="<?php echo $imgPath.$item['classname']?>.gif" />
			</button>
			<?php }?>
		</div>
	</div>
	<?php }?>
	<?php if ($isEditable) {?>
	<div class="eyedrawFields">
		<div>
			<div class="label">
				<?php echo $model->getAttributeLabel($side.'_sphere'); ?>
				:
			</div>
			<div class="data segmented">
				<?php Yii::app()->getController()->renderPartial('_segmented_field', array('element' => $model, 'field' => $side.'_sphere'), false, false)?>
			</div>
		</div>
		<div>
			<div class="label">
				<?php echo $model->getAttributeLabel($side.'_cylinder'); ?>
				:
			</div>
			<div class="data segmented">
				<?php Yii::app()->getController()->renderPartial('_segmented_field', array('element' => $model, 'field' => $side.'_cylinder'), false, false)?>
			</div>
		</div>
		<div>
			<div class="label">
				<?php echo $model->getAttributeLabel($side.'_axis'); ?>
				:
			</div>
			<div class="data">
				<?php echo CHtml::activeTextField($model, $side.'_axis', array('class' => 'axis')) ?>
			</div>
		</div>
		<div>
			<div class="label">
				<?php echo $model->getAttributeLabel($side.'_type_id'); ?>
				:
			</div>
			<div class="data">
				<?php echo CHtml::activeDropDownList($model, $side.'_type_id', $refraction_types, array('class' => 'refractionType'))?>
				<?php echo CHtml::activeTextField($model, $side.'_type_other')?>
			</div>
		</div>
	</div>
	<?php }else{?>
	<div class="eyedrawFields view">
		<div>
			<div class="data">
				<?php echo $model->getCombined($side)?>
			</div>
		</div>
	</div>
	<?php }?>
</div>
