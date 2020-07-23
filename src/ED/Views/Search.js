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

		that = this;

		this.bindEvents();
	}

	SearchBar.prototype = Object.create(ED.View.prototype);

	SearchBar.prototype.constructor = SearchBar;

	function createListItem(text, icon, callback) {
		let item = $(document.createElement('li'));

		var aTag = $(document.createElement('a'));
		aTag.html("");
		aTag.addClass('ed-button');
		aTag.css('width', '100%');
		aTag.css('line-height', '32px');
		aTag.css('text-decoration', 'none');

		icon.css('float', 'right');

		var txtSpan = document.createElement('span');
		txtSpan.innerText = text;
		txtSpan.style.float = 'left';
		$(txtSpan).css('width', '80%');
		$(txtSpan).css('text-overflow', 'ellipsis');
		$(txtSpan).css('white-space', 'nowrap');
		$(txtSpan).css('overflow-x', 'hidden');

		var clearDiv = document.createElement('div');
		clearDiv.style.clear = 'both';
		aTag.append(txtSpan);
		aTag.append(icon);
		aTag.append(clearDiv);

		aTag.off('click').on('click', callback);

		item.append(aTag);

		return item;
	};

	SearchBar.prototype.bindEvents = function () {
		tb.bindEvents()
		var that = this;
		var searchResult = this.container.siblings();
		searchResult.parent().css('position', 'relative');
		searchResult.css('list-style-type', 'none');
		searchResult.css('padding', '0');
		searchResult.css('margin', '0');
		searchResult.css('width', '100%');
		searchResult.css('overflow-y', 'auto');
		searchResult.css('position', 'absolute');

		var toolbar = this.getToolbar();
		$(this.input).off('keyup').on('keyup', function () {
			searchResult.empty();

			if (this.value.length <= 0) {
				searchResult.hide();
				searchResult.html("");
			} else {
				searchResult.show();

				let targetCloud = that.tagCloud;

				$.ajax({
					url: "/OphCiExamination/Default/EDTagSearch",
					type: 'POST',
					async: false,
					cache: false,
					timeout: 30000,
					data: {
						YII_CSRF_TOKEN: YII_CSRF_TOKEN,
						EDSearchTerm: this.value,
					},
					error: function (request, error) {
						console.log(request);
						console.log(error);
					},
					success: function (resp) {
						JSON.parse(resp).forEach(function (item, index) {
							searchResult.append(
								createListItem(
									item['text'],
									$(document.createElement('span')).text('tag'),
									function () {
										targetCloud.AddTag(item['pk_id'], item['text'], item['snomed_code']);
										that.drawing.notify('tagAdded', item['text']);
										searchResult.empty();
										searchResult.hide();
										$(that.input).val("");
									}));
						});
					},
				});

				var searchList = toolbar.filter((item, index) => {
					var txt = $(item).find('span.label').text().toLowerCase();
					if (txt.includes(this.value.toLowerCase())) {
						return item;
					}
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
		});
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
