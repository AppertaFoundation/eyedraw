var ED = ED || {};
ED.Views = ED.Views || {};

ED.Views.SearchBar = (function () {
	var tb;

	function SearchBar(drawing, container, doodlePopup, tagCloud) {
		tb = new ED.Views.Toolbar(drawing, container)
		ED.View.apply(this, arguments);

		this.drawing = drawing;
		this.container = container;
		this.tagCloud = tagCloud;
		this.input = this.container[0];
		this.doodlePopup = doodlePopup;
		this.searchRequest = null;

		that = this;

		this.bindEvents();
	}

	SearchBar.prototype = Object.create(ED.View.prototype);

	SearchBar.prototype.constructor = SearchBar;

	function createListItem(text, icon, callback) {
		let item = $(document.createElement('li'));

		var aTag = $(document.createElement('a'));
		aTag.html("");
		aTag.addClass('add-ed-doodle');

		var txtSpan = document.createElement('span');
		txtSpan.innerText = text;

		aTag.append(txtSpan);
		aTag.append(icon);

		aTag.off('click').on('click', callback);

		item.append(aTag);

		return item;
	};

	SearchBar.prototype.bindEvents = function () {
		tb.bindEvents()
		var that = this;
		var searchResult = this.container.siblings();
		searchResult.addClass('oe-autocomplete');

		var searchTimer = null;

		var toolbar = this.getToolbar();
		$(this.input).off('keyup').on('keyup', function () {
			if(searchTimer){
				searchTimer = null;
			}

			let input = this;

			searchTimer = setTimeout(function() {
				searchResult.empty();

				if (input.value.length <= 0) {
					searchResult.hide();
					searchResult.html("");
				} else {
					searchResult.show();

					let targetCloud = that.tagCloud;

					if(that.searchRequest !== null){
						that.searchRequest.abort();
					}

					that.searchRequest = $.getJSON("/OphCiExamination/Default/EDTagSearch", {
						YII_CSRF_TOKEN: YII_CSRF_TOKEN,
						EDSearchTerm: input.value,
					}, function (resp) {
						resp.forEach(function (item, index) {
							searchResult.append(
								createListItem(
									item['text'],
									$(document.createElement('span')),
									function () {
										targetCloud.AddTag(item['pk_id'], item['text'], item['snomed_code']);
										that.drawing.notify('tagAdded', item['text']);
										searchResult.empty();
										searchResult.hide();
										$(that.input).val("");
									}));
						});
					});

					var searchList = toolbar.filter((item, index) => {
						var txt = $(item).find('span.label').text().toLowerCase();
						return txt.includes(input.value.toLowerCase());
					});

					searchList.forEach(item => {
						let txt = $(item).find('span.label').text();
						let arg = $(item).find('a').data('arg');
						let icon = $(document.createElement('span')).addClass('icon-ed-' + arg);

						searchResult.append(
							createListItem(
								txt,
								icon,
								function () {
									that.drawing["addDoodle"](arg);
									searchResult.empty();
									searchResult.hide();
									$(that.input).val("");
								}));
					});
				}
			}, 500);
		}
		);
	};
	SearchBar.prototype.getToolbar = function () {
		var toolbar = [];

		this.container.prevObject.find('.ed2-toolbar ul li').each((index, item) => {
			var inner_ul = item.getElementsByTagName('ul')
			if (inner_ul.length <= 0) {
				toolbar.push(item);
			}
		});
		return toolbar;
	};
	return SearchBar;
}());
