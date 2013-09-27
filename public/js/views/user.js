define(['views/entry', 'text!templates/user.html'], function(EntryView, UserTemplate) {

	var User = EntryView.extend({
		template: _.template(UserTemplate),
	});

	return User;
});
