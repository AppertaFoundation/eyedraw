(function ControllerTest() {

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

	describe('Checker', function() {


		it('should exist on the ED namespace', function() {
			expect(typeof ED.Checker).to.equal('object');
		});

		describe('EyeDraw instance management', function() {

			var canvas = $('<canvas />', {
				id: 'test1'
			}).appendTo(document.body);

			afterEach(function() {
				ED.Checker.reset();
			});

			it('Should return a drawing instance by drawingName', function() {

				var drawing1 = new ED.Drawing(canvas[0], 0, 'test1suffix', true, {
					drawingName: 'test1',
					canvasId: 'test1',
				});
				ED.Checker.register(drawing1);

				var instance = ED.Checker.getInstance('test1');

				expect(instance).to.equal(drawing1);
			})

			it('Should return a drawing instance by idSuffix', function() {

				var drawing1 = new ED.Drawing(canvas[0], 0, 'test1suffix', true, {
					drawingName: 'test1',
					canvasId: 'test1',
				});
				ED.Checker.register(drawing1);

				var instance = ED.Checker.getInstanceByIdSuffix('test1suffix');

				expect(instance).to.equal(drawing1);
			})

			// [JIRA OE-4338]
			it('Should only store one instance of a drawing instance with the same drawingName identifier', function() {

				var drawing1 = new ED.Drawing(canvas[0], 0, 'test1', true, {
					drawingName: 'test1',
					canvasId: 'test1',
				});

				ED.Checker.register(drawing1);

				var drawing2 = new ED.Drawing(canvas[0], 0, 'test1', true, {
					drawingName: 'test1',
					canvasId: 'test1',
				});

				ED.Checker.register(drawing2);

				var instance = ED.Checker.getInstance('test1');

				expect(instance).to.not.equal(drawing1);
				expect(instance).to.equal(drawing2);
			});
		});

	});
}());