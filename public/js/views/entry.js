define(['views/base'], function(BaseView) {
	var EntryView = BaseView.extend({
		tagName: 'div',
		initialize: function() {
			this.listenTo(this.model, 'change:visibility', this.toggle);
		},
		toggle: function() {
			if (this.model.get('visibility') == true) {
				this.showDetails();
			} else {
				this.hideDetails();
			}
		},
		showDetails: function() {
			this.$('.details').show();
			Backbone.trigger('hint_on');
			$(document).bind('keydown', {_this:this}, this.unbindAndHide);
			$(document).bind('mousedown', {_this:this}, this.unbindAndHide);
		},
		hideDetails:function() {
			this.$('.details').hide();
		},
		unbindAndHide: function(e) {
			Backbone.trigger('hint_off');
			console.log('e:', e);
			var _this = e.data._this;
			$(document).unbind('keydown', _this.unbindAndHide);
			$(document).unbind('mousedown', _this.unbindAndHide);
			_this.model.set('visibility', false);
		},
		events: {},
		//template: _template(...) - gets declared in Task and User
		render: function() {
			var done_date;
			var deg_date = new Date(this.model.get('delegation_date')).toUTCString();
			this.model.set('delegation_date', deg_date);

			if ((done_date = this.model.get('date_done'))) {
				done_date = new Date(done_date).toUTCString();
				this.model.set('date_done', this.formatDate(done_date));
			}
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		formatDate:function(date) {
			console.log('date:', date);
			//console.log('date.toGMTString():', date.toGMTString());
			return date;
		}
	});
	return EntryView;
});
