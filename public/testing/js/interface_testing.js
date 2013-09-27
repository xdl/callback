require.config({
	paths: {
		QUnit: "qunit-1.12.0"
	},
	shim: {
		"QUnit": {
			exports: "QUnit", //converts it into a global package.
			init: function() {
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		}
	}
});

require(["QUnit", "callback"], function(QUnit, callback) {

	test("failing objects, unrecognised methods", function() {

		var a0 = 'blahblah("take out trash", u2);';

		var e0 = {
			context: 'not recognised',
			method: 'not processed',
			status: 'fail',
			extra: 'method or object not recognised',
			info: {}
		}

		//deep equal for comparing objects.
		deepEqual(callback.process(a0), e0, 'object fails correctly, bad method.');

		var e3 = {
			context: {
				access: 'public',
				object: 'idu1111',
				type: 'user'
			},
			method: 'not recognised',
			status: 'fail',
			extra: 'user method not recognised',
			info: {}
		}

		var a3 = 'u1.message("blah", u1);';

		deepEqual(callback.process(a3), e3, 'response fails correctly - can\'t access private method');

		var e5 = {
			obj: 'idt1111',
			method: 'not recognised',
			status: 'fail',
			extra: 'task method not recognised'
		}

		var a5 = 't1.showTasks();';

		//deepEqual(callback.process(a5), e5, 'response fails correctly - no such method on task');

	});

	test('message', function() {


		var e1 = {
			context: {
				object: 'idu0000',
				type: 'user',
				access: 'private'
			},
			method: 'message',
			status: 'ok',
			extra: '',
			info: {
				message: 'blah',
				recipient: 'u1'
			}
		}

		var a1 = 'message("blah", u1);';

		deepEqual(callback.process(a1), e1, 'response passes correctly - message');

		var e2 = 'ok';
		var a2 = 'message("Hey there, I hope you is fine. This is my message!", u1);';

		deepEqual(callback.process(a2).status, e2, 'general message testing');
		//console.log(callback.process(a1));

		var e3 = 'fail';
		var a3 = 'message("Hey there, I hope you is fine. This is my message!", u10);';

		deepEqual(callback.process(a3).status, e3, 'bad arguments.');

	});

	test('show tasks', function() {


		var e1 = {
			method: 'showTasks',
			status: 'ok',
			extra: '',
			info: {
				toShow: 'all'
			},
			context: {
				object: 'idu0000',
				type: 'user',
				access: 'private'
			}
		}

		var a1 = 'showTasks();';

		deepEqual(callback.process(a1), e1, 'response passes correctly - accessing public method');

		var e9 = {
			method: 'showTasks',
			status: 'fail',
			info: {},
			extra: 'bad arguments',
			context: {
				object: 'idu0000',
				type: 'user',
				access: 'private'
			}
		}

		var a9 = 'showTasks("Hey! Lets go!", u4);';

		deepEqual(callback.process(a9), e9, 'fails correctly - bad argument.');

		var e10 = {
			method: 'showTasks',
			status: 'ok',
			info: {toShow: 'todo'},
			extra: '',
			context: {
				object: 'idu1111',
				type: 'user',
				access: 'public'
			}
		}

		var a10 = 'u1.showTasks("todo");';

		deepEqual(callback.process(a10), e10, 'passes correctly - good arguments.');

		var e11 = 'fail';
		var a11 = 'u1.showTasks("finisheds");';

		deepEqual(callback.process(a11).status, e11, 'fails correctly - bad argument.');
	});

	test('done', function() {


		var e6 =  'ok';
		//var e6 = {
			//method: 'done',
			//status: 'ok',
			//extra: '',
			//info: {
				//comment: ''
			//},
			//context: {
				//object: 'idt1111',
				//type: 'task',
				//access: 'private'
			//}
		//}

		var a6 = 't1.done();';

		deepEqual(callback.process(a6).status, e6, 'response passes correctly - accessing method on task');

		var e1 = 'ok';
		var a1 = 't4.done("yeah boi")';
		deepEqual(callback.process(a1).status, e1, 'response passes correctly.');

		var e7 = {
			method: 'not recognised',
			status: 'fail',
			extra: 'task method not recognised',
			info: {
			},
			context: {
				object: 'idt7777',
				type: 'task',
				access: 'public'
			}
		}

		var a7 = 't7.done();';

		deepEqual(callback.process(a7), e7, 'response fails correctly - can\'t mark done a public task.');
	});


	test('createTask', function() {

		var e1 = 'ok';
		var a1 = 'createTask("Filler, 123, 41234", u2, u3, u4, createTask("do the dishes", u1));';
		deepEqual(callback.process(a1).status, e1, 'recursive createTask seems to work.');

		var e2 = 'ok';
		var a2 = 'createTask("Filler", u2);';
		deepEqual(callback.process(a2).status, e2, 'passes correctly - good arguments.');

		//var e3 = {
			//method: 'createTask',
			//status:'ok',
			//extra: '',
			//info: {
				//tasks: ['rats1'],
				//users: ['u1'],
				//callback: 't1.done()'
			//},
			//context: {
				//object: 'idu0000',
				//type: 'user',
				//access: 'private'
			//}
		//}
		//
		var e3 = 'ok';

		var a3 = 'createTask("rats1", u1, t1.done());';
		deepEqual(callback.process(a3).status, e3, 'passes correctly, regular callback');
		//console.log('callback.process(a3):', callback.process(a3));

		var e4  = 'ok';

		var a4 = 'createTask("rats1, rats2, rats3", u1, u2, u4, t1.done());';
		deepEqual(callback.process(a4).status, e4, 'passes correctly, adding callback');



		var e5 = 'ok';
		var a5 = 'createTask("rats", u1, showTasks("todo"));';
		deepEqual(callback.process(a5).status, e5, 'passes correctly - correct callback args');

		var e7 = {
			method: 'createTask',
			status: 'ok',
			extra: '',
			info: {
				callback: 'default',
				tasks: ['yeah', '123', 'boy'],
				users: ['u2', 'u0', 'u1']
			},
			context: {
				object: 'idu0000',
				type: 'user',
				access: 'private'
			}
		}

		var a7 = 'createTask("yeah, 123, boy", u2, u0,u1);';

		deepEqual(callback.process(a7), e7, 'response passes correctly - correct argument parsing.');

		var e8 = 'ok';

		var a8 = 'createTask("hello", u2, function() {t1.done();});';
		deepEqual(callback.process(a8).status, e8, 'function wrapper works');
	});

	//todo:

	test('amend', function() {
		var e1 = 'ok';
		var a1 = 't1.amend("new task", u2)';
		deepEqual(callback.process(a1).status, e1, 'amend delegates correctly.');

	});

	test('delete', function() {
		var e1 = 'ok';
		var a1 = 't1.delete();';
		deepEqual(callback.process(a1).status, e1, 'delete working');
	});

	test('changeTask', function() {
		var e1 = 'fail';
		var a1 = 'changeTask(t2);';
		deepEqual(callback.process(a1).status, e1, 'shouldn\'t be able to change to a task that isn\'t assigned to you, despite owning it.');
	});

	QUnit.load();
	QUnit.start();
});
