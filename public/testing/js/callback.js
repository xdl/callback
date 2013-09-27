define([], function() {
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
					priv: {
						u0: "idu0000" //yourself.
					},
					pub: {
						u1: "idu1111",
						u2: "idu2222",
						u3: "idu3333",
						u4: "idu4444"
					}
				},
				tasks: {
					priv: {
						t0: {
							__id: "randomnumbershere!",
							callback: "default",
							task_name: "take out trashes",
							task_id: "t0",
							delegate: "homer"},
						t1: {
							__id: "randomnumbershere!",
							callback: "default",
							task_name: "do some other stuffs",
							task_id: "t1",
							delegate: "homer"},
						t2: {
							__id: "randomnumbershere!",
							callback: "default",
							task_name: "do some other stuffs",
							task_id: "t2",
							delegate: "homer"},
						t3: {
							__id: "randomnumbershere!",
							callback: "default",
							task_name: "do some other stuffs",
							task_id: "t3",
							delegate: "homer"}
					},
					assigned: {
						t4: "idt4444",
						t5: "idt5555"
					},
					pub: {
						t6: "idt6666",
						t7: "idt7777"
					}
				}
			},
			methods: {
				users: {
					priv: {
						showTasks: function(arg_string, response, context) {
							var flag = arg_string.replace(/['"\s]/g,'');
							var status = 1;

							switch (flag) {
								case '':
									case 'all':
									response.info.toShow = 'all';
								break;
								case 'done':
									response.info.toShow = 'done';
								break;
								case 'todo':
									response.info.toShow = 'todo';
								break;
								default:
									status = 0;
								break;
							}

							return status;
						},
						changeTask: function(arg_string, response, context) {
							var task = arg_string.trim();
							if (typeof(callback.api.objects.tasks.assigned[task]) == 'undefined') {
								return 0; //can't find the task.
							}
							response.info.task = task;
							return 1;
						},
						do: function(arg_string, response, context) { //alias for createTask
							var status = callback.api.methods.users.priv.createTask(arg_string, response, context);
							return status;
						},
						createTask: function(arg_string, response, context) {
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
								if (typeof(callback.api.objects.users.priv[test_user]) == 'undefined' && typeof(callback.api.objects.users.pub[test_user]) == 'undefined') {
									return 0; //bad user. 
								} else {
									user_array.push(test_user);
								}
							}


							if (user_array.length != t_length && user_array.length != 0) { //if not equal, user_array.length has to equal 0, which means you have assigned all those tasks to yourself.
								return 0; 
							}

							//3. dealing with the callback, if there is any.
							var cb = user_segment.trim();

							//have they wrapped it in function() {}?
							if (cb.substr(0,8) == 'function') {
								var parenIndex = cb.indexOf('{');
								cb = cb.slice(parenIndex+1, -1).replace(';','').trim();
							}


							if (cb != "") {
								//handle the callback here.
								//if fail:
								if ((cb = callback.process(cb)).status == 'fail') {
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
						message: function(arg_string, response, context) {
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

							if (typeof(callback.api.objects.users.priv[user]) == 'undefined' && typeof(callback.api.objects.users.pub[user]) == 'undefined') {
								return 0; //bad user.
							}

							response.info.message = msg;
							response.info.recipient = user;

							return 1;
						}
					},
					pub: {
						describe: function(arg_string, response) {
							//no further arguments
							return 1;
						}

					}
				},
				tasks: {
					pub: {
						describe: function(arg_string, response) {
							//no parameters
							return 1;
						}
					},
					assigned: {
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
						amend: function(arg_string, response, context) {
							//delegate to createTask to validate.
							var status = callback.api.methods.users.priv.createTask(arg_string, response, context);
							return status;
						},
						delete: function(arg_string, response, context) {
							return 1;
						}
					}

				}
			}
		},
		process: function(cmd) {

			//to return:
			var response = {
				context: 'not processed',
				method: 'not processed',
				status: "",
				extra: "",
				info: {}
			};
			//preprocess:
			var parts = cmd.split('.'); //the object name.
			var possible_method = cmd.split('(')[0]; //yourself, if it matches a method.

			//1. get the context.
			var context = {
				object: '',
				type: '',
				access: ''
			};

			response.context = context;

			//is it another user?
			if (context.object = callback.api.objects.users.pub[parts[0]]) {
				context.access = 'public';
				context.type = 'user';
			}
			//is it a private task?
			else if (context.object = callback.api.objects.tasks.priv[parts[0]]) {
				context.access = 'private';
				context.type = 'task';
			}
			//is it an assigned task?
			else if (context.object = callback.api.objects.tasks.assigned[parts[0]]) {
				context.access = 'assigned';
				context.type = 'task';
			}
			//is it a public task?
			else if (context.object = callback.api.objects.tasks.pub[parts[0]]) {
				context.access = 'public';
				context.type = 'task';
			}

			//is it yourself?
			else if (callback.api.methods.users.priv[possible_method] || callback.api.methods.users.pub[possible_method] || callback.api.objects.users.priv[parts[0]]) {

				context.object = callback.api.objects.users.priv.u0;
				context.access = 'private';
				context.type = 'user';
			}
			//otherwise, done something wrong.
			else {
				response.context = 'not recognised';
				response.status = 'fail';
				response.extra = callback.msgs.e01;
				return response;
			}

			//2. get the arguments string
			var index_opening_paren = cmd.indexOf('('); //get outermost opening paren index.
			var index_closing_paren = cmd.lastIndexOf(')'); //get outermost closing paren index.
			var arg_string = cmd.slice(index_opening_paren + 1, index_closing_paren).trim();


			//3. get the method name.
			var m0 = cmd.split('(')[0];
			var m1 = m0.split('.');

			if (m1.length == 1) {
				var method_name = m1[0];
			} else {
				method_name = m1[1];
			}
			var method;

			//check the private and public methods of tasks and users.
			if (context.type == 'user') {
				if (context.access == 'private') {
					if ((method = callback.api.methods.users.priv[method_name]) || (method = callback.api.methods.users.pub[method_name])) { //check if the method exists.
						response.method = method_name;
						if (method(arg_string.slice(0), response, context)) {
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

				else { //it's a teammate.
					if ((method = callback.api.methods.users.pub[method_name])) { //check if method exists.
						response.method = method_name;
						if (method(arg_string.slice(0), response, context)) { //check if argmuents work out.
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

			}

			else {//context.type = task.
				if (context.access == 'private') {
					if ((method = callback.api.methods.tasks.priv[method_name]) || (method = callback.api.methods.tasks.pub[method_name]) || (method = callback.api.methods.tasks.assigned[method_name])) { 
						response.method = method_name;
						if (method(arg_string.slice(0), response, context)) {
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

				else if (context.access == 'assigned') { //can access the public and assigned methods.
					if ((method = callback.api.methods.tasks.pub[method_name]) || (method = callback.api.methods.tasks.assigned[method_name])) { 
						response.method = method_name;
						if (method(arg_string.slice(0), response, context)) {
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

				else {//it's a public task (something that's been assigned to you). 
					if ((method = callback.api.methods.tasks.pub[method_name])) { 
						response.method = method_name;
						if (method(arg_string.slice(0), response, context)) {
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
			}

			response.status = 'ok';
			return response;
		}
	}

	return callback;
});
