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
<!-- *******  ED Inline Widget ******* -->
<div class="ed2-widget <?php echo ($isEditable) ? ' edit' : ' display';?>" id="eyedrawwidget_<?php echo $idSuffix ?>">
        <?php if ("toolbar") :?>
            <div class="ed2-toolbar"><?php $this->render('toolbar', $data);?></div>
        <?php endif; ?>

        <!-- Select Doodles -->
<!--		<div class="ed2-toolbar">-->
<!--			--><?php //if (@$data['imageUrl']) {?>
<!--				<img src="--><?php //echo $data['imageUrl']?><!--" height=--><?//=$height?><!-- width=--><?//=$width?><!-- />-->
<!--			--><?php //}else{?>
<!--            <div class="ed2-editor-wrap">-->
<!--				--><?php //$this->render('editor', $data);?>
<!--                --><?php //$this->render('fields', $data);?>
<!--            </div>-->
<!--			--><?php //}?>
<!--		</div>-->

        <div class="ed2-body">
            <!-- SELECTED DOODLE -->
            <?php if ($showDrawingControls && $mode !== 'view') {?>
                <div class="ed2-drawing-controls flex-layout<?= $toggleScale ? ' ed2-feature-zoom': '';?>">
                    <!-- DRAWING TOOLBAR -->
                    <ul class="ed2-toolbar-panel ed2-drawing-toolbar">
                        <li>
                            <a class="ed-button" href="#" data-function="resetEyedraw">
                                <i class="icon-ed-reset pad"></i>
                                <span class="label">reset pad</span>
                            </a>
                        </li>
                        <?php if ($toggleScale) {?>
                            <li>
                                <a class="ed-button" href="#" data-function="toggleZoom">
                                    <i class="icon-ed-zoom-out pad"></i>
                                    <span class="label">zoom-out pad</span>
                                </a>
                            </li>
                        <?php }?>
                    </ul>
                    <div class="ed2-selected-doodle">
                        <select class="ed2-selected-doodle-select cols-full" id="ed_example_selected_doodle">
                        </select>
                    </div>
                    <div class="ed2-search">
                        <input type="text" class="search" id="js-idg-demo-ed2-search-input">
                        <!-- note: this can be completely JS generated if you want -->
                        <ul class="oe-autocomplete" style="display: none;">
                            <li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li><li><a>No Evidence of Glaucoma</a></li>
                        </ul>
                    </div>

                </div>
                <div class="ed2-no-doodle-elements">
                    <ul class="no-doodles">
                        <li>No Evidence of Glaucoma<i class="oe-i remove-circle small-icon pad-left"></i></li>
                        <li>Glaucoma Suspect<i class="oe-i remove-circle small-icon pad-left"></i></li>
                        <li class="has-options">Has options (like a doodle)</li>
                    </ul>
                </div>
            <?php }?>
        </div>

</div>
