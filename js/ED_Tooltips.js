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
ED.trans['ACIOL'] = 'Anterior chamber IOL<br/><br/>Click to select<br/>Drag the outer handle to rotate<br/>Drag the inner handle to resize<br/>Drag the IOL itself to move';
ED.trans['AntSeg'] = 'Anterior segment<br/><br/>Click to select<br/>Drag the handle to resize the pupil<br/><br/>The iris is semi-transparent so that IOLs, and<br/>other structures can be seen behind it';
ED.trans['CapsularTensionRing'] = 'Capsular Tension Ring<br/><br/>This cannot be selected directly since it is behind the iris<br/>Select the iris first<br/>Then move the scroll wheel until the ring is selected<br/>Click the \'Move to front\' button<br/>Err.. of course if you are seeing this tooltip you have already done it';
ED.trans['CornealSuture'] = 'Corneal suture<br/><br/>Click to select<br/>Drag to move';
ED.trans['IrisHook'] = 'Iris hook<br/><br/>Click to select<br/>Drag to move around the clock<br/><br/>The hook will match the size of the pupil<br/>as the pupil size is altered<br/><br/>Subsequent hooks are added to the next<br/>quadrant going round clockwise';
ED.trans['MattressSuture'] = 'Mattress suture<br/><br/>Click to select<br/>Drag to move';
ED.trans['PCIOL'] = 'Posterior chamber IOL<br/><br/>Click to select<br/>Drag the outer handle to rotate<br/>Drag the inner handle to resize<br/>Drag the IOL itself to move';
ED.trans['PhakoIncision'] = 'Phako incision<br/><br/>Click to select<br/>Drag the end handle to length<br/>Drag the middle handle to change section type<br/>Drag the incision itself to move';
ED.trans['PI'] = 'Iridectomía periférica';
ED.trans['SidePort'] = 'Side port<br/><br/>Click to select<br/>Drag to move';
