(function ControllerTest() {

	/** TODO: some of the spies should be replaced with mocks so that
	the original methods are not executed. */

	'use strict';

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
			ED.Checker.reset();
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
				var controller = new ED.Controller(properties);

				expect(controller.properties).to.equal(properties);
				expect(controller.canvas).to.equal(dom.canvas[0]);
				expect(controller.input).to.equal(dom.input[0]);
				expect(controller.container instanceof jQuery).to.be.true;
				expect(controller.container[0]).to.equal(dom.container[0]);
				expect(controller.Checker).to.equal(ED.Checker);
			});

			it('should create a new Drawing instance and register it with the Checker', function() {

				var spy1 = sinon.spy(ED.Checker, 'register');

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties);

				expect(controller.drawing instanceof ED.Drawing).to.be.true;
				expect(spy1.withArgs(controller.drawing).called).to.be.true;

				spy1.reset();
			});

			it('should create new Toolbar and DoodlePopup instances', function() {

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties);

				console.log(controller);

				expect(controller.mainToolbar instanceof ED.Views.Toolbar).to.be.true;
				expect(controller.doodlePopup instanceof ED.Views.DoodlePopup).to.be.true;
				expect(controller.mainToolbar.container[0]).to.equal(dom.mainToolbar[0]);
			});

			it('should register the notification handler with the drawing instance', function() {

				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties);
				var notification = controller.drawing.notificationArray[controller.drawing.notificationArray.length - 1]

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

				var controller = new ED.Controller(properties);

				expect(listener.withArgs(controller.drawing).called).to.be.true;
				expect(listener.calledWithNew()).to.be.true;
			});

			it('should init the drawing', function() {
				var properties = $.extend({}, defaultProperties);
				var spy = sinon.spy(ED.Drawing.prototype, 'init');
				var controller = new ED.Controller(properties);
				expect(spy.called).to.be.true;
				spy.reset();
			});

			it('should not create view instances if the eyedraw is not in edit mode', function() {

				var properties = $.extend({}, defaultProperties, {
					isEditable: false
				});

				var controller = new ED.Controller(properties);

				expect(controller.mainToolbar).to.be.undefined;
				expect(controller.canvasToolbar).to.be.undefined;
				expect(controller.doodlePopup).to.be.undefined;
				expect(controller.selectedDoodle).to.be.undefined;
			});
		});

		describe('Handling drawing events', function() {

			var dom;
			var properties;
			var drawing;
			var controller;

			beforeEach(function() {
				dom = createDOM();
				properties = $.extend({
					focus: true
				}, defaultProperties);
				controller = new ED.Controller(properties, null, null, new Function(), new Function(), function(){}, new Function());
				drawing = controller.drawing;
			});
			afterEach(function() {
				dom.destroy();
			});

			describe('Ready event', function() {

				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onReady');
					drawing.notify('ready');
					expect(spy.called).to.be.true;
					spy.reset();
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
						spy1.reset();
						spy2.reset();
						spy3.reset();
					});
				});

				describe('Not loading data from input field', function() {
					it('should not attempt to load data from the input field', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'loadInputFieldData');
						drawing.notify('ready');
						expect(spy.called).to.be.false;
						spy.reset();
					});
					it('should run the OnReady commands', function() {
						dom.input.val('');
						var spy = sinon.spy(controller, 'runOnReadyCommands');
						drawing.notify('ready');
						expect(spy.calledOnce).to.be.true;
						spy.reset();
					});
				});

				it('should add bindings', function() {
					var spy = sinon.spy(controller, 'addBindings');
					drawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});

				it('should add deleted values', function() {
					var spy = sinon.spy(controller, 'addDeletedValues');
					drawing.notify('ready');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});

				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(drawing, 'save');
					drawing.notify('ready');
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
					drawing.notify('ready');
					expect(drawing.isReady).to.be.true;
				});
			});

			describe('doodlesLoaded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodlesLoaded');
					drawing.notify('doodlesLoaded');
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should run the OnDoodlesLoaded commands', function() {
					var spy = sinon.spy(controller, 'runOnDoodlesLoadedCommands');
					drawing.notify('doodlesLoaded');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleAdded event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleAdded');
					drawing.notify('doodleAdded');
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleAdded');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleDeleted event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleDeleted');
					drawing.notify('doodleDeleted');
					expect(spy.called).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleDeleted');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('doodleSelected event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onDoodleSelected');
					drawing.notify('doodleSelected');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should deselect synced doodles', function() {
					var spy = sinon.spy(controller, 'deselectSyncedDoodles');
					drawing.notify('doodleSelected');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				})
			});

			describe('mousedragged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onMousedragged');
					drawing.notify('mousedragged');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('doodleDeleted');
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});

			describe('parameterChanged event', function() {
				it('should call the correct handler', function() {
					var spy = sinon.spy(controller, 'onParameterChanged');
					drawing.notify('parameterChanged', new Function());
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should sync the eyedraws', function() {
					var spy = sinon.spy(controller, 'syncEyedraws');
					drawing.notify('parameterChanged', new Function());
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
				it('should save the drawing data to the input field', function() {
					var spy = sinon.spy(controller, 'saveDrawingToInputField');
					drawing.notify('parameterChanged', new Function());
					expect(spy.calledOnce).to.be.true;
					spy.reset();
				});
			});
		});

		describe('Loading and saving data', function() {
			it('should save drawing data to the input field', function() {

				var dom = createDOM();
				var fakeDrawing = {
					init: $.noop,
					registerForNotifications: $.noop,
					save: function() {
						return JSON.stringify({ test: 'data' })
					}
				};
				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties, null, fakeDrawing);
				var drawing = controller.drawing;
				var spy = sinon.spy(drawing, 'save');

				var data1 = JSON.stringify({ cats: 'rule' });
				dom.input.val(data1);
				controller.saveDrawingToInputField();

				expect(spy.calledOnce).to.be.true;
				expect(dom.input.val()).to.equal(JSON.stringify({ test: 'data' }));

				spy.reset();
				dom.destroy();
			});
			it('should load data from the input field', function() {

				var dom = createDOM();
				var properties = $.extend({}, defaultProperties);
				var controller = new ED.Controller(properties);
				var drawing = controller.drawing;
				var spy = sinon.spy(drawing, 'loadDoodles');

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
					var controller = new ED.Controller(properties);
					var drawing = controller.drawing;
					var spy = sinon.spy(drawing, 'addBindings');
					drawing.notify('ready');
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
				// WARNING: this should throw an eyedraw error
				var bindingArray = {
					'EYEDRAW_ID_!': {
						pupilSize: {
							id: "ed-field-1",
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
					var controller = new ED.Controller(properties);
					var drawing = controller.drawing;
					var spy = sinon.spy(drawing, 'addDeleteValues');
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
				var controller1 = new ED.Controller(prop1);
				var drawing1 = controller1.drawing;

				var prop2 = $.extend({}, properties, {
					idSuffix: 'EYEDRAW_ID_2'
				});
				var controller2 = new ED.Controller(prop2);
				var drawing2 = controller2.drawing;

				var spy1 = sinon.spy(drawing1, 'deselectDoodles');
				var spy2 = sinon.spy(drawing2, 'deselectDoodles');

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

				console.log(props);

				var dom = createDOM();
				var controller = new ED.Controller(props);

				var drawing = controller.drawing;

				var spy1 = sinon.spy(drawing, 'addDoodle');
				var spy2 = sinon.spy(drawing, 'deselectDoodles');

				controller.runOnReadyCommands();

				expect(spy1.withArgs('AntSeg').calledOnce).to.be.true;

				expect(spy2.called).to.be.true;
				spy1.reset();
				spy2.reset();
				dom.destroy();
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

				var dom = createDOM();
				var controller = new ED.Controller(props);
				var drawing = controller.drawing;

				var spy1 = sinon.spy(drawing, 'addDoodle');
				var spy2 = sinon.spy(drawing, 'deselectDoodles');

				controller.runOnDoodlesLoadedCommands();

				expect(spy1.withArgs('AntSeg').calledOnce).to.be.true;

				expect(spy2.called).to.be.true;

				spy1.reset();
				spy2.reset();
				dom.destroy();
			});

			it('should return an eyedraw instance', function() {

				var dom = createDOM();
				var spy = sinon.spy(ED.Checker, 'getInstance');
				var props = $.extend({}, defaultProperties, {});
				var controller = new ED.Controller(props);
				var drawing = controller.drawing;
				var instance = controller.getEyeDrawInstance('EYEDRAW_ID');
				expect(instance).to.equal(drawing);
				spy.reset();
				dom.destroy();
			})
		});

		describe('Syncing', function() {
			it('should sync eyedraws', function() {

				var options1 = {
					idSuffix: 'EYEDRAW_ID_1',
					onReadyCommandArray: [
						[
							"addDoodle",
							[
								"PhakoIncision"
							]
						]
					]
				};
				var dom = createDOM();
				var properties1 = $.extend({}, defaultProperties, options1);
				var controller1 = new ED.Controller(properties1);
				var drawing1 = controller1.drawing;
				controller1.runOnReadyCommands();

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
				var controller2 = new ED.Controller(properties2);
				var drawing2 = controller2.drawing;

				var changedObject = {
					doodle: {
						className: 'Surgeon'
					},
					oldValue: 4.71238898038469,
					parameter: "rotation",
					value: 4.71238898038469
				};

				var spy1 = sinon.spy(drawing1, 'firstDoodleOfClass');
				var spy2 = sinon.spy(controller2, 'syncDoodleParameters');
				var spy3 = sinon.spy(drawing1, 'repaint');

				controller2.syncEyedraws(changedObject);

				var parameterArray = ['rotation'];
				var changedParam = changedObject;
				var masterDoodle = changedObject.doodle;
				var slaveDoodle = drawing1.selectedDoodle;
				var slaveDrawing = drawing1;

				expect(spy1.withArgs('PhakoIncision').calledOnce).to.be.true;
				expect(spy2.withArgs(parameterArray, changedParam, masterDoodle, slaveDoodle, slaveDrawing).calledOnce).to.be.true;
				expect(spy3.calledOnce).to.be.true;

				spy1.reset();
				spy2.reset();
				spy3.reset();
				dom.destroy();
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
		});
	});
}());