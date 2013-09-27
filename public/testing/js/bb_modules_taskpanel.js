console.log('hmmm');
require.config({
	paths: {
		TaskPanel: "views/task_panel",
		QUnit: "libs/qunit-1.12.0",
		Sinon: "libs/sinon-1.7.3",
		SinonQUnit: "libs/sinon-qunit-1.0.0"
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
		}
	}
});

require(["QUnit", "callback", "TaskPanel", "SinonQUnit"], function(QUnit, callback, TaskPanel) {
	console.log('working?');
	console.log('I think so.');

	test("just checking", function() {
		var host = {
			makeCall: function() {
				return 1;
			}
		}

		ok(1);

		var spy1 = this.spy(host, 'makeCall');
		host.makeCall();

		equal(true, spy1.calledOnce, 'called once');
	});

	QUnit.load();
	QUnit.start();

});
