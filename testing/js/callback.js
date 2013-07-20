var callback = {
	msgs: {
		'e01': 'method or object not recognised',
		'e02': 'user method not recognised',
		'e03': 'task method not recognised',
		'e04': 'bad arguments'
	},

	utils: {
	},

	api: {
		objects: {
			users: {
				u0: "idu0000",
				u1: "idu1111",
				u2: "idu2222",
				u3: "idu3333",
				u4: "idu4444"
			},
			tasks: {
				t0: "idt0000",
				t1: "idt1111",
				t2: "idt2222",
				t3: "idt3333"
			}
		},
		methods: {
			users: {
				priv: {
					changeTask: function(arg_string, response) {
						var task = arg_string.trim();
						console.log(task);
						if (typeof(callback.api.objects.tasks[task]) == 'undefined') {
							return 0; //can't find the task.
						}
						response.info.task = task;
						return 1;
					},
					createTask: function(arg_string, response) {

						//1: get the array of tasks.
						var string_delimit = arg_string[0];

						arg_string = arg_string.slice(1);

						//find the matching quote.
						var re0 = new RegExp("(?:[^\\\\])"+string_delimit); //matching quote that hasn't been escaped.
						var terminIndex;
						if (terminIndex = arg_string.match(re0) != null) {
							terminIndex = arg_string.match(re0).index + 1;
						} else {
							return 0; //need to pass a non-empty string.
						} 
						var task_segment = arg_string.slice(0, terminIndex);
						var task_array = task_segment.split(',');
						task_array.forEach(function(element, index, array) {
							array[index] = element.trim();
						});


						//2. getting the array of users. Needed from step 1: task_array.length
						var user_segment = arg_string.slice(terminIndex + 1);
						user_segment = user_segment.replace(/,\s*/, '');

						//need to verify the users as we go.
						
						var t_length = task_array.length;
						var user_array = [];

						var test_user;
						var test_index;


						while (user_array.length != t_length && user_segment != '') {
							test_index = user_segment.indexOf(',');
							if (test_index == -1) {
								test_user = user_segment;
								user_segment = '';
							} else {
								test_user = user_segment.slice(0, test_index).trim();
								user_segment = user_segment.slice(test_index + 1).trim();
							}

							//validate the user.
							if (typeof(callback.api.objects.users[test_user]) == 'undefined') {
								return 0; //bad user.
							} else {
								user_array.push(test_user);
							}
						}


						if (user_array.length != t_length) {
							return 0; //mismatched arguments.
						}


						//3. dealing with the callback, if there is any.
						var cb = user_segment;
						if (cb != "") {
							//handle the callback here.
							if (callback.process(cb).status == 'fail') {
								return 0; //bad callback
							}
						} else {
							cb = 'default';
						}


						//now we have matched up tasks and users, and callback.
						//task_array, user_array, cb.
						response.info.tasks = task_array.slice(0);
						response.info.users = user_array.slice(0);
						response.info.callback = cb;
						
						return 1;
					},
					message: function(arg_string, response) {
						//expecting two arguments. Need to split them up - one is the message, the other is the user.
						//1. split up the message and the user. use string.lastIndexOf(',') to get the last separator between string and user. (gonna fail if we allow messages to more than one user.
						var terminIndex;
						if ((terminIndex = arg_string.lastIndexOf(',')) == -1) {
							return 0; //should be at least one comma in there some where.
						}

						var msg_segment = arg_string.slice(0, terminIndex);
						var string_delimit = msg_segment[0];
						msg_segment = msg_segment.slice(1);
						var re0 = new RegExp("([^\\\\])"+string_delimit);

						var msg = msg_segment.replace(re0, '$1').trim();
						var user = arg_string.slice(terminIndex + 1).trim(0);

						if (typeof(callback.api.objects.users[user]) == 'undefined') {
							return 0; //bad user.
						}

						response.info.message = msg;
						response.info.recipient = user;

						return 1;
					}
				},
				pub: {
					listTasks: function(arg_string, response) {
						var flag = arg_string.replace(/['"\s]/g,'');
						var status = 1;

						switch (flag) {
							case '':
							case 'all':
								response.info.toList = 'all';
								break;
							case 'active':
								response.info.toList = 'active';
								break;
							case 'finished':
								response.info.toList = 'finished';
								break;
							case 'pending':
								response.info.toList = 'pending';
								break;
							default:
								status = 0;
								break;
						}

						return status;
					}

				}
			},
			tasks: {
				pub: {
					done: function(arg_string, response) { //expecting either empty, or a string.

						if (arg_string == '') {
							response.info.comment = '';
							return 1;
						}
						var string_delimit = arg_string[0];

						arg_string = arg_string.slice(1);

						//find the matching quote.
						var re0 = new RegExp("(?:[^\\\\])"+string_delimit); //matching quote that hasn't been escaped.
						var terminIndex;
						if (terminIndex = arg_string.match(re0) != null) {
							terminIndex = arg_string.match(re0).index + 1;
						} else {
							return 0; //need to pass a non-empty string.
						} 

						var message = arg_string.slice(0, terminIndex);
						response.info.comment = message;

						return 1;
					}
				},
				priv: {
					amend: function(arg_string, response) {
						//delegate to createTask.
						var status = callback.api.methods.users.priv.createTask(arg_string, response);
						return status;
					},
					delete: function(arg_string, response) {
						return 1;
					}
				}

			}
		}
	},
	process: function(cmd) {

		//to return:
		var response = {
			obj: 'not processed',
			method: 'not processed',
			status: "",
			extra: "",
			info: {}
		};
		//preprocess:
		var parts = cmd.trim().split('.');
		var possible_method = cmd.split('(')[0];

		//1. get the object.
		var obj_type;

		//is it another user?
		if (response.obj = callback.api.objects.users[parts[0]]) {
			obj_type = 'users';
		}
		//is it a task?
		else if (response.obj = callback.api.objects.tasks[parts[0]]) {
			obj_type = 'tasks';
		}
		//is it yourself?
		else if (callback.api.methods.users.priv[possible_method] || callback.api.methods.users.pub[possible_method]) {
			response.obj = callback.api.objects.users.u0;
			obj_type = 'yourself';
		}
		//otherwise, done something wrong.
		else {
			response.obj = 'not recognised';
			response.status = 'fail';
			response.extra = callback.msgs.e01;
			return response;
		}
		
		//2. get the arguments string
		var index_opening_bracket = cmd.indexOf('(');
		var a0 = [];
		a0[0] = cmd.slice(0, index_opening_bracket);
		a0[1] = cmd.slice(index_opening_bracket + 1);
		var arg_string = a0[1].split(/\)(?!\s*\))/)[0].trim(); //outermost closing bracket.


		//3. get the method name.
		var m0 = cmd.split('(')[0];
		var m1 = m0.split('.');

		if (m1.length == 1) {
		var method_name = m1[0];
		} else {
			method_name = m1[1];
		}
		var method;

		//check the private and public functions of tasks and users.
		if (obj_type == 'yourself') {
			if ((method = callback.api.methods.users.priv[method_name]) || (method = callback.api.methods.users.pub[method_name])) {
				response.method = method_name;
				if (method(arg_string.slice(0), response)) {
					response.status = 'ok';
					return response;
				} else {
					response.status = 'fail';
					response.extra = callback.msgs.e04;;
					return response;
				}
			} 
			
			else {
				response.method = 'not recognised';
				response.status = 'fail';
				response.extra = callback.msgs.e02;
				return response;
			}
		}

		else if (obj_type =='tasks') { //obj type is a task
			if ((method = callback.api.methods.tasks.priv[method_name]) || (method = callback.api.methods.tasks.pub[method_name])) { //not sure what the point of splitting these guys up are. Maybe there will be a permissions object for the callback as well.
				response.method = method_name;
				if (method(arg_string.slice(0), response)) {
					response.status = 'ok';
					return response;
				} else {
					response.status = 'fail';
					response.extra = callback.msgs.e04;
					return response;
				}
			}

			else {
				response.method = 'not recognised';
				response.status = 'fail';
				response.extra = callback.msgs.e03;
				return response;
			}
		}

		else if (obj_type == 'users') { //obj type is a user
			if (method = callback.api.methods.users.pub[method_name]) {
				response.method = method_name;
				if (method(arg_string.slice(0), response)) {
					response.status = 'ok';
					return response;
				} else {
					response.status = 'fail';
					response.extra = callback.msgs.e04;
					return response;
				}

			}

			else {
				response.method = 'not recognised';
				response.status = 'fail';
				response.extra = callback.msgs.e02;
				return response;
			}
		}

		response.status = 'ok';
		return response;
	}
}
