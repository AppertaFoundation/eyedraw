<?php
/**
 * Contains a Yii widget for EyeDraw
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 1.0
 * @link http://www.openeyes.org.uk/
 * @copyright Copyright (c) 2012 OpenEyes Foundation
 * @license http://www.yiiframework.com/license/
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
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
	 * Array of EyeDraw script files required (defaults to all available files)
	 * @todo Search model attribute and contents of doodleToolBarArray to determine subset of files to register
	 * @var array
	 */
    public $scriptArray = array();
    
    /**
    * View file for rendering the eyeDraw
    * @var string
    */
    public $template = 'OEEyeDrawWidgetBasic';

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
	 * Whether the eyedraw should be rendered with a div wrapper
	 * @var boolean
	 */
	public $divWrapper = true;
    
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
        $this->cssPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw2.css'), false, -1, YII_DEBUG);
        $this->jsPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw2.js'), false, -1, YII_DEBUG);
        $this->imgPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw2.graphics'), false, -1, YII_DEBUG).'/';
        
        // If script array is empty, just load all the ED_.js files (with exception of two mandatory files)
        if (empty($this->scriptArray))
        {
            foreach (new DirectoryIterator(Yii::app()->getAssetManager()->basePath."/".basename($this->jsPath)) as $file)
            {
                if ($file->isFile() === TRUE && $file->getFilename() !== 'ED_Drawing.js' && $file->getBasename() !== 'OEEyeDraw.js')
                {
                    if (pathinfo($file->getFilename(), PATHINFO_EXTENSION) == "js")
                    {
                        array_push ($this->scriptArray, $file->getFilename());
                    }
                }
            }
        }

        // Create a unique and descriptive variable name for the drawing object and the corresponding canvas element
        $this->drawingName = 'ed_drawing_'.$this->mode.'_'.$this->idSuffix;
        $this->canvasId = 'ed_canvas_'.$this->mode.'_'.$this->idSuffix;
        
        // Create matching name and id in 'Yii' format for loading and saving using POST
        if (isset($this->model) && isset($this->attribute))
        {
            $this->inputName = get_class($this->model).'['. $this->attribute.']';
            $this->inputId = get_class($this->model).'_'. $this->attribute;

            if (isset($_POST[get_class($this->model)][$this->attribute]))
            {
                $this->model->{$this->attribute} = $_POST[get_class($this->model)][$this->attribute];
            }
        }

        // Numeric flag corresponding to EyeDraw ED.eye  ***TODO*** may require additional options
        $this->eye = $this->side == "R"?0:1;
        
        // Flag indicating whether the drawing is editable or not (normally corresponded to edit and view mode)
        $this->isEditable = $this->mode == 'edit'?true:false;

        // Register the chosen scripts and CSS files
        $this->registerScripts();
        $this->registerCss();

        if (sizeof($this->doodleToolBarArray) > 0) {
        	// check if need to convert into one row array to have all buttons in one row
        	if (!is_array($this->doodleToolBarArray[0])) {
        		$this->doodleToolBarArray = array($this->doodleToolBarArray);
        	}
        }
        
        // Iterate through any button array
        $finalToolBar = array(); 
        foreach ($this->doodleToolBarArray as $row => $rowButtons) {
        	$finalToolBar[] = array();
	        foreach($rowButtons as $i => $doodleClassName)
	        {
	            // Get title attribute from language specific array
	            if (array_key_exists($doodleClassName, DoodleInfo::$titles))
	            {
	                $title = DoodleInfo::$titles[$doodleClassName];
	            }
	            else
	            {
	                $title = DoodleInfo::$titles['NONE'];
	            }
	            $finalToolBar[$row][$i] = array(
	                'title' => $title,
	                'classname' => $doodleClassName
	            );
	        }
        }
        $this->doodleToolBarArray = $finalToolBar;
        // Render the widget
        $this->render($this->template, get_object_vars($this));
	}

	/**
	 * Runs after init and can be used to capture content
	 */
	public function run()
	{		
	}

	/**
	 * Registers all necessary javascript files
	 */			
	protected function registerScripts()
	{
        // Get client script object
		$cs = Yii::app()->getClientScript();
 
        // Register the EyeDraw mandatory scripts
		$cs->registerScriptFile($this->jsPath.'/OEEyeDraw.js', CClientScript::POS_HEAD);
		$cs->registerScriptFile($this->jsPath.'/ED_Drawing.js', CClientScript::POS_HEAD);
        
        // For languages that require utf8, use the following line in the view file (***TODO*** should be possible using Yii function)
        // <script language="JavaScript" src="js/ED_Tooltips.js" type="text/javascript" charset="utf-8"></script>
		$cs->registerScriptFile($this->jsPath.'/ED_Tooltips.js', CClientScript::POS_HEAD);
        $cs->registerScriptFile($this->jsPath.'/ED_General.js', CClientScript::POS_HEAD);
        
        // Register the specified optional sub-specialty scripts
        for ($i = 0; $i < count($this->scriptArray); $i++)
        {
            $cs->registerScriptFile($this->jsPath.'/'.$this->scriptArray[$i], CClientScript::POS_HEAD);
        }

		// Create array of parameters to pass to the javascript function which runs on page load
		$properties = array(
            'drawingName'=>$this->drawingName,
            'canvasId'=>$this->canvasId,
            'eye'=>$this->eye,
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
		);
		// need to escape the listener names so that they are not treated as string vars in javascript
		foreach ($this->listenerArray as $listener) {
			$properties['listenerArray'][] = "js:" . $listener;
		}
		
		// Encode parameters and pass to a javascript function to set up canvas
		$properties = CJavaScript::encode($properties);
		$cs->registerScript('scr_'.$this->canvasId, "eyeDrawInit($properties)", CClientScript::POS_READY);
	}

	/**
	 * Registers all necessary css files
	 */	
    protected function registerCss()
    {
        $cssFile = $this->cssPath.'/OEEyeDraw.css';
        Yii::app()->getClientScript()->registerCssFile($cssFile);				 
    }
    
    public function getDrawingName()
    {
    	return $this->drawingName;
    }
}

/**
 * Language specific doodle descriptions (used for title attributes of doodle toolbar buttons)
 * 
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 0.9
 */
class DoodleInfo
{
	/**
	 * @static array
	 */
	public static $titles = array (
        "NONE" => "No description available for this doodle",
        "ACIOL" => "Anterior chamber IOL",
        "AdnexalEye" => "Adnexal eye template",
        "Ahmed" => "Ahmed tube",
        "AngleGrade" => "Angle grade",
        "AngleNV" => "Angle new vessels",
        "AngleRecession" => "Angle recession",
        "AntPVR" => "Anterior PVR",
        "AntSeg" => "Anterior segment",
        "AntSynech" => "Anterior synechiae",
        "APattern" => "A pattern",
        "Arrow" => "Arrow",
        "Baerveldt" => "Baerveld tube",
        "Bleb" => "Trabeculectomy bleb",
        "BlotHaemorrhage" => "Blot haemorrhage",
        "Buckle" => "Buckle",
        "BuckleOperation" => "Buckle operation",
        "BuckleSuture" => "Buckle suture",
        "CapsularTensionRing" => "Capsular Tension Ring",                                   
        "Circinate" => "Circinate retinopathy",
        "CircumferentialBuckle" => "Circumferential buckle",
        "CNV" => "Choroidal new vessels",
        "CornealScar" => "Corneal scar",
        "CornealSuture" => "Corneal suture",
        "CorticalCataract" => "Cortical cataract",
        "CottonWoolSpot" => "Cotton wool spot",
        "Cryo" => "Cryotherapy scar",
        "CystoidMacularOedema" => "Cystoid macular oedema",
        "DiabeticNV" => "Diabetic new vessels",
        "Dialysis" => "Dialysis",
        "DiscHaemorrhage" => "Disc haemorrhage",
        "DrainageSite" => "Drainage site",
        "EncirclingBand" => "Encircling band",
        "EpiretinalMembrane" => "Epiretinal membrane",
        "FibrousProliferation" => "Fibrous proliferation",
        "FocalLaser" => "Focal laser",
        "Freehand" => "Freehand drawing",
        "Fuchs" => "Fuchs endothelial dystrophy",
        "Fundus" => "Fundus",
        "Geographic" => "Geographic atrophy",
        "Gonioscopy" => "Gonioscopy",
        "GRT" => "Giant retinal tear",
        "HardDrusen" => "Hard drusen",
        "HardExudate" => "Hard exudate",
        "InnerLeafBreak" => "Inner leaf break",
        "Iris" => "Iris",
        "IrisHook" => "Iris hook",
        "IRMA" => "Intraretinal microvascular abnormalities",
        "KeraticPrecipitates" => "Keratic precipitates",
        "KrukenbergSpindle" => "Krukenberg spindle",
        "Label" => "Label",
        "LaserCircle" => "Circle of laser photocoagulation",
        "LasikFlap" => "LASIK flap",
        "LaserSpot" => "Laser spot",
        "Lattice" => "Lattice",
        "LimbalRelaxingIncision" => "Limbal relaxing incision",
        "MacularGrid" => "Macular grid laser",
        "MacularHole" => "Macular hole",
        "MacularThickening" => "Macular thickening",
        "MattressSuture" => "Mattress suture",
        "Microaneurysm" => "Microaneurysm",
        "Molteno" => "Molteno tube",
        "NerveFibreDefect" => "Nerve fibre derect",
        "NuclearCataract" => "Nuclear cataract",
        "OpticCup" => "Optic cup",
        "OpticDisc" => "Optic disc",
        "OpticDiscPit" => "Optic disc pit",
        "OrthopticEye" => "Orthoptic eye",
        "OuterLeafBreak" => "Outer leaf break",
        "Papilloedema" => "Papilloedema",
        "Patch" => "Tube patch",
        "PCIOL" => "Posterior chamber IOL",
        "PeripapillaryAtrophy" => "Peripapillary atrophy",
        "PhakoIncision" => "Phako incision",
        "PI" => "Peripheral iridectomy",
        "PointInLine" => "Point in line",
        "PosteriorEmbryotoxon" => "Posterior embryotoxon",
        "PostPole" => "Posterior pole",
        "PostSubcapCataract" => "Posterior subcapsular cataract",
        "PreRetinalHaemorrhage" => "Pre-retinal haemorrhage",
        "PRP" => "Panretinal photocoagulation",
        "PRPPostPole" => "Panretinal photocoagulation (posterior pole)",
        "Pupil" => "Pupil",
        "RadialSponge" => "Radial sponge",
        "Retinoschisis" => "Retinoschisis",
        "RK" => "Radial keratotomy",
        "RoundHole" => "Round hole",
        "RRD" => "Rhegmatogenous retinal detachment",
        "SectorPRPPostPole" => "Sector PRP (posterior pole)",
        "Shading" => "Shading",
        "SidePort" => "Side port",
        "Slider" => "Slider",
        "StarFold" => "Star fold",
        "Supramid" => "Supramid suture",
        "ToricPCIOL" => "Toric posterior chamber IOL",
        "TractionRetinalDetachment" => "Traction retinal detachment",
        "TransilluminationDefect" =>"Transillumination defect",
        "UpDrift" => "Up drift",
        "UpShoot" => "Up shoot",
        "UTear" => "Traction ‘U’ tear",
        "Vicryl" => "Vicryl suture",
        "VitreousOpacity" => "Vitreous opacity",
        "VPattern" => "V pattern",
        "Crepitations" => "Crepitations",
        "Stenosis" => "Stenosis",
        "Wheeze" => "Wheeze",
        "Effusion" => "Pleural effusion",
        "LeftCoronaryArtery" => "Left coronary artery",
        "DrugStent" => "Drug eluting stent",
        "MetalStent" => "Metal stent",
        "Bypass" => "Coronary artery bypass",
        "Bruit" => "Bruit",
        "Bruising" => "Bruising",
        "Haematoma" => "Haematoma",
        );
}
