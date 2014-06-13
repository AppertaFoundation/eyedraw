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

<?php if ($isEditable && count($doodleToolBarArray) > 0) {?>
	<div class="ed-toolbar">
		<?php foreach ($doodleToolBarArray as $row => $rowItems) { ?>
			<ul class="ed-toolbar-panel ed-main-toolbar">
				<?php
					$mainItems = $maxToolbarButtons > -1 ? array_slice($rowItems, 0, $maxToolbarButtons) : $rowItems;
					$extraItems = $maxToolbarButtons > -1 ? array_slice($rowItems, $maxToolbarButtons) : array();
				?>
				<?php foreach($mainItems as $item) {?>
					<li id="<?php echo $item['classname'].$idSuffix ?>">
						<a class="ed-button" href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
							<span class="icon-ed-<?php echo $item['classname'];?>"></span>
							<span class="label"><?php echo $item['title'] ?></span>
						</a>
					</li>
				<?php } ?>
				<?php if (count($extraItems)) {?>
					<li>
						<a class="ed-button ed-button-more" href="#">
							<span class="icon-ed-More"></span>
							<span class="label">More</span>
						</a>
						<ul class="ed-toolbar-panel-drawer">
							<?php foreach($extraItems as $item) {?>
								<li id="<?php echo $item['classname'].$idSuffix ?>">
									<a class="ed-button" href="#" data-function="addDoodle" data-arg="<?php echo $item['classname'] ?>">
										<span class="icon-ed-<?php echo $item['classname'];?>"></span>
										<span class="label"><?php echo $item['title'] ?></span>
									</a>
								</li>
							<?php }?>
						</ul>
					</li>
				<?php } ?>
			</ul>
		<?php } ?>
	</div>
<?php } ?>
