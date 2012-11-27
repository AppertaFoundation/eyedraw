/**
 * @fileOverview Contains doodle subclasses for the anterior segment
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.9
 *
 * Modification date: 15th June 2012
 * Copyright 2012 OpenEyes
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
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Language specific tooltips which appear over doodles on hover
 *
 * In order to display UTF.8 characters, this file should be loaded with the 'charset="utf-8"' attribute.
 * This currently cannot be done with the Yii registerScriptFile method, so should be loaded using a tag in the view file;
 * <script language="JavaScript" src="js/ED_Tooltips.js" type="text/javascript" charset="utf-8"></script>
 */
ED.trans = new Object();

// For UTF.8, this file should be loaded with the 'charset="utf-8"' attribute. This currently cannot be done with the Yii registerScriptFile method
ED.trans['ACIOL'] = 'Anterior chamber IOL<br/><br/>Drag the outer handle to rotate<br/>Drag the inner handle to resize<br/>Drag the IOL itself to move';
ED.trans['AntSeg'] = 'Anterior segment<br/><br/>Drag the handle to resize the pupil<br/><br/>The iris is semi-transparent so that IOLs, and<br/>other structures can be seen behind it';
ED.trans['AntSegCrossSection'] = '';
ED.trans['BlotHaemorrhage'] = 'Blot haemorrhage<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['CapsularTensionRing'] = 'Capsular Tension Ring<br/><br/>This cannot be selected directly since it is behind the iris<br/>Select the iris first<br/>Then move the scroll wheel until the ring is selected<br/>Click the \'Move to front\' button<br/>Err.. of course if you are seeing this tooltip you have already done it';
ED.trans['Circinate'] = 'Circinate (Ring of exudates)<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CNV'] = 'Choroidal neovascular membrane<br/><br/>Drag to move<br/>Drag handle to scale';
ED.trans['CorneaCrossSection'] = 'Corneal cross section';
ED.trans['CornealSuture'] = 'Corneal suture<br/><br/>Drag to move';
ED.trans['CorticalCataract'] = '';
ED.trans['CottonWoolSpot'] = 'Cotton wool spot<br/><br/>Drag to position<br/>Drag handle to change shape and size';
ED.trans['CystoidMacularOedema'] = 'Cystoid macular oedema<br/><br/>Drag handle to change size';
ED.trans['DiabeticNV'] = 'Diabetic new vessels<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['DiskHaemorrhage'] = '';
ED.trans['EpiretinalMembrane'] = 'Epiretinal membrane<br/><br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FibrousProliferation'] = 'Fibrous Proliferation<br/><br/>Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FocalLaser'] = 'Focal laser burns<br/><br/>Drag the handle for a bigger area with more burns';
ED.trans['Fundus'] = '';
ED.trans['Geographic'] = 'Geographic Atrophy<br/><br/>Drag middle handle to alter size of remaining central island of RPE<br/>Drag outside handle to scale';
ED.trans['HardDrusen'] = 'Hard drusen<br/><br/>Drag middle handle up and down to alter density of drusen<br/>Drag outside handle to scale';
ED.trans['HardExudate'] = 'Hard exudate<br/><br/>Drag to position';
ED.trans['IrisHook'] = 'Iris hook<br/><br/>Drag to move around the clock<br/><br/>The hook will match the size of the pupil<br/>as the pupil size is altered<br/><br/>Subsequent hooks are added to the next<br/>quadrant going round clockwise';
ED.trans['LaserCircle'] = 'A circle of laser spots<br/><br/>Drag handle to change shape';
ED.trans['LaserDemarcation'] = 'A row of laser spots for demarcation<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move line more posteriorly';
ED.trans['LaserSpot'] = 'A single laser spot<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['LensCrossSection'] = '';
ED.trans['LimbalRelaxingIncision'] = 'Limbal relaxing incision<br/><br/>Drag to move';
ED.trans['MacularGrid'] = 'Macular grid<br/><br/>Drag the handle to scale';
ED.trans['MacularHole'] = 'Macular hole<br/><br/>Drag the handle to scale';
ED.trans['MattressSuture'] = 'Mattress suture<br/><br/>Drag to move';
ED.trans['Microaneurysm'] = 'Microaneurysm<br/><br/>Drag to position';
ED.trans['NerveFibreDefect'] = '';
ED.trans['OpticDisk'] = '';
ED.trans['PCIOL'] = 'Posterior chamber IOL<br/><br/>Drag the outer handle to rotate<br/>Drag the inner handle to resize<br/>Drag the IOL itself to move';
ED.trans['PeripapillaryAtrophy'] = '';
ED.trans['PeripheralRRD'] = 'Peripheral retinal detachment<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PhakoIncision'] = 'Phako incision<br/><br/>Drag the end handle to length<br/>Drag the middle handle to change section type<br/>Drag the incision itself to move';
ED.trans['PI'] = 'Iridectomía periférica';
ED.trans['PostPole'] = 'Posterior pole<br/><br/>The disk cup can be edited by clicking on the disk, and dragging the yellow handle<br/>The gray circle marks one disk diameter from the fovea';
ED.trans['PreRetinalHaemorrhage'] = 'Preretinal haemorrhage<br/><br/>Drag to position<br/>Drag handles to change shape and size';
ED.trans['PRPPostPole'] = 'Pan-retinal photocoagulation';
ED.trans['RoundHole'] = '';
ED.trans['RRD'] = '';
ED.trans['SectorPRP'] = 'A sector of panretinal photocoagulation<br/><br/>Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['SidePort'] = 'Side port<br/><br/>Drag to move';
ED.trans['Surgeon'] = '';
ED.trans['UTear'] = '';
ED.trans['VitreousOpacity'] = 'Vitreous Opacity<br/><br/>Drag to move<br/>Drag the inner handle up and down to alter opacity<br/>Drag the outer handle to scale';
