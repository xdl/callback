define(['views/base', 'docs', 'text!templates/api.html'], function(BaseView, docs, ApiTemplate) {

	var Api = BaseView.extend({
		initialize: function() {
			Backbone.on('showAPI', this.showWindow, this);

			var _this = this;
			_this.documentation = document.createDocumentFragment();
			_this.documentation.id = 'documentation';

			var wrapper = document.createElement("div");
			wrapper.id = 'documentation';

			_this.documentation.appendChild(wrapper);

			var frags;

			for (var key in docs) {
				if (docs.hasOwnProperty(key)) {
					//_this.frag.appendChild(docs[key].examples);
					frags = document.createElement('div');
					frags.innerHTML = '<hr/>' + docs[key].syntax + '<br/>' + docs[key].description + '<br/>' +  docs[key].examples;
					//frags.id = 'hi';

					wrapper.appendChild(frags);
				}
			}

		},
		destroy: function() {
			Backbone.off('showAPI', this.showWindow, this);
		},
		events: {
			'click a#closeapi': 'closeWindow'
		},
		showWindow: function() {
			this.$el.append(this.documentation);
			this.$el.show();
			document.addEventListener
		},
		closeWindow:function(e) {
			e.preventDefault();
			this.$el.hide();
		},
		template: _.template(ApiTemplate),
		documentation: undefined,
		render: function() {
			this.$el.html(this.template);
			this.$el.hide();
		}
	});

	return Api;

});
