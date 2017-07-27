ED.Cornea = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "Cornea";

    // Other parameters
    this.shape = "";
    this.pachymetry = 540;

    // Saved parameters
    this.savedParameterArray = ['shape', 'pachymetry', 'csOriginX', 'csApexX', 'csApexY'];

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Cornea.prototype = new ED.Doodle;
ED.Cornea.prototype.constructor = ED.Cornea;
ED.Cornea.superclass = ED.Doodle.prototype;


/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Cornea.prototype.setParameterDefaults = function() {
    this.csOriginX = 50;
    this.csApexX = -363;
    this.csApexY = 0;
    this.setParameterFromString('shape', 'Normal');
    this.setParameterFromString('pachymetry', '540');
}

/**
 * This is basically duplicated from CorneaCrossSection, which could certainly benefit from some refactoring
 * further down the track
 */
ED.Cornea.prototype.setPropertyDefaults = function() {
    this.isSelectable = false;
    this.isDeletable = false;
    this.isMoveable = false;
    this.isRotatable = false;
    this.isUnique = true;
    this.willReport = false;

    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-365, -300);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +100);

    // Other parameters
    this.parameterValidationArray['shape'] = {
        kind: 'other',
        type: 'string',
        list: ['Normal', 'Keratoconus', 'Keratoglobus'],
        animate: false
    };
    this.parameterValidationArray['pachymetry'] = {
        kind: 'other',
        type: 'int',
        range: new ED.Range(400, 700),
        precision: 1,
        animate: false
    };
}

/**
 * Transparent doodle can not be clicked
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cornea.prototype.draw = function(_point) {
    return false;
}