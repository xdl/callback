define(['views/base', 'views/createfield', 'text!templates/create.html'], function(BaseView, CreateField, CreateTemplate) {
	var CreateView = BaseView.extend({
		el: $("#content"),
		events: {
			'click span.add': 'addField',
			'submit form#create': 'validateFields'
		},
		initialize: function() {
			this.fields.push(new CreateField({number:this.fields.length, max: this.MAX_FIELDS}));
			Backbone.on('addField', this.addField, this);
			Backbone.on('subtractField', this.subtractField, this);
		},
		destroy:function() {
			Backbone.off('addField', this.addField, this);
			Backbone.off('subtractField', this.subtractField, this);
			for (var i = 0; i < this.fields.length; i++) {
				this.fields[i].destroy();
			}
		},
		MAX_FIELDS: 4,
		fields: [
		],
		validateFields: function(e) {
			e.preventDefault();
			var to_submit = true;
			var user_entries = [];

			for (var i = 0; i < this.fields.length; i++) {

				var val_result = this.fields[i].validate();

				if(!val_result.result) {
					to_submit = false;
					user_entries.push(val_result.username);
				}
			}

			var password = this.validatePassword();
			if (to_submit && password.status){
				this.submit(password, user_entries);
			}

		},
		validatePassword: function() {
			var password1 = this.$('input[name=password1]').val();
			var password2 = this.$('input[name=password2]').val();

			if (password1 != password2) {
				this.growl("Passwords need to match.");
				return({password:password1, status:false});
			} else {
				return({password:password1, status:true});
			}
		},
		submit: function() {
			console.log('everything ready to submit.');
		},
		template:_.template(CreateTemplate),
		render:function() {
			this.$el.html(this.template);

			var fieldfrag = this.fieldfrag || this.$('.fields');

			fieldfrag.empty();

			for (var i = 0; i < this.fields.length; i++) {
				fieldfrag.append(this.fields[i].render().el);
			}
		},
		refresh:function() {
			//console.log('this.fields.length:', this.fields.length);
			//console.log('this.MAX_FIELDS:', this.MAX_FIELDS);
			if (this.fields.length == this.MAX_FIELDS) {
				this.$('.add').empty();
			} else {
				this.$('.add').html('+');
			}
		},
		addField:function() {
			if (this.fields.length != this.MAX_FIELDS) {
				//console.log('hi');
				var field = new CreateField({number:this.fields.length});
				this.fields.push(field);

				var fieldfrag = this.fieldfrag || this.$('.fields');
				fieldfrag.append(field.render().el);

				this.refresh();
			}
		},
		subtractField:function(obj) {
			//obj.close();
			var domfields = this.$('.fields').children();

			//removing from dom
			var index = this.fields.indexOf(obj);
			domfields[index].remove();

			//removing from fields
			this.fields[index].destroy();
			this.fields.splice(index, 1);

			this.refresh();
		}
	});
	return CreateView;
});
