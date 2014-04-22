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
        $this->cssPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.css'), false, -1);
        $this->jsPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.dist'), false, -1);
        $this->imgPath = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.eyedraw.img'), false, -1).'/';

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

        // Numeric flag corresponding to EyeDraw ED.eye  ***TODO*** may require additional options
        $this->eye = $this->side == "R"?0:1;

        // Flag indicating whether the drawing is editable or not (normally corresponded to edit and view mode)
        $this->isEditable = $this->mode == 'edit'?true:false;

        // jquery dependency
        $cs = Yii::app()->clientScript;
        $cs->registerCoreScript('jquery');

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

		$minified = (YII_DEBUG) ? '' : '.min';

		// Register the EyeDraw mandatory scripts
		$cs->registerScriptFile($this->jsPath.'/oe-eyedraw'.$minified.'.js', CClientScript::POS_HEAD);
    // For languages that require utf8, use the following line in the view file (***TODO*** should be possible using Yii function)
    // <script src="dist/eyedraw.js" type="text/javascript" charset="utf-8"></script>
		$cs->registerScriptFile($this->jsPath.'/eyedraw'.$minified.'.js', CClientScript::POS_HEAD);

		// Create array of parameters to pass to the javascript function which runs on page load
		$properties = array(
            'drawingName'=>$this->drawingName,
            'canvasId'=>$this->canvasId,
            'eye'=>$this->eye,
            'scale'=>$this->scale,
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
        $cssFile = $this->cssPath.'/oe-eyedraw.css';
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
        "ArcuateScotoma" => "Arcuate scotoma",
        "Arrow" => "Arrow",
        "Baerveldt" => "Baerveld tube",
        "BiopsySite" => "Biopsy site",
        "Bleb" => "Trabeculectomy bleb",
        "BlotHaemorrhage" => "Blot haemorrhage",
        "Buckle" => "Buckle",
        "BuckleOperation" => "Buckle operation",
        "BuckleSuture" => "Buckle suture",
        "BusaccaNodule" => "Busacca nodule",
        "CapsularTensionRing" => "Capsular Tension Ring",
        "ChandelierDouble" => "Double chandelier",
        "ChandelierSingle" => "Chandelier",
        "ChoroidalHaemorrhage" => "Choroidal haemorrhage",
        "ChoroidalNaevus" => "Choroidal naevus",
        "CiliaryInjection" => "Cilary injection",
        "Circinate" => "Circinate retinopathy",
        "CircumferentialBuckle" => "Circumferential buckle",
        "CNV" => "Choroidal new vessels",
        "ConjunctivalFlap" => "Conjunctival flap",
        "CornealAbrasion" => "Corneal abrasion",
        "CornealErosion" => "Removal of corneal epithelium",
        "CornealGraft" => "Corneal graft",
        "CornealOedema" => "Corneal oedema",
        "CornealScar" => "Corneal scar",
        "CornealStriae" => "Corneal striae",
        "CornealSuture" => "Corneal suture",
        "CorticalCataract" => "Cortical cataract",
        "CottonWoolSpot" => "Cotton wool spot",
        "Cryo" => "Cryotherapy scar",
        "CutterPI" => "Cutter iridectomy",
        "CystoidMacularOedema" => "Cystoid macular oedema",
        "DiabeticNV" => "Diabetic new vessels",
        "Dialysis" => "Dialysis",
        "DiscHaemorrhage" => "Disc haemorrhage",
        "DiscPallor" => "Disc pallor",
        "DrainageRetinotomy" => "Drainage retinotomy",
        "DrainageSite" => "Drainage site",
        "EncirclingBand" => "Encircling band",
        "EntrySiteBreak" => "Entry site break",
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
        "Hyphaema" => "Hyphaema",
        "Hypopyon" => "Hypopyon",
        "IatrogenicBreak" => "IatrogenicBreak",
        "ILMPeel" => "ILM peel",
        "InjectionSite" => "Injection site",
        "InnerLeafBreak" => "Inner leaf break",
        "Iris" => "Iris",
        "IrisHook" => "Iris hook",
        "IrisNaevus" => "Iris naevus",
        "IRMA" => "Intraretinal microvascular abnormalities",
        "KeraticPrecipitates" => "Keratic precipitates",
        "KoeppeNodule" => "Koeppe nodule",
        "KrukenbergSpindle" => "Krukenberg spindle",
        "Label" => "Label",
        "LaserCircle" => "Circle of laser photocoagulation",
        "LaserDemarcation" => "Laser demarcation",
        "LasikFlap" => "LASIK flap",
        "LaserSpot" => "Laser spot",
        "Lattice" => "Lattice",
        "Lens" => "Lens",
        "LimbalRelaxingIncision" => "Limbal relaxing incision",
        "Macroaneurysm" => "Macroaneurysm",
        "MacularDystrophy" => "Macular dystrophy",
        "MacularGrid" => "Macular grid laser",
        "MacularHole" => "Macular hole",
        "MacularThickening" => "Macular thickening",
        "MattressSuture" => "Mattress suture",
        "Microaneurysm" => "Microaneurysm",
        "Molteno" => "Molteno tube",
        "NerveFibreDefect" => "Nerve fibre defect",
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
        "PeripheralRetinectomy" => "Peripheral retinectomy",
        "PhakoIncision" => "Phako incision",
        "PI" => "Peripheral iridectomy",
        "PointInLine" => "Point in line",
        "PosteriorCapsule" => "Posterior capsule",
        "PosteriorEmbryotoxon" => "Posterior embryotoxon",
        "PostPole" => "Posterior pole",
        "PostSubcapCataract" => "Posterior subcapsular cataract",
        "PosteriorRetinectomy" => "Posterior retinectomy",
        "PosteriorSynechia" => "Posterior synechia",
        "PreRetinalHaemorrhage" => "Pre-retinal haemorrhage",
        "PRP" => "Panretinal photocoagulation",
        "PRPPostPole" => "Panretinal photocoagulation (posterior pole)",
        "Pupil" => "Pupil",
        "RadialSponge" => "Radial sponge",
        "RetinalArteryOcclusionPostPole" => "Retinal artery occlusion",
        "RetinalTouch" => "Retinal touch",
        "RetinalVeinOcclusionPostPole" => "Retinal vein occluson",
        "Retinoschisis" => "Retinoschisis",
        "RK" => "Radial keratotomy",
        "RoundHole" => "Round hole",
        "RPEDetachment" => "RPE detachment",
        "RPERip" => "RPE rip",
        "RRD" => "Rhegmatogenous retinal detachment",
        "Rubeosis" => "Rubeosis iridis",
        "SectorPRP" => "Sector PRP",
        "SectorPRPPostPole" => "Sector PRP (posterior pole)",
        "ScleralIncision" => "Scleral Incision",
        "Sclerostomy" => "Sclerostomy",
        "SectorIridectomy" => "Sector iridectomy",
        "Shading" => "Shading",
        "SidePort" => "Side port",
        "Slider" => "Slider",
        "StarFold" => "Star fold",
        "SubretinalFluid" => "Subretinal fluid",
        "SubretinalPFCL" => "Subretinal PFCL",
        "Supramid" => "Supramid suture",
        "SwollenDisc" => "Swollen disc",
        "Telangiectasis" => "Parafoveal telangiectasia",
        "Trabectome" => "Trabectome",
        "TrabyFlap" => "Trabeculectomy flap",
        "TrabySuture" => "Trabeculectomy suture",
        "ToricPCIOL" => "Toric posterior chamber IOL",
        "TractionRetinalDetachment" => "Traction retinal detachment",
        "TransilluminationDefect" =>"Transillumination defect",
        "UpDrift" => "Up drift",
        "UpShoot" => "Up shoot",
        "UTear" => "Traction ‘U’ tear",
        "Vicryl" => "Vicryl suture",
        "ViewObscured" => "View obscured",
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
