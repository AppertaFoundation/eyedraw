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
 * Language specific tooltips which appear over doodles on hover
 *
 * In order to display UTF.8 characters, this file should be loaded with the 'charset="utf-8"' attribute.
 * This currently cannot be done with the Yii registerScriptFile method, so should be loaded using a tag in the view file;
 * <script src="js/ED_Tooltips.js" type="text/javascript" charset="utf-8"></script>
 */
ED.trans = new Object();

// For UTF.8, this file should be loaded with the 'charset="utf-8"' attribute. This currently cannot be done with the Yii registerScriptFile method
ED.trans['ACIOL'] = 'Anterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['AngleGradeEast'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeNorth'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeSouth'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeWest'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleNV'] = 'Angle new vessels<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AngleRecession'] = 'Angle recession<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AntSeg'] = 'Anterior segment<br/><br/>Drag the handle to resize the pupil<br/><br/>The iris is semi-transparent so that IOLs, and<br/>other structures can be seen behind it';
ED.trans['AntSegCrossSection'] = '';
ED.trans['AntSynech'] = 'Anterior synechiae<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['ArcuateScotoma'] = 'Arcuate scotoma<br/><br/>Drag handle to change size';
ED.trans['BiopsySite'] = 'Biopsy site<br/><br/>Drag to position';
ED.trans['Bleb'] = 'Trabeculectomy bleb<br/><br/>Drag to move around the limbus';
ED.trans['BlotHaemorrhage'] = 'Blot haemorrhage<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['BuckleSuture'] = 'Buckle suture<br/><br/>Drag to position';
ED.trans['BusaccaNodule'] = 'Busacca nodule<br/><br/>Drag to move around the iris';
ED.trans['CapsularTensionRing'] = 'Capsular Tension Ring<br/><br/>This cannot be selected directly since it is behind the iris<br/>Select the iris first<br/>Then move the scroll wheel until the ring is selected<br/>Click the \'Move to front\' button<br/>Err.. of course if you are seeing this tooltip you have already done it';
ED.trans['ChandelierSingle'] = 'Chandelier illumination<br/><br/>Drag to rotate around centre<br/>';
ED.trans['ChandelierDouble'] = 'Double chandelier illumination<br/><br/>Drag to rotate around centre<br/>';
ED.trans['ChoroidalHameorrhage'] = 'Choroidal haemorrhage<br/><br/>Drag to move around eye<br/>Drag outer handles to change size</br>Drag middle handle to change posterior extent';
ED.trans['ChoroidalNaevus'] = 'Choroidal naevust<br/><br/>Drag to position<br/>Drag outer handles to change shape<br/>Drag outer ring of top handles to rotate<br/>Drag middle handle to add drusen';
ED.trans['CiliaryInjection'] = 'Ciliary injection<br/><br/>Drag to rotate around centre<br/>Drag handles to change extent';
ED.trans['Circinate'] = 'Circinate (Ring of exudates)<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CircumferentialBuckle'] = 'Circumferential buckle<br/><br/>Drag to position<br/>Drag outer handles to change extent<br/>Drag middle handle to change width';
ED.trans['ConjunctivalFlap'] = 'Conjunctival flap<br/><br/>Drag to move around the limbus<br/>Drag handles to change size and depth';
ED.trans['CornealAbrasion'] = 'Corneal abrasion<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CorneaCrossSection'] = 'Corneal cross section';
ED.trans['CornealErosion'] = 'Removal of corneal epithelium<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CornealGraft'] = 'Corneal graft<br/><br/>Drag handle to change size';
ED.trans['CornealOedema'] = 'Corneal oedema<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CornealStriae'] = 'Corneal striae';
ED.trans['CornealScar'] = 'Corneal Scar<br/><br/>Drag outer handle to change shape<br/>Drag inner handle to change density';
ED.trans['CornealSuture'] = 'Corneal suture<br/><br/>Drag to move';
ED.trans['CorticalCataract'] = '';
ED.trans['CottonWoolSpot'] = 'Cotton wool spot<br/><br/>Drag to position<br/>Drag handle to change shape and size';
ED.trans['CNV'] = 'Choroidal neovascular membrane<br/><br/>Drag to move<br/>Drag handle to scale';
ED.trans['CutterPI'] = 'Cutter iridectomy<br/><br/>Drag to move around the iris';
ED.trans['CystoidMacularOedema'] = 'Cystoid macular oedema<br/><br/>Drag handle to change size';
ED.trans['DiabeticNV'] = 'Diabetic new vessels<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['DiscHaemorrhage'] = 'Disc haemorrhage<br/><br/>Drag to position';
ED.trans['DiscPallor'] = 'Disc Pallor<br/><br/>Drag to position<br/>Drag handles to adjust extent';
ED.trans['DrainageRetinotomy'] = 'Drainage retinotomy<br/><br/>Drag to position';
ED.trans['DrainageSite'] = 'Drainage site<br/><br/>Drag to change position';
ED.trans['EncirclingBand'] = 'Encircling band<br/><br/>Drag to change orientation of Watzke sleeve';
ED.trans['EntrySiteBreak'] = 'Entry site break<br/><br/>Drag to position<br/>Drag either end handle to increase extent';
ED.trans['EpiretinalMembrane'] = 'Epiretinal membrane<br/><br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FibrousProliferation'] = 'Fibrous Proliferation<br/><br/>Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FocalLaser'] = 'Focal laser burns<br/><br/>Drag the handle for a bigger area with more burns';
ED.trans['Freehand'] = 'Freehand drawing<br/><br/>Double-click to start drawing<br/>Drag inner handle to change size<br/>Drag outer handle to rotate<br/><br/>Adjust colours and settings in tool bar';
ED.trans['Fundus'] = '';
ED.trans['Fuchs'] = 'Fuch\'s Endothelial Dystrophy<br/><br/>Drag handle to change shape';
ED.trans['Geographic'] = 'Geographic Atrophy<br/><br/>Drag middle handle to alter size of remaining central island of RPE<br/>Drag outside handle to scale';
ED.trans['Gonioscopy'] = 'Goniogram<br/><br/>Drag top left handle up and down to alter pigment density<br/>Drag top left handle left and right to alter pigment homogeneity';
ED.trans['HardDrusen'] = 'Hard drusen<br/><br/>Drag middle handle up and down to alter density of drusen<br/>Drag outside handle to scale';
ED.trans['HardExudate'] = 'Hard exudate<br/><br/>Drag to position';
ED.trans['Hyphaema'] = 'Hyphaema<br/><br/>Drag handle vertically to change size<br/>Drag handle horizontally to change density';
ED.trans['Hypopyon'] = 'Hypopyon<br/><br/>Drag handle vertically to change size';
ED.trans['IatrogenicBreak'] = 'Iatrogenic Break<br/><br/>Drag to position<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['ILMPeel'] = 'ILM peel<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['InjectionSite'] = 'Injection site<br/><br/>Drag to position<br/>Drag handle to adjust distance from limbus';
ED.trans['IrisHook'] = 'Iris hook<br/><br/>Drag to move around the clock<br/><br/>The hook will match the size of the pupil as it changes<br/>Subsequent hooks are added to the next quadrant';
ED.trans['IrisNaevus'] = 'Iris naevus<br/><br/>Drag to move<br/>Drag handle to change size';
ED.trans['IRMA'] = 'Intraretinal microvascular abnormalities<br/><br/>Drag to move<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['KeraticPrecipitates'] = 'Keratic precipitates<br/><br/>Drag middle handle up and down to alter density<br/>Drag middle handle left and right to alter size<br/>Drag outside handle to scale';
ED.trans['KoeppeNodule'] = 'Koeppe nodule<br/><br/>Drag to move around the iris';
ED.trans['KrukenbergSpindle'] = 'Krukenberg\'s spindle<br/><br/>Drag to move</br>Drag outer handle to change shape';
//ED.trans['Label'] = 'A text label<br/><br/>Drag to move label, type text to edit</br>Drag handle to move pointer';
ED.trans['LaserCircle'] = 'A circle of laser spots<br/><br/>Drag handle to change shape';
ED.trans['LaserDemarcation'] = 'A row of laser spots for demarcation<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move line more posteriorly';
ED.trans['LaserSpot'] = 'A single laser spot<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['LasikFlap'] = 'LASIK flap<br/><br/>Drag to rotate<br/>Drag the handle to scale';
ED.trans['Lens'] = 'Lens<br/><br/>Drag to move<br/>Edit properties when selected<br/>Delete to remove';
ED.trans['LensCrossSection'] = '';
ED.trans['LimbalRelaxingIncision'] = 'Limbal relaxing incision<br/><br/>Drag to move';
ED.trans['Macroaneurysm'] = 'Macroaneurysm<br/><br/>Drag to move';
ED.trans['MacularDystrophy'] = 'Macular dystrophy<br/><br/>Drag outer handle to change size<br/>Drag middle handle to change type';
ED.trans['MacularGrid'] = 'Macular grid<br/><br/>Drag the handle to scale';
ED.trans['MacularHole'] = 'Macular hole<br/><br/>Drag the handle to scale';
ED.trans['MacularThickening'] = 'Macular thickening<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['MattressSuture'] = 'Mattress suture<br/><br/>Drag to move';
ED.trans['Microaneurysm'] = 'Microaneurysm<br/><br/>Drag to position';
ED.trans['NerveFibreDefect'] = 'Nerve fibre layer defect<br/><br/>Drag to position<br/>Drag handles to change size';
ED.trans['OperatingTable'] = 'Operating table';
ED.trans['OpticDisc'] = 'Optic disc<br/><br/>Basic mode: Drag handle to adjust cup/disc ratio<br/>Expert mode: Drag handles to re-shape disc';
ED.trans['OpticDiscPit'] = 'Optic disc pit<br/><br/>Drag to position<br/>Drag handle to change shape';
ED.trans['Papilloedema'] = 'Papilloedema';
ED.trans['PCIOL'] = 'Posterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['PeripapillaryAtrophy'] = 'Peripapillary atrophy<br/><br/>Drag to rotate<br/>Drag handles to change extent';
ED.trans['PeripheralRetinectomy'] = 'Peripheral retinectomy<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PeripheralRRD'] = 'Peripheral retinal detachment<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PhakoIncision'] = 'Phako incision<br/><br/>Drag end handle to change length<br/>Drag the middle handle to change section type<br/>Drag the incision itself to move';
ED.trans['PI'] = 'Peripheral iridectomy<br/><br/>Drag to move around the iris';
ED.trans['PosteriorEmbryotoxon'] = 'Posterior embryotoxon';
ED.trans['PosteriorRetinectomy'] = 'Posterior retinectomy<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['PosteriorSynechia'] = 'PosteriorSynechia<br/><br/>Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['PostPole'] = 'Posterior pole<br/><br/>The disc cup can be edited by clicking on the disc, and dragging the yellow handle<br/>The gray circle marks one disc diameter from the fovea';
ED.trans['PreRetinalHaemorrhage'] = 'Preretinal haemorrhage<br/><br/>Drag to position<br/>Drag handles to change shape and size';
ED.trans['PRPPostPole'] = 'Pan-retinal photocoagulation';
ED.trans['RadialSponge'] = 'Radial sponge<br/><br/>Drag to change position';
ED.trans['RetinalArteryOcclusionPostPole'] = 'Retinal artery occlusion<br/><br/>Drag to position<br/>Drag handles to change extent<br/>Drag central handle to alter macular involvement';
ED.trans['RetinalTouch'] = 'Retinal touch<br/><br/>Drag to change position';
ED.trans['RetinalVeinOcclusionPostPole'] = 'Retinal vein occlusion<br/><br/>Drag to position<br/>Drag handles to change extent<br/>Drag central handle to alter macular involvement';
ED.trans['RK'] = 'Radial keratotomy<br/><br/>Drag to rotate<br/>Drag outer handle to resize<br/>Drag inner handle to adjust central extent';
ED.trans['RoundHole'] = '';
ED.trans['RPEDetachment'] = 'RPE detachment<br/><br/>Drag to position<br/>Drag handles to change shape<br/>Drag to position<br/>Drag outer ring of top handles to rotate';
ED.trans['RPERip'] = 'RPE rip<br/><br/>Drag to move<br/>Drag large handle to resize and rotate<br/>Drag other handles to adjust shape';
ED.trans['RRD'] = 'Rhegmatogenous retinal detachment<br/><br/>Drag to move around eye<br/>Drag outer handles to change size</br>Drag middle handle to change posterior extent';
ED.trans['Rubeosis'] = 'Rubeosis iridis<br/><br/>Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['SectorPRP'] = 'A sector of panretinal photocoagulation<br/><br/>Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['SectorPRPPostPole'] = 'A sector of panretinal photocoagulation<br/><br/>Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['ScleralIncision'] = 'Scleral incision<br/><br/>Drag to move around the sclera';
ED.trans['SectorIridectomy'] = 'Sector Iridectomy<br/><br/>Drag to position<br/>Drag handles to adjust extent';
ED.trans['Sclerostomy'] = 'A sclerostomy for vitrectomy<br/><br/>Drag to rotate around centre<br/>Drag each handle to alter gauge<br/>Click suture button to toggle suture';
ED.trans['SidePort'] = 'Side port<br/><br/>Drag to move';
ED.trans['SubretinalFluid'] = 'Subretinal fluid<br/><br/>Drag to position<br/>Drag handles to change shape<br/>Drag to position<br/>Drag outer ring of top handles to rotate';
ED.trans['SubretinalPFCL'] = 'Subretinal PFCL<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['Surgeon'] = 'Surgeon';
ED.trans['SwollenDisc'] = 'Swollen disc';
ED.trans['Telangiectasis'] = 'Parafoveal Telangiectasia<br/><br/>Drag middle handle to add pigment and exudate';
ED.trans['ToricPCIOL'] = 'Toric posterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['Trabectome'] = 'Trabectome<br/><br/>Drag to position<br/>Drag either end handle to adjust extent';
ED.trans['TrabyFlap'] = 'Trabeculectomy flap<br/><br/>Drag to position<br/>Drag either end handle to adjust size</br>Drag middle handle to change sclerostomy';
ED.trans['TrabySuture'] = 'Trabeculectomy suture<br/><br/>Drag to position<br/>Drag corner handle to adjust orientation</br>Drag lower handle to change suture type';
ED.trans['TractionRetinalDetachment'] = 'Traction retinal detachment<br/><br/>Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['TransilluminationDefect'] = 'Transillumination defects of the iris<br/><br/>Drag to rotate around centre<br/>Drag each end handle to alter extent';
ED.trans['UTear'] = '';
ED.trans['VitreousOpacity'] = 'Vitreous Opacity<br/><br/>Drag to move<br/>Drag the inner handle up and down to alter opacity<br/>Drag the outer handle to scale';

ED.trans['Crepitations'] = 'Crepitations<br/><br/>Drag to move<br/>Drag handle to resize';
ED.trans['Stenosis'] = 'Stenosis<br/><br/>Drag to move<br/>Drag handle up and down to change degree<br/>Drag handle to left and right to change type';
ED.trans['Wheeze'] = 'Wheeze<br/><br/>Drag to move';
ED.trans['Effusion'] = 'Pleural effusion<br/><br/>Drag handle to move up';
ED.trans['LeftCoronaryArtery'] = 'Left coronary artery<br/><br/>Drag handle to move origin and make anomolous';
ED.trans['DrugStent'] = 'Drug eluting stent<br/><br/>Drag to move';
ED.trans['MetalStent'] = 'Metal stent<br/><br/>Drag to move';
ED.trans['Bypass'] = 'Coronary artery bypass<br/><br/>Drag handle to alter destination';
ED.trans['Bruit'] = 'Bruit<br/><br/>Drag to move';
ED.trans['Bruising'] = 'Bruising<br/><br/>Drag to move<br/>Drag handle to resize';
ED.trans['Haematoma'] = 'Haematoma<br/><br/>Drag to move<br/>Drag handle to resize';
