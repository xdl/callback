define(['views/base', 'text!templates/createfield.html'], function(BaseView, CreateFieldView) {
	var CreateFieldView = BaseView.extend({
		template:_.template(CreateFieldView),
		initialize:function(options) {
			this.number = options.number + 1;
			this.max = options.max;
		},
		events: {
			'click span.minus': 'subtractField'
		},
		validate: function() {
			var to_check = this.$('input[name=user]').val();
			var re = /^([a-zA-Z0-9.]+@){0,1}([a-zA-Z0-9.])+$/;
			var result = to_check.search(re);
			if (result == 0) {
				return {result:true,username:to_check};
			}
			else {
				this.growl("don't do this!");
				return {result:false,username:to_check};
			}

		},
		growl: function(message) {
			console.log('message:', message);
		},
		destroy: function() {
			this.stopListening();
			this.unbind();
		},
		subtractField:function() {
			Backbone.trigger('subtractField', this);
		},
		render: function() {
			this.$el.html(this.template({number:this.number, option: this.option, max: this.max}));
			return this;
		}
	});

	return CreateFieldView;
});
