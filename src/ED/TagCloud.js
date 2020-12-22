var ED = ED || {};

/**
* @property Tag[]
* @property Drawing
* @property isEditable Boolean
*/
ED.TagCloud = (function() {
	'use strict';

	function TagCloud(drawing, container, isEditable, side) {
		this.drawing = drawing;
		this.container = container;
		this.TagArray = [];
		this.isEditable = isEditable;
		this.side = side;
	}

	TagCloud.prototype.constructor = TagCloud;

	TagCloud.prototype.loadTags = function(_id) {

		// Get element containing JSON string
		var sourceElement = document.getElementById(_id);

		// If it exists and contains something, load it
		if (sourceElement && sourceElement.value.length > 0) {
			var tagSet = window.JSON.parse(sourceElement.value);

			//remove tags from doodle loading
			tagSet = tagSet.filter(tag => tag.hasOwnProperty('tags'));

			if(tagSet[0] !== undefined)
			{
				let tagList = tagSet[0].tags;

				tagList.forEach(tag => {
					let tagObject = JSON.parse(tag);
					this.AddTag(tagObject.pk_id, tagObject.text, tagObject.snomed_code);
				});
			}
		}
	};

	TagCloud.prototype.AddTag = function(pk_id, text, snomed_code) {
		//Add tag to array
		let tag = document.createElement('li');
		$(tag).addClass('ed-tag');
		$(tag).attr('pk_id', pk_id);
		$(tag).attr('snomed_code', snomed_code);

		let textSpan = document.createElement('span');
		$(textSpan).addClass('text');
		$(textSpan).text(text);
		$(tag).append(textSpan);

		if(this.isEditable)
		{
			let parentCloud = this;

			let buttonSpan = document.createElement('span');
			$(buttonSpan).addClass('multi-select-remove remove-one 5');

			let button = document.createElement('i');
			$(button).addClass('oe-i remove-circle small');
			$(button).click(function() {
				$(tag).remove();
				parentCloud.RemoveTagByText(text);
			});

			$(buttonSpan).append(button);
			$(tag).append(buttonSpan);
		}

		this.TagArray.push({pk_id: pk_id, text: text, snomed_code: snomed_code});
		let list = this.container.find('.no-doodles');

		list.append(tag);
	};

	TagCloud.prototype.RemoveTagByText = function(text) {
		//Remove the tag from the array
		_.remove(this.TagArray, function(item) {
				return text === item.text;
		});

		this.drawing.notify('tagDeleted', text);
	};

	return TagCloud;
}());