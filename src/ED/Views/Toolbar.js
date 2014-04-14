ED.Views = ED.Views || {};

ED.Views.Toolbar = (function() {

	/**
	 * Toolbar constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} container The widget container element
	 * @extends {EventEmitter2}
	 */
	function Toolbar(drawing, container) {
		EventEmitter2.call(this);

		this.drawing = drawing;
		this.container = $(container);
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready'
		]);
	}

	Toolbar.prototype = Object.create(EventEmitter2.prototype);

	Toolbar.prototype.notificationHandler = function(notification) {
		if (notification.eventName === 'ready') {
			this.init();
		}
	};

	Toolbar.prototype.init = function() {

		// Toolbar button click events.
		this.container
			.on('click', '.eyedraw-toolbar .drawer > a', this.onDrawerButtonClick.bind(this))
			.on('click', '.eyedraw-button', this.onButtonClick.bind(this));

		// Document click event, hide drawers on document click.
		$(document)
			.on('click', this.onDocumentClick.bind(this));
	};

	Toolbar.prototype.onDrawerButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		$(e.currentTarget).closest('.drawer').toggleClass('active');
	};

	Toolbar.prototype.onButtonClick = function(e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		var button = $(e.currentTarget);
		var fn = button.data('function');
		var arg = button.data('arg');

		if (typeof this.drawing[fn] === 'function') {
			this.drawing[fn](arg);
			this.emit('doodle.action', {
				fn: fn,
				arg: arg
			});
		} else {
			this.emit('doodle.error', 'Invalid doodle function: ' + fn);
		}
	};

	Toolbar.prototype.onDocumentClick = function(e) {
		// Close any open drawers.
		this.container.find('.drawer').removeClass('active');
	};

	return Toolbar;
}());