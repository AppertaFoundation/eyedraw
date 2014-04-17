(function() {

	function createDOM() {

		var container = $('<div />', {
			'class': 'eyedraw-widget'
		}).appendTo(document.body);

		var canvas = $('<canvas />', {
			id: 'canvasID'
		}).appendTo(container);

		var input = $('<input />', {
			type: 'hidden',
			id: 'inputID'
		}).appendTo(container);

		var toolbar = $('<div />', {
			'class': 'eyedraw-toolbar-panel'
		}).appendTo(container);

		return {
			container: container,
			canvas: canvas,
			input: input,
			toolbar: toolbar,
			destroy: function destroy() {
				container.empty().remove();
			}
		};
	}

	/**
	 * Creates a mock ED.Drawing object
	 */
	function createDrawing() {
		return {
			notificationArray: [],
			registerForNotifications: function() {
				ED.Drawing.prototype.registerForNotifications.apply(this, arguments);
			},
			randomFunction: $.noop
		};
	};

	var FakeChecker = {
		register: $.noop
	};

	var defaultProperties = {
		canvasId: 'canvasID',
		inputId: 'inputID',
		graphicsPath: '../../../assets/img',
		offsetX: 100,
		offsetY: 100,
		toImage: false,
		eye: 0,
		idSuffix: 'idSuffix',
		isEditable: true
	};

	describe('Controller', function() {

		it('should exist on the ED namespace', function() {
			expect(typeof ED.Controller).to.equal('function');
		});

		describe('Construction', function() {

			var dom;
			var controller;
			var properties;

			beforeEach(function() {
				dom = createDOM();
			});
			afterEach(function() {
				dom.destroy();
			});

			it('should set the expected properties', function() {

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, FakeChecker);

				expect(controller.properties).to.equal(properties);
				expect(controller.canvas).to.equal(dom.canvas[0]);
				expect(controller.input).to.equal(dom.input[0]);
				expect(controller.container instanceof jQuery).to.be.true;
				expect(controller.container[0]).to.equal(dom.container[0]);
				expect(controller.Checker).to.equal(FakeChecker);
			});

			it('should create a new Drawing instance, register it with the Checker and save the instance', function() {

				var spy1 = sinon.spy(FakeChecker, 'register');
				var spy2 = sinon.spy(ED, 'setInstance');

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, FakeChecker);

				expect(controller.drawing instanceof ED.Drawing).to.be.true;
				expect(spy1.withArgs(controller.drawing).called).to.be.true;
				expect(spy2.withArgs(controller.drawing).called).to.be.true;

				console.log(controller.drawing);

				spy1.restore();
				spy2.restore();
			});

			it('should create new Toolbar and DoodlePopup instances', function() {

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, FakeChecker);

				expect(controller.toolbar instanceof ED.Views.Toolbar).to.be.true;
				expect(controller.doodlePopup instanceof ED.Views.DoodlePopup).to.be.true;
				expect(controller.toolbar.container[0]).to.equal(dom.toolbar[0]);
			});

			it('should register the notification handler with the drawing instance', function() {
				// var notification = o.drawing.notificationArray[0];
				// var handler = notification.object[notification.methodName];
				// expect(handler).to.equal(o.toolbar.notificationHandler);
			});
		});
	});
}());