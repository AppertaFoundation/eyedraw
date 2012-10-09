<!-- Uncomment following line to re-enable doodle hover tooltips once layer bug is fixed (OE-1583) -->
<!-- <span id="canvasTooltip"></span> -->
<div data-side="<?php echo $side?>">
	<input type="hidden" id="<?php echo $inputId?>" name="<?php echo $inputName?>" value='<?php echo $this->model[$this->attribute]?>' />
	<?php if ($isEditable && $toolbar) {?>
		<div style="float: left">
			<div class="ed_toolbar">
				<button class="ed_img_button" disabled="disabled" id="moveToFront<?php echo $idSuffix?>" title="Move to front" onclick="<?php echo $drawingName?>.moveToFront(); return false;">
					<img src="<?php echo $imgPath?>moveToFront.gif" />
				</button>
				<button class="ed_img_button" disabled="disabled" id="moveToBack<?php echo $idSuffix?>" title="Move to back" onclick="<?php echo $drawingName?>.moveToBack(); return false;">
					<img src="<?php echo $imgPath?>moveToBack.gif" />
				</button>
				<button class="ed_img_button" disabled="disabled" id="deleteDoodle<?php echo $idSuffix?>" title="Delete" onclick="<?php echo $drawingName?>.deleteDoodle(); return false;">
					<img src="<?php echo $imgPath?>deleteDoodle.gif" />
				</button>
				<button class="ed_img_button" disabled="disabled" id="lock<?php echo $idSuffix?>" title="Lock" onclick="<?php echo $drawingName?>.lock(); return false;">
					<img src="<?php echo $imgPath?>lock.gif" />
				</button>
				<button class="ed_img_button" id="unlock<?php echo $idSuffix?>" title="Unlock" onclick="<?php echo $drawingName?>.unlock(); return false;">
					<img src="<?php echo $imgPath?>unlock.gif" />
				</button>
			</div>
			<div class="ed_toolbar">
				<?php foreach ($doodleToolBarArray as $i => $item) {?>
					<button class="ed_img_button" id="<?php echo $item['classname'].$idSuffix?>" title="<?php echo $item['title']?>" onclick="<?php echo $drawingName?>.addDoodle('<?php echo $item['classname']?>'); return false;">
						<img src="<?php echo $imgPath.$item['classname']?>.gif" />
					</button>
				<?php }?>
			</div>
		</div>
	<?php }?>
		<canvas id="<?php echo $canvasId?>" class="<?php if ($isEditable) { echo 'edit'; } else { echo 'display'; }?>" width="<?php echo $size?>" height="<?php echo $size?>" tabindex="1"<?php if ($canvasStyle) {?> style="<?php echo $canvasStyle?>"<?php }?>></canvas>
	<?php if ($isEditable) {?>
		<div class="eyedrawFields">
			<div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_pupil_id'); ?>
					:
				</div>
				<div class="data">
					<?php echo CHtml::activeDropDownList($model, $side.'_pupil_id', CHtml::listData(OphCiExamination_AnteriorSegment_Pupil::model()->findAll(array('order'=>'display_order')),'id','name'))?>
				</div>
			</div>
			<div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_nuclear_id'); ?>
					:
				</div>
				<div class="data">
					<?php echo CHtml::activeDropDownList($model, $side.'_nuclear_id', CHtml::listData(OphCiExamination_AnteriorSegment_Nuclear::model()->findAll(array('order'=>'display_order')),'id','name'))?>
				</div>
			</div>
			<div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_cortical_id'); ?>
					:
				</div>
				<div class="data">
					<?php echo CHtml::activeDropDownList($model, $side.'_cortical_id', CHtml::listData(OphCiExamination_AnteriorSegment_Cortical::model()->findAll(array('order'=>'display_order')),'id','name'))?>
				</div>
			</div>
			<div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_description'); ?>
					:
				</div>
				<div class="data">
					<?php echo CHtml::activeTextArea($model, $side.'_description', array('rows' => "2", 'cols' => "20", 'class' => 'autosize')) ?>
				</div>
			</div>
			<div>
				<div class="data">
					<?php echo CHtml::activeCheckBox($model, $side.'_pxe') ?>
				</div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_pxe'); ?>
				</div>
			</div>
			<div>
				<div class="data">
					<?php echo CHtml::activeCheckBox($model, $side.'_phako') ?>
				</div>
				<div class="label">
					<?php echo $model->getAttributeLabel($side.'_phako'); ?>
				</div>
			</div>
			<button class="ed_report">Report</button>
			<button class="ed_clear">Clear</button>
		</div>
	<?php }else{?>
		<div class="eyedrawFields view">
			<div>
				<div class="data">
					<?php echo $model->{$side.'_description'} ?>
				</div>
			</div>
			<div>
				<div class="data">
					<?php echo $model->getAttributeLabel($side.'_pupil_id') ?>
					:
					<?php echo $model->{$side.'_pupil'}->name ?>
				</div>
			</div>
			<div>
				<div class="data">
					<?php echo $model->getAttributeLabel($side.'_nuclear_id') ?>
					:
					<?php echo $model->{$side.'_nuclear'}->name ?>
				</div>
			</div>
			<div>
				<div class="data">
					<?php echo $model->getAttributeLabel($side.'_cortical_id') ?>
					:
					<?php echo $model->{$side.'_cortical'}->name ?>
				</div>
			</div>
			<?php if($model->{$side.'_pxe'}) { ?>
			<div>
				<div class="data">
					<?php echo $model->getAttributeLabel($side.'_pxe') ?>
				</div>
			</div>
			<?php } ?>
			<?php if($model->{$side.'_phako'}) { ?>
			<div>
				<div class="data">
					<?php echo $model->getAttributeLabel($side.'_phako') ?>
				</div>
			</div>
			<?php } ?>
		</div>
	<?php }?>
</div>
