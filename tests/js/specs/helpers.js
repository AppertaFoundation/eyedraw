function createDOM() {

	var container = $('<div />', {
		'class': 'ed2-widget'
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
		'class': 'ed2-toolbar-panel ed2-main-toolbar'
	}).appendTo(container);

	var canvasToolbar = $('<div />', {
		'class': 'ed2-toolbar-panel ed2-canvas-toolbar'
	}).appendTo(container);

	var doodlePopup = $('<div />', {
		'class': 'ed2-doodle-popup'
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