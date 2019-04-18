/**
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

var Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector2D.prototype.add = function(rval) {
    return new Vector2D(this.x + rval.x, this.y + rval.y);
};

Vector2D.prototype.sub = function(rval) {
    return this.add(rval.scale(-1));
};

Vector2D.prototype.scale = function(rval) {
    return new Vector2D(this.x * rval, this.y * rval);
};

Vector2D.prototype.log = function() {
    console.log("Vector2D {x: " + this.x + ", y: " + this.y + "}");
};