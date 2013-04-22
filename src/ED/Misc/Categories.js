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
 * Language specific categories which can be used to take actions following addition of a doodle
 */
ED.Categories = new Object();

/**
 * Complications
 */
ED.Categories['EntrySiteBreak'] = {
    complication: 'Entry site break'
};
ED.Categories['RetinalTouch'] = {
    complication: 'Retinal touch'
};
ED.Categories['IatrogenicBreak'] = {
    complication: 'Iatrogenic break'
};
ED.Categories['SubretinalPFCL'] = {
    complication: 'Subretinal PFCL'
};
