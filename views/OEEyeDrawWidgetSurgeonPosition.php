<div class="EyeDrawWidget">
	<canvas id="<?php echo $canvasId?>" class="<?php if ($isEditable) { echo 'edit'; } else { echo 'display'; }?>" width="<?php echo $width?>" height="<?php echo $height?>" tabindex="1"<?php if ($canvasStyle) {?> style="<?php echo $canvasStyle?>"<?php }?>></canvas>
	<input type="hidden" id="<?php echo $inputId?>" name="<?php echo $inputName?>" value='<?php echo $this->model[$this->attribute]?>' />
</div>
