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

<?php if ($isEditable && count($doodleToolBarArray) > 0) {?>

		<?php foreach ($doodleToolBarArray as $row => $rowItems) { ?>
			<ul class="ed2-toolbar-panel ed2-main-toolbar">
				<?php
					$mainItems = $maxToolbarButtons > -1 ? array_slice($rowItems, 0, $maxToolbarButtons) : $rowItems;
					$extraItems = $maxToolbarButtons > -1 ? array_slice($rowItems, $maxToolbarButtons) : array();
				?>
				<?php foreach($mainItems as $item) {?>
<li id="<?php echo $item['classname'].$idSuffix ?>">
    <a class="ed-button" href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
        <i class="icon-ed-<?=$item['classname'];?>"></i>
        <span class="label"><?php echo $item['title'] ?></span>
    </a>
</li><?php } ?>
				<?php if (count($extraItems)) {?>
					<li>
                        <i class="oe-i more-h pad ed-button-more js-has-tooltip" data-tt-type="basic" data-tooltip-content="More doodles..."></i>

						<ul class="ed2-toolbar-panel-drawer">
							<?php foreach($extraItems as $item) {?>
<li id="<?php echo $item['classname'].$idSuffix ?>">
    <a class="ed-button" href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
        <i class="icon-ed-<?=$item['classname'];?>"></i>
        <span class="label"><?php echo $item['title'] ?></span>
    </a>
</li><?php }?>
	</ul>
					</li>
				<?php } ?>
			</ul>
		<?php } ?>

<?php } ?>
