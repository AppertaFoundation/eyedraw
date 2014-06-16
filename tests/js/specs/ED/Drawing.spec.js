(function DrawingTest() {

	'use strict';

	function createDrawing() {

		var dom = createDOM();

		var opts = 	{
			drawingName: 'drawing name',
			offsetX: 0,
			offsetY: 0,
			toImage: false,
			graphicsPath: '../../assets/img',
			scale: 1
		}
		return new ED.Drawing(dom.canvas[0], 1, 'idSuffix', true, opts);
	}

	describe('Drawing', function() {

		after(function() {
			$('.ed-widget').empty().remove();
		});

		describe('Scaling the drawing', function() {

			it('Should save drawing data correctly when the doodle is moved', function() {

				var drawing = createDrawing();

				drawing.addDoodle('CornealScar');

				var doodle = drawing.doodleArray[0];

				drawing.mouseDown = true;
				drawing.mode = ED.Mode.Move;
				drawing.mousemove(new ED.Point(164, 135));
				drawing.mousemove(new ED.Point(187, 124));
				drawing.mousemove(new ED.Point(250, 64));

				var data = JSON.parse(drawing.save())[0];

				var testData = {
					originX: data.originX,
					originY: data.originY,
					scaleX: data.scaleX,
					scaleY: data.scaleY
				};

				drawing.zoom(0.5);

				data = JSON.parse(drawing.save())[0];

				var zoomedData = {
					originX: data.originX,
					originY: data.originY,
					scaleX: data.scaleX,
					scaleY: data.scaleY
				};

				expect(zoomedData.scaleX).to.equal(testData.scaleX, 'scaleX should match');
				expect(zoomedData.scaleY).to.equal(testData.scaleY, 'scaleY should match');
				expect(zoomedData.originX).to.equal(testData.originX, 'originX should match');
				expect(zoomedData.originY).to.equal(testData.originY, 'originY should match');
			});

			describe('Doodle scaling', function() {
				it('Should prevent the doodle from scaling beyond the range', function() {

					var drawing = createDrawing();

					drawing.addDoodle('CornealScar');

					var doodle = drawing.doodleArray[0];

					drawing.mouseDown = true;
					drawing.mode = ED.Mode.Scale;

					// Scale the drawing to the max range
					drawing.mousemove(new ED.Point(160, 140));
					drawing.mousemove(new ED.Point(260, 40));

					// Get the calculated scale
					var data = JSON.parse(drawing.save())[0];
					var scaleX = data.scaleX;
					var scaleY = data.scaleY;

					drawing.zoom(0.5);

					// Scale the drawing again. This time, the points should be exceeding the
					// allowed range when the scale has been adjusted.
					drawing.mousemove(new ED.Point(160, 140));
					drawing.mousemove(new ED.Point(260, 40));

					data = JSON.parse(drawing.save())[0];

					var testScaleX = data.scaleX;
					var testScaleY = data.scaleY;

					expect(testScaleX).to.equal(scaleX, 'the scaleX value should be the same');
					expect(testScaleY).to.equal(scaleY, 'the scaleY value should be the same');
				});
				it('Should save drawing data correctly when the doodle scale is adjusted', function() {

					var drawing = createDrawing();

					drawing.addDoodle('CornealScar');

					var doodle = drawing.doodleArray[0];

					drawing.mouseDown = true;
					drawing.mode = ED.Mode.Scale;
					drawing.mousemove(new ED.Point(164, 135));
					drawing.mousemove(new ED.Point(187, 124));
					drawing.mousemove(new ED.Point(250, 64));

					var data = JSON.parse(drawing.save())[0];

					var testData = {
						originX: data.originX,
						originY: data.originY,
						scaleX: data.scaleX,
						scaleY: data.scaleY
					};

					drawing.zoom(0.5);

					data = JSON.parse(drawing.save())[0];

					var zoomedData = {
						originX: data.originX,
						originY: data.originY,
						scaleX: data.scaleX,
						scaleY: data.scaleY
					};

					expect(zoomedData.scaleX).to.equal(testData.scaleX, 'scaleX should match');
					expect(zoomedData.scaleY).to.equal(testData.scaleY, 'scaleY should match');
					expect(zoomedData.originX).to.equal(testData.originX, 'originX should match');
					expect(zoomedData.originY).to.equal(testData.originY, 'originY should match');
				});
			});

			it('Should constrain moving ranges', function() {

				var drawing = createDrawing();

				drawing.addDoodle('NuclearCataract');

				var doodle = drawing.doodleArray[0];
				doodle.parameterValidationArray['originX']['range'].setMinAndMax(-100, +100);

				drawing.mouseDown = true;
				drawing.mode = ED.Mode.Move;
				drawing.mousemove(new ED.Point(0, 0));
				drawing.mousemove(new ED.Point(110, 0)); // move more than 100

				var data = JSON.parse(drawing.save())[0];

				var testData = {
					originX: data.originX,
					originY: data.originY,
					scaleX: data.scaleX,
					scaleY: data.scaleY
				};

				// The range object should constrain the move.
				expect(testData.originX).to.equal(100);

				drawing.zoom(0.5);

				drawing.mousemove(new ED.Point(0, 0));
				drawing.mousemove(new ED.Point(110, 0)); // move more than 100

				data = JSON.parse(drawing.save())[0];

				var zoomedData = {
					originX: data.originX,
					originY: data.originY,
					scaleX: data.scaleX,
					scaleY: data.scaleY
				};

				expect(zoomedData.originX).to.equal(100, 'originX should match');
			});

			it('Should not affect rotation/apex values', function() {

				var drawing = createDrawing();

				drawing.addDoodle('RK');

				var doodle = drawing.doodleArray[0];
				doodle.parameterValidationArray['originX']['range'].setMinAndMax(-100, +100);

				drawing.mouseDown = true;
				drawing.mode = ED.Mode.Rotate;
				drawing.mousemove(new ED.Point(0, 0));
				drawing.mousemove(new ED.Point(110, 0));

				var data = JSON.parse(drawing.save())[0];

				var testData = {
					scaleX: data.scaleX,
					scaleY: data.scaleY,
					rotation: data.rotation,
					apexY: data.apexY
				};

				drawing.zoom(0.5);

				drawing.mousemove(new ED.Point(110, 0));

				data = JSON.parse(drawing.save())[0];

				var zoomedData = {
					scaleX: data.scaleX,
					scaleY: data.scaleY,
					rotation: data.rotation,
					apexY: data.apexY
				};

				expect(zoomedData.scaleX).to.equal(testData.scaleX, 'scaleX should match');
				expect(zoomedData.scaleY).to.equal(testData.scaleY, 'scaleY should match');
				expect(zoomedData.rotation).to.equal(testData.rotation, 'rotation should match');
				expect(zoomedData.apexY).to.equal(testData.apexY, 'apexY should match');
			});

			it('Should save drawing data correctly when the doodle is sized', function() {

				var drawing = createDrawing();

				drawing.addDoodle('Patch');

				var doodle = drawing.doodleArray[0];
				doodle.parameterValidationArray['originX']['range'].setMinAndMax(-100, +100);

				drawing.mouseDown = true;
				drawing.mode = ED.Mode.Size;
				drawing.mousemove(new ED.Point(0, 0));
				drawing.mousemove(new ED.Point(110, 0));

				var data = JSON.parse(drawing.save())[0];

				var testData = {
					originX: data.originX,
					originY: data.originY,
					width: data.width,
					height: data.height
				};

				drawing.zoom(0.5);

				data = JSON.parse(drawing.save())[0];

				var zoomedData = {
					originX: data.originX,
					originY: data.originY,
					width: data.width,
					height: data.height
				};

				expect(zoomedData.originX).to.equal(testData.originX, 'originX should match');
				expect(zoomedData.originY).to.equal(testData.originY, 'originY should match');
				expect(zoomedData.width).to.equal(testData.width, 'width should match');
				expect(zoomedData.height).to.equal(testData.height, 'height should match');
			});
		});
	});

}());
