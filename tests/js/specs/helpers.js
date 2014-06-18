function createDOM() {

	var container = $('<div />', {
		'class': 'ed-widget'
	}).appendTo(document.body);

	var canvas = $('<canvas />', {
		id: 'canvasID',
		'class': 'ed-canvas-edit',
		tabindex: 1,
	}).attr({
		width: 300,
		height: 300
	}).appendTo(container);

	var input = $('<input />', {
		type: 'hidden',
		id: 'inputID',
		value: JSON.stringify({ test: 'testing' })
	}).appendTo(container);

	var mainToolbar = $('<div />', {
		'class': 'ed-toolbar-panel ed-main-toolbar'
	}).appendTo(container);

	var canvasToolbar = $('<div />', {
		'class': 'ed-toolbar-panel ed-canvas-toolbar'
	}).appendTo(container);

	var doodlePopup = $('<div />', {
		'class': 'ed-doodle-popup'
	}).appendTo(container);

	return {
		container: container,
		canvas: canvas,
		input: input,
		mainToolbar: mainToolbar,
		canvasToolbar: canvasToolbar,
		destroy: function destroy() {
			container.empty().remove();
		}
	};
}