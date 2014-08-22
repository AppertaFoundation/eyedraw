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
if (ED == null || typeof(ED) != "object") {
	var ED = new Object();
}

/**
 * Language specific translations. Mostly used for doodle descriptions.
 *
 * In order to display UTF.8 characters, this file should be loaded with the 'charset="utf-8"' attribute.
 * This currently cannot be done with the Yii registerScriptFile method, so should be loaded using a tag in the view file;
 * <script src="js/Misc/Translations.js" type="text/javascript" charset="utf-8"></script>
 */
ED.trans = new Object();

// For UTF.8, this file should be loaded with the 'charset="utf-8"' attribute. This currently cannot be done with the Yii registerScriptFile method
ED.trans['ACIOL'] = 'Drag to move<br/>Drag the handle to rotate';
ED.trans['ACMaintainer'] = 'Drag to move';
ED.trans['AngleGradeEast'] = 'Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeNorth'] = 'Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeSouth'] = 'Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeWest'] = 'Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleNV'] = 'Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AngleRecession'] = 'Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AntSeg'] = 'Drag the handle to resize the pupil<br/><br/>The iris is semi-transparent so that IOLs, and<br/>other structures can be seen behind it';
ED.trans['AntSegCrossSection'] = '';
ED.trans['AntSynech'] = 'Drag to move around angle<br/>Drag handles to change extent';
ED.trans['ArcuateKeratotomy'] = 'Drag to rotate<br/>Drag end handle to increase extent<br/>Drag middle handle to change radius';
ED.trans['ArcuateScotoma'] = 'Drag handle to change size';
ED.trans['BiopsySite'] = 'Drag to position';
ED.trans['Bleb'] = 'Drag to move around the limbus<br/>Drag handle to change size';
ED.trans['BlotHaemorrhage'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['BuckleSuture'] = 'Drag to position';
ED.trans['BusaccaNodule'] = 'Drag to move around the iris';
ED.trans['CapsularTensionRing'] = 'This cannot be selected directly since it is behind the iris<br/>Select the iris first<br/>Then move the scroll wheel until the ring is selected<br/>Click the \'Move to front\' button<br/>Err.. of course if you are seeing this tooltip you have already done it';
ED.trans['ChandelierSingle'] = 'Drag to rotate around centre<br/>';
ED.trans['ChandelierDouble'] = 'Drag to rotate around centre<br/>';
ED.trans['ChoroidalHaemorrhage'] = 'Drag to move around eye<br/>Drag outer handles to change size</br>Drag middle handle to change posterior extent';
ED.trans['ChoroidalNaevus'] = 'Drag to position<br/>Drag outer handles to change shape<br/>Drag outer ring of top handles to rotate<br/>Drag middle handle to add drusen';
ED.trans['CiliaryInjection'] = 'Drag to rotate around centre<br/>Drag handles to change extent';
ED.trans['Circinate'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['CircumferentialBuckle'] = 'Drag to position<br/>Drag outer handles to change extent<br/>Drag middle handle to change width';
ED.trans['ConjunctivalFlap'] = 'Drag to move around the limbus<br/>Drag handles to change size and depth';
ED.trans['CornealAbrasion'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['CorneaCrossSection'] = '';
ED.trans['CornealErosion'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['CornealGraft'] = 'Drag handle to change size';
ED.trans['CornealInlay'] = '';
ED.trans['CornealOedema'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['CornealStriae'] = '';
ED.trans['CornealScar'] = 'Drag outer handle to change shape<br/>Drag inner handle to change density';
ED.trans['CornealSuture'] = 'Drag to move';
ED.trans['CorticalCataract'] = 'Drag to move<br/>Drag handle to change density';
ED.trans['CottonWoolSpot'] = 'Drag to position<br/>Drag handle to change shape and size';
ED.trans['CNV'] = 'Drag to move<br/>Drag handle to scale';
ED.trans['CutterPI'] = 'Drag to move around the iris';
ED.trans['CystoidMacularOedema'] = 'Drag handle to change size';
ED.trans['DiabeticNV'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['DiscHaemorrhage'] = 'Drag to position';
ED.trans['DiscPallor'] = 'Drag to position<br/>Drag handles to adjust extent';
ED.trans['DrainageRetinotomy'] = 'Drag to position';
ED.trans['DrainageSite'] = 'Drag to change position';
ED.trans['EncirclingBand'] = 'Drag to change orientation of Watzke sleeve';
ED.trans['EntrySiteBreak'] = 'Drag to position<br/>Drag either end handle to increase extent';
ED.trans['EpiretinalMembrane'] = 'Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FibrousProliferation'] = 'Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FibrovascularScar'] = 'Drag to move<br/>Drag handle to scale';
ED.trans['FocalLaser'] = 'Drag the handle for a bigger area with more burns';
ED.trans['Freehand'] = 'Double-click to start drawing<br/>Drag inner handle to change size<br/>Drag outer handle to rotate<br/><br/>Adjust colours and settings in tool bar';
ED.trans['Fundus'] = '';
ED.trans['Fuchs'] = 'Drag handle to change shape';
ED.trans['Geographic'] = 'Drag middle handle to alter size of remaining central island of RPE<br/>Drag outside handle to scale';
ED.trans['Gonioscopy'] = 'Drag top left handle up and down to alter pigment density<br/>Drag top left handle left and right to alter pigment homogeneity';
ED.trans['HardDrusen'] = 'Drag middle handle up and down to alter density of drusen<br/>Drag outside handle to scale';
ED.trans['HardExudate'] = 'Drag to position';
ED.trans['Hyphaema'] = 'Drag handle vertically to change size<br/>Drag handle horizontally to change density';
ED.trans['Hypopyon'] = 'Drag handle vertically to change size';
ED.trans['IatrogenicBreak'] = 'Drag to position<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['ILMPeel'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['InjectionSite'] = 'Drag to position<br/>Drag handle to adjust distance from limbus';
ED.trans['IrisHook'] = 'Drag to move around the clock<br/><br/>The hook will match the size of the pupil as it changes<br/>Subsequent hooks are added to the next quadrant';
ED.trans['IrisNaevus'] = 'Drag to move<br/>Drag handle to change size';
ED.trans['IRMA'] = 'Drag to move<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['KeraticPrecipitates'] = 'Drag middle handle up and down to alter density<br/>Drag middle handle left and right to alter size<br/>Drag outside handle to scale';
ED.trans['KoeppeNodule'] = 'Drag to move around the iris';
ED.trans['KrukenbergSpindle'] = 'Drag to move</br>Drag outer handle to change shape';
ED.trans['Label'] = 'Drag to move label, type text to edit<br/>Drag handle to move pointer';
ED.trans['LaserCircle'] = 'Drag handle to change shape';
ED.trans['LaserDemarcation'] = 'Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move line more posteriorly';
ED.trans['LaserSpot'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['LasikFlap'] = 'Drag to rotate<br/>Drag the handle to scale';
ED.trans['Lens'] = 'Drag to move<br/>Edit properties when selected<br/>Delete to remove';
ED.trans['LensCrossSection'] = '';
ED.trans['LimbalRelaxingIncision'] = 'Drag to move';
ED.trans['Macroaneurysm'] = 'Drag to move';
ED.trans['MacularDystrophy'] = 'Drag outer handle to change size<br/>Drag middle handle to change type';
ED.trans['MacularGrid'] = 'Drag the handle to scale';
ED.trans['MacularHole'] = 'Drag the handle to scale';
ED.trans['MacularThickening'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['MattressSuture'] = 'Drag to move';
ED.trans['Microaneurysm'] = 'Drag to position';
ED.trans['NerveFibreDefect'] = 'Drag to position<br/>Drag handles to change size';
ED.trans['NuclearCataract'] = 'Drag to move<br/>Drag handle to change density';
ED.trans['OperatingTable'] = '';
ED.trans['OpticDisc'] = 'Basic mode: Drag handle to adjust cup/disc ratio<br/>Expert mode: Drag handles to re-shape disc';
ED.trans['OpticDiscPit'] = 'Drag to position<br/>Drag handle to change shape';
ED.trans['Patch'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['Papilloedema'] = '';
ED.trans['PCIOL'] = 'Drag to move<br/>Drag the handle to rotate';
ED.trans['PeripapillaryAtrophy'] = 'Drag to rotate<br/>Drag handles to change extent';
ED.trans['PeripheralRetinectomy'] = 'Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PeripheralRRD'] = 'Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PhakoIncision'] = 'Drag end handle to change length<br/>Drag the middle handle to change section type<br/>Drag the incision itself to move';
ED.trans['PI'] = 'Drag to move around the iris';
ED.trans['PosteriorCapsule'] = '';
ED.trans['PosteriorEmbryotoxon'] = '';
ED.trans['PosteriorRetinectomy'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['PosteriorSynechia'] = 'Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['PostPole'] = 'The disc cup can be edited by clicking on the disc, and dragging the yellow handle<br/>The gray circle marks one disc diameter from the fovea';
ED.trans['PostSubcapCataract'] = 'Drag handle to change size';
ED.trans['PreRetinalHaemorrhage'] = 'Drag to position<br/>Drag handles to change shape and size';
ED.trans['PRPPostPole'] = '';
ED.trans['PTK'] = 'Drag handle to change size';
ED.trans['RadialSponge'] = 'Drag to change position';
ED.trans['RetinalArteryOcclusionPostPole'] = 'Drag to position<br/>Drag handles to change extent<br/>Drag central handle to alter macular involvement';
ED.trans['RetinalTouch'] = 'Drag to change position';
ED.trans['RetinalVeinOcclusionPostPole'] = 'Drag to position<br/>Drag handles to change extent<br/>Drag central handle to alter macular involvement';
ED.trans['RK'] = 'Drag to rotate<br/>Drag outer handle to resize<br/>Drag inner handle to adjust central extent';
ED.trans['RoundHole'] = '';
ED.trans['RPEAtrophy'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['RPEDetachment'] = 'Drag to position<br/>Drag handles to change shape<br/>Drag to position<br/>Drag outer ring of top handles to rotate';
ED.trans['RetinalHaemorrhage'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['RPEHypertrophy'] = 'Drag to position<br/>Drag the handle to change size';
ED.trans['RPERip'] = 'Drag to move<br/>Drag large handle to resize and rotate<br/>Drag other handles to adjust shape';
ED.trans['RRD'] = 'Drag to move around eye<br/>Drag outer handles to change size</br>Drag middle handle to change posterior extent';
ED.trans['Rubeosis'] = 'Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['SectorPRP'] = 'Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['SectorPRPPostPole'] = 'Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['ScleralIncision'] = 'Drag to move around the sclera';
ED.trans['SectorIridectomy'] = 'Drag to position<br/>Drag handles to adjust extent';
ED.trans['Sclerostomy'] = 'Drag to rotate around centre<br/>Drag each handle to alter gauge<br/>Click suture button to toggle suture';
ED.trans['SidePort'] = 'Drag to move';
ED.trans['SMILE'] = 'Drag to handle to change size';
ED.trans['SubretinalFluid'] = 'Drag to position<br/>Drag handles to change shape<br/>Drag to position<br/>Drag outer ring of top handles to rotate';
ED.trans['SubretinalPFCL'] = 'Drag to position<br/>Drag handle to change size';
ED.trans['Supramid'] = 'Drag handle to move conjunctival end of suture';
ED.trans['Surgeon'] = '';
ED.trans['SwollenDisc'] = '';
ED.trans['Telangiectasis'] = 'Drag middle handle to add pigment and exudate';
ED.trans['ToricPCIOL'] = 'Drag to move<br/>Drag the handle to rotate';
ED.trans['Trabectome'] = 'Drag to position<br/>Drag either end handle to adjust extent';
ED.trans['TrabyConjIncision'] = 'Drag to position<br/>Drag end handle to adjust extent';
ED.trans['TrabyFlap'] = 'Drag to position<br/>Drag either end handle to adjust size</br>Drag middle handle to change sclerostomy';
ED.trans['TrabySuture'] = 'Drag to position<br/>Drag corner handle to adjust orientation</br>Drag lower handle to change suture type';
ED.trans['TractionRetinalDetachment'] = 'Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['TransilluminationDefect'] = 'Drag to rotate around centre<br/>Drag each end handle to alter extent';
ED.trans['Tube'] = 'Drag to change quadrant<br/>Drag handle to move end of tube';
ED.trans['TubeExtender'] = 'Drag to change quadrant<br/>Drag handle to move end of tube';
ED.trans['TubeLigation'] = 'Drag to change position';
ED.trans['UTear'] = '';
ED.trans['ViewObscured'] = 'Drag handle to change opacity';
ED.trans['VitreousOpacity'] = 'Drag to move<br/>Drag the inner handle up and down to alter opacity<br/>Drag the outer handle to scale';

// ENT
ED.trans['Grommet'] = 'Drag to position';
ED.trans['Perforation'] = 'Drag to move<br/>Drag handle to change size';

// Cardiology
ED.trans['Crepitations'] = 'Drag to move<br/>Drag handle to resize';
ED.trans['Stenosis'] = 'Drag to move<br/>Drag handle up and down to change degree<br/>Drag handle to left and right to change type';
ED.trans['Wheeze'] = 'Drag to move';
ED.trans['Effusion'] = 'Drag handle to move up';
ED.trans['LeftCoronaryArtery'] = 'Drag handle to move origin and make anomolous';
ED.trans['DrugStent'] = 'Drag to move';
ED.trans['MetalStent'] = 'Drag to move';
ED.trans['Bypass'] = 'Drag handle to alter destination';
ED.trans['Bruit'] = 'Drag to move';
ED.trans['Bruising'] = 'Drag to move<br/>Drag handle to resize';
ED.trans['Haematoma'] = 'Drag to move<br/>Drag handle to resize';
