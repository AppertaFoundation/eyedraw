(function ControllerTest() {

	/** TODO: some of the spies should be replaced with mocks so that
	the original methods are not executed. */

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
	function createDrawing(properties) {
		return $.extend({}, {
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
			addBindings: $.noop,
			addDeleteValues: $.noop,
			addDoodle: $.noop,
			save: function() {
				var data = JSON.stringify({ test: 'data' });
				return data;
			},
			deselectDoodles: $.noop,
			firstDoodleOfClass: $.noop
		}, properties);
	}

	/**
	 * A mock ED.Checker object
	 * @type {Object}
	 */
	var MockChecker = {
		register: $.noop
	};

	/**
	 * A mock doodle.
	 * @type {Object}
	 */
	var MockDoodle = {
		onSelection: $.noop
	};

	/**
	 * Default ED.Drawing properties
	 * @type {Object}
	 */
	var defaultProperties = {
		canvasId: 'canvasID',
		inputId: 'inputID',
		graphicsPath: '../../../../../assets/img',
		offsetX: 100,
		offsetY: 100,
		toImage: false,
		eye: 0,
		idSuffix: 'EYEDRAW_ID',
		isEditable: true,
		scale: 1,
		deleteValueArray: {},
		bindingArray: {},
		syncArray: {}
	};

	describe('Controller', function() {

		afterEach(function() {
			ED.resetInstances();
		});

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
				var controller = new ED.Controller(properties, MockChecker, null, null, MockDoodle);

				expect(controller.properties).to.equal(properties);
				expect(controller.canvas).to.equal(dom.canvas[0]);
				expect(controller.input).to.equal(dom.input[0]);
				expect(controller.container instanceof jQuery).to.be.true;
				expect(controller.container[0]).to.equal(dom.container[0]);
				expect(controller.Checker).to.equal(MockChecker);
			});

			it('should create a new Drawing instance, register it with the Checker and save the instance', function() {

				var spy1 = sinon.spy(MockChecker, 'register');
				var spy2 = sinon.spy(ED, 'setInstance');

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, MockChecker, null, null, MockDoodle);

				expect(controller.drawing instanceof ED.Drawing).to.be.true;
				expect(spy1.withArgs(controller.drawing).called).to.be.true;
				expect(spy2.withArgs(controller.drawing).called).to.be.true;

				spy1.reset();
				spy2.reset();
			});

			it('should create new Toolbar and DoodlePopup instances', function() {

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, MockChecker, null, null, null);

				expect(controller.toolbar instanceof ED.Views.Toolbar).to.be.true;
				expect(controller.doodlePopup instanceof ED.Views.DoodlePopup).to.be.true;
				expect(controller.toolbar.container[0]).to.equal(dom.toolbar[0]);
			});

			it('should register the notification handler with the drawing instance', function() {

				var properties = $.extend({}, defaultProperties);
				var mockDrawing = createDrawing(properties);
				var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);

				var notification = mockDrawing.notificationArray[mockDrawing.notificationArray.length - 1]

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

				var controller = new ED.Controller(properties, MockChecker, null, null, MockDoodle);

				expect(listener.withArgs(controller.drawing).called).to.be.true;
				expect(listener.calledWithNew()).to.be.true;
			});

			it('should init the drawing', function() {
				var properties = $.extend({}, defaultProperties);
				var mockDrawing = createDrawing(properties);
				var spy = sinon.spy(mockDrawing, 'init');
				var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);
				expect(spy.called).to.be.true;
				spy.reset();
			});
		});

		describe('Handling drawing events', function() {

			var dom;
			var properties;
			var mockDrawing;
			var controller;

			beforeEach(function() {
				dom = createDOM();
				properties = $.extend({
					focus: true
				}, defaultProperties);
				mockDrawing = createDrawing(properties);
				controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);
			});
			afterEach(function() {
				dom.destroy();
			});

			describe('Ready event', function() {

				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onReady');
					mockDrawing.notify('ready');
					expect(spy.called).to.be.true;
					spy.reset();
				});

				it('should set the globalScaleFactor', function() {
					mockDrawing.notify('ready');
					expect(controller.drawing.globalScaleFactor).to.equal(properties.scale);
				});

				describe('Loading data from input field', function() {
					it('should load data from the input field', function() {
						var spy1 = sinon.spy(controller, 'loadInputFieldData');
						var spy2 = sinon.spy(mockDrawing, 'loadDoodles');
						var spy3 = sinon.spy(mockDrawing, 'repaint');
						mockDrawing.notify('ready');
						expect(spy1.calledOnce).to.be.true;
						expect(spy2.withArgs('inputID').calledOnce).to.be.true;
						expect(spy3.calledOnce).to.be.true;
						spy1.reset();
						spy2.reset();
						spy3.reset();
					});
				});

				describe('Not loading data from input field', function() {
					it('should not attempt to load data from the input field', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'loadInputFieldData');
						mockDrawing.notify('ready');
						expect(spy.called).to.be.false;
						spy.reset();
					});
					it('should run the OnReady commands', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'runOnReadyCommands');
						mockDrawing.notify('ready');
						expect(spy.calledOnce).to.be.true;
						spy.reset();
					});
				});

				it('should add bindings', function() {
					var spy = sinon.spy(controller, 'addBindings');
					mockDrawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});

				it('should add deleted values', function() {
					var spy = sinon.spy(controller, 'addDeletedValues');
					mockDrawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});

				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					mockDrawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});

				/* FIXME */
				/*
				it('should focus on the canvas element', function() {
					document.body.focus();
					mockDrawing.notify('ready');
					expect(dom.canvas.is(':focus')).to.be.true;
				});
				*/

				it('should set the isReady flag to true', function() {
					mockDrawing.notify('ready');
					expect(controller.drawing.isReady).to.be.true;
				});
			});

			describe('doodlesLoaded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodlesLoaded');
					mockDrawing.notify('doodlesLoaded', MockDoodle);
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should run the OnDoodlesLoaded commands', function() {
					var spy = sinon.spy(controller, 'runOnDoodlesLoadedCommands');
					mockDrawing.notify('doodlesLoaded', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleAdded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleAdded');
					mockDrawing.notify('doodleAdded', MockDoodle);
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					mockDrawing.notify('doodleAdded', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleDeleted event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleDeleted');
					mockDrawing.notify('doodleDeleted', MockDoodle);
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					mockDrawing.notify('doodleDeleted', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleSelected event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleSelected');
					mockDrawing.notify('doodleSelected', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should deselect synced doodles', function() {
					var spy = sinon.spy(controller, 'deselectSyncedDoodles');
					mockDrawing.notify('doodleSelected', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				})
			});

			describe('mousedragged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onMousedragged');
					mockDrawing.notify('mousedragged', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					mockDrawing.notify('doodleDeleted', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('parameterChanged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onParameterChanged');
					mockDrawing.notify('parameterChanged', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should sync the eyedraws', function() {
					var spy = sinon.spy(controller, 'syncEyedraws');
					mockDrawing.notify('parameterChanged', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					mockDrawing.notify('parameterChanged', MockDoodle);
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});
		});

		describe('Loading and saving data', function() {
			it('should save drawing data to the input field', function() {

				var dom = createDOM();
				var properties = $.extend({}, defaultProperties);
				var mockDrawing = createDrawing(properties);
				var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);

				var spy1 = sinon.spy(controller, 'hasInputFieldData');
				var spy2 = sinon.spy(mockDrawing, 'save');

				// First, lets clear the input field value to test if saving
				// the data is prevented if the input value is null.

				dom.input.val('');
				controller.saveDrawingToInputField();

				expect(spy1.calledOnce).to.be.true;
				expect(spy2.called).to.be.false;

				// Now let's test that the input field value is updated, only if
				// the input field already has data.

				var data1 = JSON.stringify({ cats: 'rule' });
				dom.input.val(data1);

				controller.saveDrawingToInputField();

				expect(spy1.calledTwice).to.be.true;
				expect(spy2.called).to.be.true;
				expect(dom.input.val()).to.equal(JSON.stringify({ test: 'data' }));

				spy1.reset();
				spy2.reset();
				dom.destroy();
			});
			it('should load data from the input field', function() {

				var dom = createDOM();
				var properties = $.extend({}, defaultProperties);
				var mockDrawing = createDrawing(properties);
				var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);
				var spy = sinon.spy(mockDrawing, 'loadDoodles');

				controller.loadInputFieldData();

				expect(spy.withArgs(dom.input[0].id).called).to.be.true;
				dom.destroy();
				spy.reset();
			});
		});

		describe('Drawing setup', function() {

			it('should add drawing bindings', function() {

				var dom;

				function test(props) {
					dom = createDOM();
					var properties = $.extend({}, defaultProperties, props);
					var mockDrawing = createDrawing(properties);
					var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);
					var spy = sinon.spy(mockDrawing, 'addBindings');
					mockDrawing.notify('ready');
					return spy;
				}

				// Test not calling the 'addBindings' method if expected object is not an object.
				var spy1 = test({
					idSuffix: 'EYEDRAW_ID_1',
					bindingArray: false
				});

				expect(spy1.called).to.be.false;
				spy1.reset();
				dom.destroy();

				// Test calling the 'addBindings' method if expected object is an actual object.
				var bindingArray = {
					AntSeg: {
						pupilSize: {
							id: "eyedraw-field-1",
							attribute: "data-value"
						},
						pxe: {
							id: "field-option-1"
						}
					}
				};
				var spy2 = test({
					idSuffix: 'EYEDRAW_ID_2',
					bindingArray: bindingArray
				});
				expect(spy2.withArgs(bindingArray).calledOnce).to.be.true;
				spy2.reset();
				dom.destroy();
			});

			it('should add deleted values', function() {

				var dom;

				function test(props) {
					dom = createDOM();
					var properties = $.extend({}, defaultProperties, props);
					var mockDrawing = createDrawing(properties);
					var controller = new ED.Controller(properties, MockChecker, mockDrawing, null, MockDoodle);
					var spy = sinon.spy(mockDrawing, 'addDeleteValues');
					controller.addDeletedValues();
					return spy;
				}

				// Test not calling the 'addBindings' method if expected object is not an object.
				var spy1 = test({
					idSuffix: 'EYEDRAW_ID_1',
					deleteValueArray: false
				});
				expect(spy1.called).to.be.false;
				spy1.reset();
				dom.destroy();

				// Test calling the 'addBindings' method if expected object is an actual object.
				var deleteValueArray = {
					Element_OphCiExamination_AnteriorSegment_right_nuclear_id: '',
					Element_OphCiExamination_AnteriorSegment_right_cortical_id: ''
				};
				var spy2 = test({
					idSuffix: 'EYEDRAW_ID_2',
					deleteValueArray: deleteValueArray
				});
				expect(spy2.withArgs(deleteValueArray).calledOnce).to.be.true;
				spy2.reset();
				dom.destroy();
			});

			it('should de-select synced doodles', function() {

				var options = {
					syncArray: {
						'EYEDRAW_ID_1': {
							Cataract: {
								Surgeon: {
									PhakoIncision: {
										parameters: ['rotation']
									}
								}
							}
						},
						'EYEDRAW_ID_2': {
							Cataract: {
								Surgeon: {
									PhakoIncision: {
										parameters: ['rotation']
									}
								}
							}
						}
					}
				};

				var dom = createDOM();
				var properties = $.extend({}, defaultProperties, options);

				var prop1 = $.extend({}, properties, {
					idSuffix: 'EYEDRAW_ID_1'
				});
				var mockDrawing1 = createDrawing(prop1);
				var controller1 = new ED.Controller(prop1, null, mockDrawing1, null, MockDoodle);

				var prop2 = $.extend({}, properties, {
					idSuffix: 'EYEDRAW_ID_2'
				});
				var mockDrawing2 = createDrawing(prop2);
				var controller2 = new ED.Controller(prop2, null, mockDrawing2, null, MockDoodle);

				var spy1 = sinon.spy(mockDrawing1, 'deselectDoodles');
				var spy2 = sinon.spy(mockDrawing2, 'deselectDoodles');

				// Here we test that both drawing instances are called.
				controller1.deselectSyncedDoodles();
				expect(spy1.calledOnce).to.be.true;
				expect(spy2.calledOnce).to.be.true;
				dom.destroy();
				spy1.reset();
				spy2.reset();
			});

			it('should run On Ready commands', function() {

				var props = $.extend({}, defaultProperties, {
					onReadyCommandArray: [
						[
							"addDoodle",
							[
								"AntSeg"
							]
						],
						[
							"deselectDoodles",
							[]
						]
					],
				});

				var mockDrawing = createDrawing(props);
				var controller = new ED.Controller(props, MockChecker, mockDrawing, null, MockDoodle);

				var spy1 = sinon.spy(mockDrawing, 'addDoodle');
				var spy2 = sinon.spy(mockDrawing, 'deselectDoodles');

				controller.runOnReadyCommands();

				expect(spy1.withArgs('AntSeg').calledOnce).to.be.true;
				expect(spy2.calledOnce).to.be.true;
				spy1.reset();
				spy2.reset();
			});

			it('should run On Doodles Loaded commands', function() {

				var props = $.extend({}, defaultProperties, {
					onDoodlesLoadedCommandArray: [
						[
							"addDoodle",
							[
								"AntSeg"
							]
						],
						[
							"deselectDoodles",
							[]
						]
					],
				});

				var mockDrawing = createDrawing(props);
				var controller = new ED.Controller(props, MockChecker, mockDrawing, null, MockDoodle);

				var spy1 = sinon.spy(mockDrawing, 'addDoodle');
				var spy2 = sinon.spy(mockDrawing, 'deselectDoodles');

				controller.runOnDoodlesLoadedCommands();

				expect(spy1.withArgs('AntSeg').calledOnce).to.be.true;
				expect(spy2.calledOnce).to.be.true;

				spy1.reset();
				spy2.reset();
			});

			it('should return an eyedraw instance', function() {
				var spy = sinon.spy(ED, 'getInstance');
				var props = $.extend({}, defaultProperties, {});
				var mockDrawing = createDrawing(props);
				var controller = new ED.Controller(props, MockChecker, mockDrawing, null, MockDoodle);
				var instance = controller.getEyeDrawInstance('EYEDRAW_ID');
				expect(instance).to.equal(mockDrawing);
				spy.reset();
			})
		});

		describe('Syncing', function() {
			it('should sync eyedraws', function() {

				var options1 = {
					idSuffix: 'EYEDRAW_ID_1'
				};
				var properties1 = $.extend({}, defaultProperties, options1);
				var mockDrawing1 = createDrawing(properties1);
				var doodle1 = {
					foo: 'bar'
				};
				mockDrawing1.firstDoodleOfClass = function() {
					return doodle1;
				};
				var controller1 = new ED.Controller(properties1, MockChecker, mockDrawing1, null, MockDoodle);

				var options2 = {
					idSuffix: 'EYEDRAW_ID_2',
					syncArray: {
						'EYEDRAW_ID_1': {
							Surgeon: {
								PhakoIncision: {
									parameters: ['rotation']
								}
							}
						}
					},
				};

				var properties2 = $.extend({}, defaultProperties, options2);
				var mockDrawing2 = createDrawing(properties2);
				var controller2 = new ED.Controller(properties2, MockChecker, mockDrawing2, null, MockDoodle);

				var changedObject = {
					doodle: {
						className: 'Surgeon'
					},
					oldValue: 4.71238898038469,
					parameter: "rotation",
					value: 4.71238898038469
				};

				var spy1 = sinon.spy(mockDrawing1, 'firstDoodleOfClass');
				var spy2 = sinon.spy(controller2, 'syncDoodleParameters');
				var spy3 = sinon.spy(mockDrawing1, 'repaint');

				controller2.syncEyedraws(changedObject);

				var parameterArray = ['rotation'];
				var changedParam = changedObject;
				var masterDoodle = changedObject.doodle;
				var slaveDoodle = doodle1;
				var slaveDrawing = mockDrawing1;

				expect(spy1.withArgs('PhakoIncision').calledOnce).to.be.true;
				expect(spy2.withArgs(parameterArray, changedParam, masterDoodle, slaveDoodle, slaveDrawing).calledOnce).to.be.true;
				expect(spy3.calledOnce).to.be.true;

				spy1.reset();
				spy2.reset();
				spy3.reset();
			});

			it('should sync doodle parameters', function() {

				var parameterArray = ['rotation'];
				var changedParam = {
					doodle: {
						className: 'Surgeon'
					},
					oldValue: 4.21238898038469,
					parameter: "rotation",
					value: 4.71238898038469
				};
				var masterDoodle = {
					rotation: 2
				};
				var slaveDoodle = {
					rotation: 1,
					setSimpleParameter: $.noop,
					updateDependentParameters: $.noop
				};
				var slaveDrawing = {
					updateBindings: $.noop
				};

				var spy1 = sinon.spy(slaveDoodle, 'setSimpleParameter');
				var spy2 = sinon.spy(slaveDoodle, 'updateDependentParameters');
				var spy3 = sinon.spy(slaveDrawing, 'updateBindings');

				ED.Controller.prototype.syncDoodleParameters(parameterArray, changedParam, masterDoodle, slaveDoodle, slaveDrawing);

				expect(spy1.withArgs('rotation', 1.5).calledOnce).to.be.true;
				expect(spy2.withArgs('rotation').calledOnce).to.be.true;
				expect(spy3.withArgs(slaveDoodle).calledOnce).to.be.true;

				spy1.reset();
				spy2.reset();
				spy3.reset();
			});
		})
	});
}());