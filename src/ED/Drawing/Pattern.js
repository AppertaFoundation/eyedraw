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

ED.Pattern = function() {
};

ED.Pattern.prototype.createDottedPattern = function(density_x, density_y, colour) {
    const size = 48;

    var pattern = document.createElement('canvas');
    pattern.width = size;
    pattern.height = size;
    var pctx = pattern.getContext('2d');

    pctx.fillStyle = colour;
    pctx.fillRect(0,0, size, size);

    let Ny_inner = 2 * density_y + 1;
    let Nx_inner = 2 * density_x + 1;

    let Nx_all = Nx_inner + 2;
    let Ny_all = Ny_inner + 2;
    let dx = pattern.width / (Nx_all - 1);
    let dy = pattern.height / (Ny_all - 1);

    for (let y = 0; y < Ny_all; ++y) {
        let currentY = y * dy;
        for (let x = 0; x < Nx_all; ++x) {
            let Yoffset = (x % 2 === 0) ? 0 : dy / 2;
            let currentX = x * dx;
            pctx.beginPath();
            pctx.fillStyle = 'black';
            pctx.arc(currentX, currentY + Yoffset, 1, 0, 2 * Math.PI);
            pctx.fill();
        }
    }

    pctx.fill();

    return pattern;
};
