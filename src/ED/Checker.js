var ED = ED || {};

/**
 * Object to track multiple eyedraw canvases on the page
 */
function EyeDrawChecker() {
	// register of all the eyedraws on the page
	this._eyedraws = new Array();
	// register of eyedraws that have been declared ready
	this._eyedrawsReady = new Array();
	this._allReadyListeners = new Array();

	var self = this;

	// quickly establish all the canvases that are eyedraw
	$('canvas').each(function() {
		// either a display or edit canvas
		if ($(this).hasClass('ed_canvas_display') || $(this).hasClass('ed_canvas_edit')) {
			self._eyedraws.push($(this).attr('id'));
		}
	});

	// call to mark an eyedraw as ready
	this.eyedrawReady = function(edId) {
		// only register eyedraws this checker is aware of
		if ($.inArray(edId, this._eyedraws) > -1) {
			// only register it once
			if ($.inArray(edId, this._eyedrawsReady) == -1) {
				this._eyedrawsReady.push(edId);

				if (this.allEyedrawsReady()) {
					// call any registered callback functions
					for (var i = 0; i < this._allReadyListeners.length; i++) {
						this._allReadyListeners[i]();
					}
				}
			}
		}
	};

	// function to determine if all the eyedraws on the page are ready
	this.allEyedrawsReady = function() {
		if (this._eyedraws.length == this._eyedrawsReady.length) {
			return true;
		}
		return false;
	};

	// function to register a callback function to call when all eyedraws are ready
	// if all the eyedraws are ready, then it calls the callback function
	this.registerForReady = function(callback) {
		if (this.allEyedrawsReady()) {
			callback();
		} else {
			this._allReadyListeners.push(callback);
		}
	}
}

// global variable to store the EyeDrawChecker in
var OEEyeDrawChecker;

// global function to initialise and retrieve the global eyedrawchecker object

function getOEEyeDrawChecker() {
	if (!OEEyeDrawChecker) {
		OEEyeDrawChecker = new EyeDrawChecker();
	}
	return OEEyeDrawChecker;
}

