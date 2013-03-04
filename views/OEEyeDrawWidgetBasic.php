<?php if($divWrapper) {?><div class="EyeDrawWidget"><?php } ?>
	<?php if ($isEditable && $toolbar) {?>
		<div class="ed_toolbar">
			<button class="ed_img_button" disabled='disabled' id="moveToFront<?php echo $idSuffix?>" title="Move to front" onclick="<?php echo $drawingName?>.moveToFront(); return false;">
				<img src="<?php echo $imgPath?>moveToFront.gif" />
			</button>
			<button class="ed_img_button" disabled='disabled' id="moveToBack<?php echo $idSuffix?>" title="Move to back" onclick="<?php echo $drawingName?>.moveToBack(); return false;">
				<img src="<?php echo $imgPath?>moveToBack.gif" />
			</button>
			<button class="ed_img_button" disabled='disabled' id="deleteSelectedDoodle<?php echo $idSuffix?>" title="Delete" onclick="<?php echo $drawingName?>.deleteSelectedDoodle(); return false;">
				<img src="<?php echo $imgPath?>deleteSelectedDoodle.gif" />
			</button>
			<button class="ed_img_button" disabled='disabled' id="lock<?php echo $idSuffix?>" title="Lock" onclick="<?php echo $drawingName?>.lock(); return false;">
				<img src="<?php echo $imgPath?>lock.gif" />
			</button>
			<button class="ed_img_button" id="unlock<?php echo $idSuffix?>" title="Unlock" onclick="<?php echo $drawingName?>.unlock(); return false;">
				<img src="<?php echo $imgPath?>unlock.gif" />
			</button>
            <button class="ed_img_button" id="Label<?php echo $idSuffix?>" title="Label" onclick="<?php echo $drawingName?>.addDoodle('Label'); <?php echo $drawingName?>.canvas.focus(); return false;">
                <img src="<?php echo $imgPath?>Label.gif" />
            </button>

            <?php
                foreach ($displayParameterArray as $doodleClass => $parameterArray)
                {
                    $parameter = $parameterArray['parameter'];
                    $label = $parameterArray['label'];
                ?>
            <label class="displayParameterLabel" style="display:inline;" ><input class="displayParameterElement" type="checkbox" id="<?php echo $parameter.$doodleClass.$idSuffix;?>" onchange="<?php echo $drawingName;?>.setSelectedDoodle(this, '<?php echo $parameter;?>');return false;" ><?php echo $label;?></label>
            <?php }?>

		</div>
	<?php }?>
    <?php if ($isEditable && count($doodleToolBarArray) > 0) {
    	foreach ($doodleToolBarArray as $row => $rowItems) {
    	?>
    
			<div id="<?php echo $canvasId.'doodleToolbar' . $row ?>" class="ed_toolbar">
				<?php foreach ($rowItems as $item) {?>
					<button class="ed_img_button" id="<?php echo $item['classname'].$idSuffix?>" title="<?php echo $item['title']?>" onclick="<?php echo $drawingName?>.addDoodle('<?php echo $item['classname']?>'); return false;">
						<img src="<?php echo $imgPath.$item['classname']?>.gif" />
					</button>
				<?php }?>
			</div>
			
	<?php }
	}
	?>
    <span class="canvasTooltip" id="<?php echo $canvasId.'Tooltip'?>"></span>
	<canvas id="<?php echo $canvasId?>" class="<?php if ($isEditable) { echo 'ed_canvas_edit'; } else { echo 'ed_canvas_display'; }?>" width="<?php echo $width?>" height="<?php echo $height?>" tabindex="1" data-drawing-name="<?php echo $drawingName ?>"<?php if ($canvasStyle) {?> style="<?php echo $canvasStyle?>"<?php }?>></canvas>
	<?php if($inputId) { ?>
	<input type="hidden" id="<?php echo $inputId?>" name="<?php echo $inputName?>" value='<?php echo $this->model[$this->attribute]?>' />
	<?php } ?>
<?php if($divWrapper) {?></div><?php } ?>
	
