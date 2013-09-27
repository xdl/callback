require.config({
	baseUrl: "js", //load here by default
	paths: {
		Backbone: "libs/backbone",
		jQuery: "libs/jquery-2.0.2.min",
		Underscore: "libs/underscore-min",
		text: "libs/text",
		templates: "../templates",
		QUnit: "qunit-1.12",
		Sinon: "sinon-1.7.3",
		SinonQUnit: "sinon-qunit-1.0.0"
	},

	shim: {
		"SinonQUnit": {
			deps: ["Sinon", "QUnit"]
		},
		"QUnit": {
			exports: "QUnit",
			init: function() {
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		},
		"Backbone": {
			deps: ['Underscore', 'jQuery', 'text'],
			exports: "Backbone"
		}
	}
});

require(["QUnit", "TaskPanel", "SinonQUnit"], function(QUnit, TaskPanel) {

});
