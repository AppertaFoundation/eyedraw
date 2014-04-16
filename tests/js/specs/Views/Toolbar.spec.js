describe('Toolbar', function() {

	var createDrawing = function() {
		return {
			notificationArray: [],
			registerForNotifications: function() {
				ED.Drawing.prototype.registerForNotifications.apply(this, arguments);
			}
		};
	};

	var createContainer = function() {
		var container = document.createElement('div');
		var child = document.createElement('div');
		child.className = 'eyedraw-button';
		container.appendChild(child);
		return container;
	};

	function createToolbar() {
		var drawing = createDrawing();
		var container = createContainer();
		var toolbar = new ED.Views.Toolbar(drawing, container);
		return {
			drawing: drawing,
			container: container,
			toolbar: toolbar
		};
	}

	function initToolbar(toolbar) {
		var notification = toolbar.drawing.notificationArray[0];
		var handler = notification.object[notification.methodName];
		var fakeNotification = {
			eventName: 'ready'
		};
		handler.call(notification.object, fakeNotification);
	}

	it('should exist within the ED.Views namespace', function() {
		expect(typeof ED.Views).to.equal('object');
		expect(typeof ED.Views.Toolbar).to.equal('function');
	});

	describe('Construction', function() {

		var o = createToolbar();

		it('should inherit from the eventemitter2 prototype', function() {
			expect(o.toolbar instanceof EventEmitter2).to.be.true;
			expect(ED.Views.Toolbar.prototype.constructor).to.equal(ED.Views.Toolbar);
		});

		it('should set expected properties on construction', function() {
			expect(o.toolbar.drawing).to.equal(o.drawing);
			expect(o.toolbar.container instanceof jQuery).to.be.true;
			expect(o.toolbar.container[0]).to.equal(o.container);
		});

		it('should register the notification handler with the drawing instance', function() {
			var notification = o.drawing.notificationArray[0];
			var handler = notification.object[notification.methodName];
			expect(handler).to.equal(o.toolbar.notificationHandler);
		});
	});

	describe('Handling drawing events', function() {

		describe('Ready event', function() {

			it('should call the init method', function() {
				var o = createToolbar();
				var spy = sinon.spy(o.toolbar, 'init');
				initToolbar(o.toolbar);
				expect(spy.calledOnce).to.be.true;
				spy.restore();
			});

			it('should bind events', function() {
				var spy = sinon.spy(ED.Views.Toolbar.prototype, 'onButtonClick');

				var o = createToolbar();
				initToolbar(o.toolbar);

				var button = $(o.container).find('.eyedraw-button');
				button.trigger('click');
				expect(spy.calledOnce).to.be.true;
			});
		});
	});
});