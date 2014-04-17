(function ControllerTest() {

	'use strict';

	/**
	 * Creates a DOM fragment
	 */
	function createDOM() {

		var container = $('<div />', {
			'class': 'eyedraw-widget'
		}).appendTo(document.body);

		var canvas = $('<canvas />', {
			id: 'canvasID',
			tabindex: 1
		}).appendTo(container);

		var input = $('<input />', {
			type: 'hidden',
			id: 'inputID',
			value: JSON.stringify({ test: 'testing' })
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
			init: $.noop,
			randomFunction: $.noop,
			notify: function() {
				ED.Drawing.prototype.notify.apply(this, arguments);
			},
			loadDoodles: $.noop,
			repaint: $.noop,
			save: $.noop
		};
	};

	/**
	 * A fake ED.Checker object
	 * @type {Object}
	 */
	var FakeChecker = {
		register: $.noop
	};

	/**
	 * A fake doodle.
	 * @type {Object}
	 */
	var FakeDoodle = {
		hello: 'world',
		onSelection: $.noop
	};

	/**
	 * Default ED.Drawing properties
	 * @type {Object}
	 */
	var defaultProperties = {
		canvasId: 'canvasID',
		inputId: 'inputID',
		graphicsPath: '../../../assets/img',
		offsetX: 100,
		offsetY: 100,
		toImage: false,
		eye: 0,
		idSuffix: 'idSuffix',
		isEditable: true,
		scale: 1
	};

	describe('Controller', function() {

		it('should exist on the ED namespace', function() {
			expect(typeof ED.Controller).to.equal('function');
		});

		describe('Construction', function() {

			var dom;

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

				var drawing = createDrawing();
				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, FakeChecker, drawing);

				var notification = drawing.notificationArray[drawing.notificationArray.length - 1]

				expect(notification.object).to.equal(controller);
				expect(notification.methodName).to.equal('notificationHandler');
				expect(notification.notificationList).to.have.members([
					'ready',
					'doodlesLoaded',
					'doodleAdded',
					'doodleDeleted',
					'doodleSelected',
					'mousedragged',
					'parameterChanged'
				]);
			});

			it('should init additional listeners', function() {

				var listener = sinon.spy();

				var properties = $.extend({
					listenerArray: [ listener ]
				}, defaultProperties);

				var controller = new ED.Controller(properties, FakeChecker);

				expect(listener.withArgs(controller.drawing).called).to.be.true;
				expect(listener.calledWithNew()).to.be.true;
			});

			it('should init the drawing', function() {
				var drawing = createDrawing();
				var spy = sinon.spy(drawing, 'init');
				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, FakeChecker, drawing);
				expect(spy.called).to.be.true;
			});
		});

		describe('Handling drawing events', function() {

			var dom;
			var properties;
			var drawing;
			var controller;

			beforeEach(function() {
				dom = createDOM();
				drawing = createDrawing();
				properties = $.extend({
					focus: true
				}, defaultProperties);
				controller = new ED.Controller(properties, FakeChecker, drawing);
			});
			afterEach(function() {
				dom.destroy();
			});

			describe('Ready event', function() {

				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onReady');
					drawing.notify('ready');
					expect(spy.called).to.be.true;
				});

				it('should set the globalScaleFactor', function() {
					drawing.notify('ready');
					expect(controller.drawing.globalScaleFactor).to.equal(properties.scale);
				});

				describe('Loading data from input field', function() {
					it('should load data from the input field', function() {
						var spy1 = sinon.spy(controller, 'loadInputFieldData');
						var spy2 = sinon.spy(drawing, 'loadDoodles');
						var spy3 = sinon.spy(drawing, 'repaint');
						drawing.notify('ready');
						expect(spy1.calledOnce).to.be.true;
						expect(spy2.withArgs('inputID').calledOnce).to.be.true;
						expect(spy3.calledOnce).to.be.true;
					});
				});

				describe('Not loading data from input field', function() {
					it('should not attempt to load data from the input field', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'loadInputFieldData');
						drawing.notify('ready');
						expect(spy.called).to.be.false;
					});
					it('should run the OnReady commands', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'runOnReadyCommands');
						drawing.notify('ready');
						expect(spy.calledOnce).to.be.true;
					});
				});

				it('should add bindings', function() {
					var spy = sinon.spy(controller, 'addBindings');
					drawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
				});

				it('should add deleted values', function() {
					var spy = sinon.spy(controller, 'addDeletedValues');
					drawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
				});

				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
				});

				it('should focus on the canvas element', function() {
					document.body.focus();
					drawing.notify('ready');
					expect(dom.canvas.is(':focus')).to.be.true;
				});

				it('should set the isReady flag to true', function() {
					drawing.notify('ready');
					expect(controller.drawing.isReady).to.be.true;
				});
			});

			describe('doodlesLoaded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodlesLoaded');
					drawing.notify('doodlesLoaded', FakeDoodle);
					expect(spy.called).to.be.true;
				});
				it('should run the OnDoodlesLoaded commands', function() {
					var spy = sinon.spy(controller, 'runOnDoodlesLoadedCommands');
					drawing.notify('doodlesLoaded', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
			});

			describe('doodleAdded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleAdded');
					drawing.notify('doodleAdded', FakeDoodle);
					expect(spy.called).to.be.true;
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleAdded', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
			});

			describe('doodleDeleted event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleDeleted');
					drawing.notify('doodleDeleted', FakeDoodle);
					expect(spy.called).to.be.true;
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleDeleted', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
			});

			describe('doodleSelected event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleSelected');
					drawing.notify('doodleSelected', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
				it('should deselect synced doodles', function() {
					var spy = sinon.spy(controller, 'deselectSyncedDoodles');
					drawing.notify('doodleSelected', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				})
			});

			describe('mousedragged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onMousedragged');
					drawing.notify('mousedragged', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleDeleted', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
			});

			describe('parameterChanged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onParameterChanged');
					drawing.notify('parameterChanged', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
				it('should sync the eyedraws', function() {
					var spy = sinon.spy(controller, 'syncEyedraws');
					drawing.notify('parameterChanged', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('parameterChanged', FakeDoodle);
					expect(spy.calledOnce).to.be.true;
				});
			});
		});
	});
}());