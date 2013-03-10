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
            <button class="ed_img_button" id="Freehand<?php echo $idSuffix?>" title="Freehand drawing" onclick="<?php echo $drawingName?>.addDoodle('Freehand'); <?php echo $drawingName?>.canvas.focus(); return false;">
            <img src="<?php echo $imgPath?>Freehand.gif" />
            </button>

            <span class= "squiggle" id="squiggleSpan<?php echo $idSuffix?>" style="display:none;">
                <img class="colourWell" border="0" src="<?php echo $imgPath?>ColourWell.gif" usemap="#colormap<?php echo $idSuffix?>" alt='colormap' />
                <map id="colormap<?php echo $idSuffix?>" name="colormap<?php echo $idSuffix?>">
                    <area style="cursor:pointer" shape="rect" coords="0,0,16,16" onclick="<?php echo $drawingName?>.setSquiggleColour('000000');" />
                    <area style="cursor:pointer" shape="rect" coords="16,0,32,16" onclick="<?php echo $drawingName?>.setSquiggleColour('FF0000');" />
                    <area style="cursor:pointer" shape="rect" coords="32,0,48,16" onclick="<?php echo $drawingName?>.setSquiggleColour('FF7F00');" />
                    <area style="cursor:pointer" shape="rect" coords="0,16,16,32" onclick="<?php echo $drawingName?>.setSquiggleColour('0000FF');" />
                    <area style="cursor:pointer" shape="rect" coords="16,16,32,32" onclick="<?php echo $drawingName?>.setSquiggleColour('00FF00');" />
                    <area style="cursor:pointer" shape="rect" coords="32,16,48,32" onclick="<?php echo $drawingName?>.setSquiggleColour('FFFF00');" />
                </map>
                <img class="drawingControl" border="0" src="<?php echo $imgPath?>DrawingControl.gif" usemap="#drawingControl<?php echo $idSuffix?>" alt='drawingcontrol' />
                <map id="drawingControl<?php echo $idSuffix?>" name="drawingControl<?php echo $idSuffix?>">
                    <area style="cursor:pointer" shape="rect" coords="0,0,16,16" onclick="<?php echo $drawingName?>.setSquiggleWidth(ED.squiggleWidth.Thin);" />
                    <area style="cursor:pointer" shape="rect" coords="16,0,32,16" onclick="<?php echo $drawingName?>.setSquiggleWidth(ED.squiggleWidth.Medium);" />
                    <area style="cursor:pointer" shape="rect" coords="32,0,48,16" onclick="<?php echo $drawingName?>.setSquiggleWidth(ED.squiggleWidth.Thick);" />
                    <area style="cursor:pointer" shape="rect" coords="0,16,24,32" onclick="<?php echo $drawingName?>.setSquiggleStyle(ED.squiggleStyle.Outline);" />
                    <area style="cursor:pointer" shape="rect" coords="24,16,48,32" onclick="<?php echo $drawingName?>.setSquiggleStyle(ED.squiggleStyle.Solid);" />
                </map>
                <canvas id="squiggleSettings<?php echo $idSuffix?>" width="24" height="32"></canvas>

            </span>

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
	
