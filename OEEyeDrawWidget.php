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

/**
 * EyeDraw widget for the Yii framework
 * This widget inserts a canvas element into a view, and registers all required javascript and css files.
 * - When in edit mode, toolbars are displayed with control buttons and the doodle buttons specified in the optional 'doodleToolBarArray'.
 * - Data is stored and loaded from a hidden input element the name of which corresponds to the attribute of the data model
 * - The attribute should be stored as a TEXT data type in the database
 * - If the input element is empty, a template can be produced by placing EyeDraw commands in the optional 'onReadyCommandArray.'
 *
 * Usage:
 * <code>
 * $this->widget('application.modules.eyedraw.OEEyeDrawWidget', array(
 *	'idSuffix'=> 'PS',
 *	'side'=>'R',
 *	'mode'=>'edit',
 *	'model'=>$model,
 *	'attribute'=>'eyeDraw1',
 *	'doodleToolBarArray'=>array('RRD', 'UTear'),
 *	'onReadyCommandArray'=>array(
 *		array('addDoodle', array('Fundus')),
 *		array('deselectDoodles', array()),
 *		),
 *	));
 * </code>
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 1.1
 */
class OEEyeDrawWidget extends CWidget
{
	/**
	 * The extra fields HTML string.
	 * @var string
	 */
	public $fields = null;

	/**
	 * Show the drawing controls panel?
	 * @var boolean
	 */
	public $showDrawingControls = true;

	/**
	 * Show the doodle popup panel?
	 * @var boolean
	 */
	public $showDoodlePopup = true;

	public $showDoodlePopupForDoodles = null;

	/**
	 * Maximum amount of toolbar buttons to display in a panel.
	 * @var integer Set to -1 to show all buttons.
	 */
	public $maxToolbarButtons = -1;

	/**
	 * Array of EyeDraw script files required (defaults to all available files)
	 * @todo Search model attribute and contents of doodleToolBarArray to determine subset of files to register
	 * @var array
	 */
	public $scriptArray = array();

	/**
	 * View file for rendering the eyeDraw
	 * @var string
	 */
	public $template = 'OEEyeDrawWidget';

	/**
	 * Unique identifier for the drawing on the current page
	 * @var string
	 */
	public $idSuffix = 'EDI';

	/**
	 * Side (R or L)
	 * @var string
	 */
	public $side = 'R';

	/**
	 * Mode ('edit' or 'view')
	 * @var string
	 */
	public $mode = 'edit';

	/**
	 * Width of canvas element in pixels
	 * @var int
	 */
	public $width = 300;

	/**
	 * Height of canvas element in pixels
	 * @var int
	 */
	public $height = 300;

	/**
	 * Global scale factor
	 * @var int
	 */
	public $scale = 1;

	/**
	 * Toggle scale factor. Set to 0 to disable zooming.
	 * @var  int
	 */
	public $toggleScale = 0;

	/**
	 * The model possessing an attribute to store JSON data
	 * @var CActiveRecord
	 */
	public $model;

	/**
	 * Name of the attribute
	 * @var string
	 */
	public $attribute;

	/**
	 * Array of doodles to appear in doodle selection toolbar
	 * or
	 * Array of array of doodles to appear in multiple rows in doodle selection toolbar
	 * @var array
	 */
	public $doodleToolBarArray = array();

	/**
	 * Array of doodles with properties to display
	 *
	 * @var array
	 */
	public $displayParameterArray = array();

	/**
	 * Array of commands to apply to the drawing object once images have loaded
	 * @var array
	 */
	public $onReadyCommandArray = array();

	/**
	 * Array of commands to apply to the drawing object once doodles have been loaded from a saved JSON string
	 * @var array
	 */
	public $onDoodlesLoadedCommandArray = array();

	/**
	 * Array of bindings to apply to doodles, applied after onLoaded commands
	 * @var array
	 */
	public $bindingArray = array();

	/**
	 * Array of delete values to apply to doodles, applied after bindings commands
	 * @var array
	 */
	public $deleteValueArray = array();

	/**
	 * Array of syncs to apply to doodles, applied after bindings commands
	 * @var array
	 */
	public $syncArray = array();

	/*
	 * Array of javascript objects to be used as listeners on the drawing
	 */
	public $listenerArray = array();

	/**
	 * Optional inline styling for the canvas element
	 * @var string
	 */
	public $canvasStyle;

	/**
	 * Whether to show the toolbar or not
	 * @var boolean
	 */
	public $toolbar = true;

	/**
	 * Whether to focus the canvas element after rendering it on the page
	 * @var boolean
	 */
	public $focus = false;

	/**
	 * x offset
	 * @var integer
	 */
	public $offsetX = 0;

	/**
	 * y offset
	 * @var integer
	 */
	public $offsetY = 0;

	/**
	 * Whether to convert the canvas to an image
	 * @var bool
	 */
	public $toImage = false;

	/**
	 * Automatically report on changes to the drawing
	 * 
	 * @var string
	 */
	public $autoReport = '';

	/**
	 * If autoReport is set, then this determines whether the controller will handle edits to the element containing
	 * the auto reported text.
	 * @var bool
	 */
	public $autoReportEditable = true;

	/**
	 * Whether the eyedraw should be rendered with a div wrapper
	 * @var boolean
	 */
	public $divWrapper = true;

	/**
	 * The side the popup should display from the eyedraw
	 *
	 * @var string left|right
	 */
	public $popupDisplaySide = 'right';

	/**
	 * Paths for the subdirectories for javascript, css and images
	 * @var string
	 */
	private $jsPath;
	private $cssPath;
	private $imgPath;

	/**
	 * Unique name for the EyeDraw drawing object ('ed_drawing_'.$mode.'_'.$idSuffix).
	 * For example, ed_drawing_edit_RPS
	 * @var string
	 */
	private $drawingName;

	/**
	 * Unique id of the canvas element
	 * @var string
	 */
	private $canvasId;

	/**
	 * Unique name for the input element containing EyeDraw data
	 * @var string
	 */
	private $inputName;

	/**
	 * Unique id for the input element containing EyeDraw data
	 * @var string
	 */
	private $inputId;

	/**
	 * Represents the eye using the ED object enumeration (0 = right, 1 = left)
	 * @var int
	 */
	private $eye;

	/**
	 * Flag indicating whether drawing can be edited
	 * @var bool
	 */
	private $isEditable;

	/**
	 * Initializes the widget.
	 * This method registers all needed client scripts and renders the EyeDraw content
	 */
	public function init()
	{
		// Set values of paths
		$this->cssPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.assets.css'), false, -1);
		$this->jsPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.assets.js.dist'), false, -1);
		$this->imgPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.assets.img'), false, -1).'/';

		// Create a unique and descriptive variable name for the drawing object and the corresponding canvas element
		$this->drawingName = 'ed_drawing_'.$this->mode.'_'.$this->idSuffix;
		$this->canvasId = 'ed_canvas_'.$this->mode.'_'.$this->idSuffix;

		// Create matching name and id in 'Yii' format for loading and saving using POST
		if (isset($this->model) && isset($this->attribute)) {
			if ($this->mode == 'edit') {
				$this->inputName = CHtml::modelName($this->model).'['. $this->attribute.']';
				$this->inputId = CHtml::modelName($this->model).'_'. $this->attribute;
			} else {
				$this->inputId = 'ed_input_'.$this->mode.'_'.$this->idSuffix;
			}

			if (isset($_POST[CHtml::modelName($this->model)][$this->attribute])) {
				$this->model->{$this->attribute} = $_POST[CHtml::modelName($this->model)][$this->attribute];
			}
		}

		// Set the drawing scale level, from the scaleLevel saved in the doodle, only
		// if the toggleScale prop is set.
		if (isset($this->model) && isset($this->attribute) && $this->toggleScale) {

			$data = json_decode($this->model[$this->attribute]);

			// Get the saved scale level from the first doodle
			if (count($data)) {
				$doodle = $data[0];
				$scale = isset($doodle->scaleLevel) ? $doodle->scaleLevel : $this->scale;
				// Switch the toggleScale value if the saved scale matches the toggleScale
				if ($scale === $this->toggleScale) {
					$this->toggleScale = $this->scale;
				}
				$this->scale = $scale;
			}
		}

		// Numeric flag corresponding to EyeDraw ED.eye  ***TODO*** may require additional options
		$this->eye = $this->side == "R"?0:1;

		// Flag indicating whether the drawing is editable or not (normally corresponded to edit and view mode)
		$this->isEditable = $this->mode == 'edit'?true:false;

		if (sizeof($this->doodleToolBarArray) > 0) {
			// check if need to convert into one row array to have all buttons in one row
			if (!is_array($this->doodleToolBarArray[0])) {
				$this->doodleToolBarArray = array($this->doodleToolBarArray);
			}
			// Add 'Label' doodle to the last set of doodles
			$arr = &$this->doodleToolBarArray[count($this->doodleToolBarArray)-1];
			array_push($arr, 'Label');
		}

		// Iterate through any button array
		$finalToolBar = array();
		foreach ($this->doodleToolBarArray as $row => $rowButtons) {
			$finalToolBar[] = array();
			foreach ($rowButtons as $i => $doodleClassName) {
				// Get title attribute from language specific array
				if (array_key_exists($doodleClassName, DoodleInfo::$titles)) {
					$title = DoodleInfo::$titles[$doodleClassName];
				} else {
					$title = DoodleInfo::$titles['NONE'];
				}
				$finalToolBar[$row][$i] = array(
					'title' => $title,
					'classname' => $doodleClassName
				);
			}
		}
		$this->doodleToolBarArray = $finalToolBar;

		// As the view might use partials, and there's no way to define global view vars,
		// we store a reference to the data array, so we can pass-through to the partials.
		$data = get_object_vars($this);
		$data['data'] = $data;

		if (!property_exists($this->model, 'event') || !$this->model->event || !$this->model->event->hasEventImage($this->drawingName)) {
			// Register package (dependent scripts and stylesheets)
			Yii::app()->clientScript->registerPackage('eyedraw');

			// Register inline scripts
			$this->registerScripts();
		} else {
			$data['data']['imageUrl'] = Yii::app()->baseUrl."/".Yii::app()->getController()->module->id."/default/eventImage?event_id=".$this->model->event->id."&image_name=".$this->drawingName;
		}

		// Render the widget
		$this->render($this->template, $data);
	}

	/**
	 * Runs after init and can be used to capture content
	 */
	public function run()
	{
	}

	/**
	 * Registers the JavaScript used to init the eyedraw editor.
	 */
	protected function registerScripts()
	{
		$cs = Yii::app()->clientScript;

		// Set the eyedraw doodle titles.
		$titles = CJavaScript::encode(DoodleInfo::$titles);
		$cs->registerScript('eyedraw_titles', "ED.setTitles({$titles});", CClientScript::POS_END);

		// Create array of parameters to pass to the javascript function which runs on page load
		$properties = array(
			'drawingName'=>$this->drawingName,
			'canvasId'=>$this->canvasId,
			'eye'=>$this->eye,
			'scale'=>$this->scale,
			'toggleScale'=>$this->toggleScale,
			'idSuffix'=>$this->idSuffix,
			'isEditable'=>$this->isEditable,
			'focus'=>$this->focus,
			'graphicsPath'=>$this->imgPath,
			'inputId'=>$this->inputId,
			'onReadyCommandArray'=>$this->onReadyCommandArray,
			'onDoodlesLoadedCommandArray'=>$this->onDoodlesLoadedCommandArray,
			'bindingArray'=>$this->bindingArray,
			'deleteValueArray'=>$this->deleteValueArray,
			'syncArray'=>$this->syncArray,
			'listenerArray'=>array(),
			'offsetX'=>$this->offsetX,
			'offsetY'=>$this->offsetY,
			'toImage'=>$this->toImage,
			'autoReport'=>$this->autoReport,
			'autoReportEditable' => $this->autoReportEditable,
			'showDoodlePopupForDoodles' => $this->showDoodlePopupForDoodles
		);
		// need to escape the listener names so that they are not treated as string vars in javascript
		foreach ($this->listenerArray as $listener) {
			$properties['listenerArray'][] = "js:" . $listener;
		}

		// Encode parameters and pass to a javascript function to set up canvas
		$properties = CJavaScript::encode($properties);
		$cs->registerScript('scr_'.$this->canvasId, "ED.init($properties);", CClientScript::POS_READY);
	}

	public function getDrawingName()
	{
		return $this->drawingName;
	}
}
