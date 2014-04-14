ED.Views = ED.Views || {};

ED.Views.DoodlePopup = (function() {

	/** Helpers */
	function ucFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/** Constants */
	var OPEN = 'open';
	var CLOSED = 'closed';

	/**
	 * DoodlePopup constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} widgetContainer The widget container element
	 * @extends {EventEmitter2}
	 */
	function DoodlePopup(drawing, widgetContainer) {

		EventEmitter2.call(this);

		this.drawing = drawing;
		this.container = widgetContainer.find('.eyedraw-doodle-popup');
		this.currentDoodle = null;
		this.state = CLOSED;
		this.delayTimer = 0;

		this.createToolbar();
		this.createTemplate();
		this.registerForNotifications();
	}

	DoodlePopup.prototype = Object.create(EventEmitter2.prototype);

	DoodlePopup.prototype.createToolbar = function() {
		this.toolbar = new ED.Views.Toolbar(this.drawing, this.container);
		this.toolbar.on('doodle.action', this.compileTemplate.bind(this, null));
	};

	DoodlePopup.prototype.createTemplate = function() {
		this.template = $('#eyedraw-doodle-popup-template').html();
	};

	DoodlePopup.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready',
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected'
		]);
	};

	DoodlePopup.prototype.notificationHandler = function(notification) {
		var eventName = notification['eventName'];
		var handlerName = 'on' + ucFirst(eventName);
		this[handlerName](notification);
	};

	/**
	 * Run only when the drawing is ready.
	 */
	DoodlePopup.prototype.init = function() {
		this.container.on('click', '.eyedraw-doodle-popup-toggle', this.onToggleClick.bind(this));
	};

	DoodlePopup.prototype.compileTemplate = function(data) {
		if (data) {
			this.templateData = data;
		}
		var html = Mustache.render(this.template, this.templateData);
		this.container.html(html);
	};

	DoodlePopup.prototype.update = function(show, doodle) {
		if (show) {
			this.compileTemplate({ doodle: doodle });
			this.show();
		} else {
			this.hide();
		}
	};

	DoodlePopup.prototype.hide = function() {
		this.state = CLOSED;
		this.delay(function() {
			this.container.addClass('closed');
		}.bind(this));
	};

	DoodlePopup.prototype.show = function() {
		if (this.currentDoodle.isLocked){
			return;
		}
		this.state = OPEN;
		this.selectDoodle();
		this.delay(function() {
			this.container.removeClass('closed');
		}.bind(this));
	};

	DoodlePopup.prototype.delay = function(fn) {
		clearTimeout(this.delayTimer);
		this.delayTimer = setTimeout(fn, 50);
	};

	DoodlePopup.prototype.selectDoodle = function() {
		if (!this.currentDoodle.isSelected && !this.currentDoodle.isLocked) {
			this.currentDoodle.isSelected = true;
			this.currentDoodle.onSelection();
			this.drawing.repaint();
		}
	};

	/** EVENT HANDLERS */

	/**
	 * Order of events emitted from the eyedraw:
	 * 1. doodleSelected
	 * 2. doodleDeselected
	 * Thus we delay the selected action into the next event loop if we want the
	 * popup to remain visible when selecting a new doodle.
	 */

	DoodlePopup.prototype.onToggleClick = function(e) {
		e.preventDefault();
		var func = (this.state === CLOSED ? 'show' : 'hide');
		this[func]();
	}

	DoodlePopup.prototype.onReady = function(notification) {
		this.init();
	};

	DoodlePopup.prototype.onDoodleAdded = function(notification) {
		this.currentDoodle = notification.selectedDoodle;
		this.update(true, notification.selectedDoodle);
	};

	DoodlePopup.prototype.onDoodleDeleted = function(notification) {
		this.update(false, notification.selectedDoodle);
	};

	DoodlePopup.prototype.onDoodleSelected = function(notification) {
		this.currentDoodle = notification.selectedDoodle;
		setTimeout(this.update.bind(this, true, notification.selectedDoodle));
	};

	DoodlePopup.prototype.onDoodleDeselected = function(notification) {
		this.update(false, notification.selectedDoodle);
	};

	return DoodlePopup;
}());
