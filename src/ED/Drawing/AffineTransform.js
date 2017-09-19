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


/**
 * Creates a new transformation matrix initialised to the identity matrix
 *
 * @class AffineTransform
 * @property {Array} components Array representing 3x3 matrix
 */
ED.AffineTransform = function() {
	// Properties - array of arrays of column values one for each row
	this.components = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
}

/**
 * Sets matrix to identity matrix
 */
ED.AffineTransform.prototype.setToIdentity = function() {
	this.components[0][0] = 1;
	this.components[0][1] = 0;
	this.components[0][2] = 0;
	this.components[1][0] = 0;
	this.components[1][1] = 1;
	this.components[1][2] = 0;
	this.components[2][0] = 0;
	this.components[2][1] = 0;
	this.components[2][2] = 1;
}

/**
 * Sets the transform matrix to another
 *
 * @param {AffineTransform} _transform Array An affine transform
 */
ED.AffineTransform.prototype.setToTransform = function(_transform) {
	this.components[0][0] = _transform.components[0][0];
	this.components[0][1] = _transform.components[0][1];
	this.components[0][2] = _transform.components[0][2];
	this.components[1][0] = _transform.components[1][0];
	this.components[1][1] = _transform.components[1][1];
	this.components[1][2] = _transform.components[1][2];
	this.components[2][0] = _transform.components[2][0];
	this.components[2][1] = _transform.components[2][1];
	this.components[2][2] = _transform.components[2][2];
}

/**
 * Adds a translation to the transform matrix
 *
 * @param {float} _x value to translate along x-axis
 * @param {float} _y value to translate along y-axis
 */
ED.AffineTransform.prototype.translate = function(_x, _y) {
	this.components[0][2] = this.components[0][0] * _x + this.components[0][1] * _y + this.components[0][2];
	this.components[1][2] = this.components[1][0] * _x + this.components[1][1] * _y + this.components[1][2];
	this.components[2][2] = this.components[2][0] * _x + this.components[2][1] * _y + this.components[2][2];
}

/**
 * Adds a scale to the transform matrix
 *
 * @param {float} _sx value to scale along x-axis
 * @param {float} _sy value to scale along y-axis
 */
ED.AffineTransform.prototype.scale = function(_sx, _sy) {
	this.components[0][0] = this.components[0][0] * _sx;
	this.components[0][1] = this.components[0][1] * _sy;
	this.components[1][0] = this.components[1][0] * _sx;
	this.components[1][1] = this.components[1][1] * _sy;
	this.components[2][0] = this.components[2][0] * _sx;
	this.components[2][1] = this.components[2][1] * _sy;
}

/**
 * Adds a rotation to the transform matrix
 *
 * @param {float} _rad value to rotate by in radians
 */
ED.AffineTransform.prototype.rotate = function(_rad) {
	// Calulate trigonometry
	var c = Math.cos(_rad);
	var s = Math.sin(_rad);

	// Make new matrix for transform
	var matrix = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	// Apply transform
	matrix[0][0] = this.components[0][0] * c + this.components[0][1] * s;
	matrix[0][1] = this.components[0][1] * c - this.components[0][0] * s;
	matrix[1][0] = this.components[1][0] * c + this.components[1][1] * s;
	matrix[1][1] = this.components[1][1] * c - this.components[1][0] * s;
	matrix[2][0] = this.components[2][0] * c + this.components[2][1] * s;
	matrix[2][1] = this.components[2][1] * c - this.components[2][0] * s;

	// Change old matrix
	this.components[0][0] = matrix[0][0];
	this.components[0][1] = matrix[0][1];
	this.components[1][0] = matrix[1][0];
	this.components[1][1] = matrix[1][1];
	this.components[2][0] = matrix[2][0];
	this.components[2][1] = matrix[2][1];
}

/**
 * Applies transform to a point
 *
 * @param {Point} _point a point
 * @returns {Point} a transformed point
 */
ED.AffineTransform.prototype.transformPoint = function(_point) {
	var newX = _point.x * this.components[0][0] + _point.y * this.components[0][1] + 1 * this.components[0][2];
	var newY = _point.x * this.components[1][0] + _point.y * this.components[1][1] + 1 * this.components[1][2];

	return new ED.Point(newX, newY);
}

/**
 * Calculates determinant of transform matrix
 *
 * @returns {Float} determinant
 */
ED.AffineTransform.prototype.determinant = function() {
	return this.components[0][0] * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]) -
		this.components[0][1] * (this.components[1][0] * this.components[2][2] - this.components[1][2] * this.components[2][0]) +
		this.components[0][2] * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
}

/**
 * Inverts transform matrix
 *
 * @returns {Array} inverse matrix
 */
ED.AffineTransform.prototype.createInverse = function() {
	// Create new matrix
	var inv = new ED.AffineTransform();

	var det = this.determinant();

	//if (det != 0)
	var invdet = 1 / det;

	// Calculate components of inverse matrix
	inv.components[0][0] = invdet * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]);
	inv.components[0][1] = invdet * (this.components[0][2] * this.components[2][1] - this.components[0][1] * this.components[2][2]);
	inv.components[0][2] = invdet * (this.components[0][1] * this.components[1][2] - this.components[0][2] * this.components[1][1]);

	inv.components[1][0] = invdet * (this.components[1][2] * this.components[2][0] - this.components[1][0] * this.components[2][2]);
	inv.components[1][1] = invdet * (this.components[0][0] * this.components[2][2] - this.components[0][2] * this.components[2][0]);
	inv.components[1][2] = invdet * (this.components[0][2] * this.components[1][0] - this.components[0][0] * this.components[1][2]);

	inv.components[2][0] = invdet * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
	inv.components[2][1] = invdet * (this.components[0][1] * this.components[2][0] - this.components[0][0] * this.components[2][1]);
	inv.components[2][2] = invdet * (this.components[0][0] * this.components[1][1] - this.components[0][1] * this.components[1][0]);

	return inv;
}