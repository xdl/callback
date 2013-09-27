define(['views/base', 'text!templates/cmd.html', 'testing/callback', 'docs'], function(BaseView, CmdTemplate, callback, docs) {
	var Cmd = BaseView.extend({

		initialize: function(options) {
			this.Directory = options.Directory;
			callback.api.objects = this.Directory; //points it to the directory object now.

			Backbone.on('hint_on', this.enableHint, this);
			Backbone.on('hint_off', this.disableHint, this);

			this.$('#cmd').attr('placeholder', this.instructions.default);
			this.outcome = this.$('#outcome');
			//console.log('this.outcome:', this.outcome);
			this.outcome.hide();
		},
		instructions: {
			default: 'Type command in here',
			describe: 'Press any key to hide',
			success: 'Command successfully excecuted!',
			failure: 'Yikes! Check your command for errors.'
		},
		destroy: function() {
			Backbone.off('hint_on', this.enableHint, this);
			Backbone.off('hint_off', this.disableHint, this);
		},
		history: {
			stack: [],
			MAX_SIZE: 10,
			pointer: -1
		},
		template: _.template(CmdTemplate),

		events: {
			'click a#docs': 'handleLoadDoc',
			'keyup :input': 'handleKeyPress',
			'keydown :input': 'handleTabEscPress'
		},
		handleLoadDoc:function(e) {
			e.preventDefault();
			Backbone.trigger('showAPI');
		},
		enableHint:function() {
			this.$('#cmd').attr('placeholder', this.instructions.describe);
		},
		disableHint:function() {
			this.$('#cmd').attr('placeholder', this.instructions.default);
		},
		render: function() {
			this.$el.html(this.template);
			this.$('#outcome').hide();
		},
		handleTabEscPress: function(e) {
			var request = $('#cmd').val();

			if (e.keyCode == 27) {
				e.preventDefault();
				e.stopPropagation();
				this.clearTypeahead();
			}

			else if (e.which == 9) {
				e.preventDefault();
				e.stopPropagation();
				this.finishTypeahead(request);
			}
		},
		handleKeyPress: function(e) {
			var request = $('#cmd').val();

			switch(e.which) {
				case 13:
					if (request != '') {
						$('#cmd').val(''); //set it back to nothing
						this.handleRequest(request); //handle the request
						this.store(request);
						this.clearTypeahead();
					}
					break;
				case 38: //up
					e.preventDefault();
					this.scroll('up');
					break;
				case 40: //down
					e.preventDefault();
					this.scroll('down');
					break;
				//case 190:
					//this.triggerTypeahead(request.slice(0,-1));
					//break;
				//case 9:
					//break;
				default:
					//trigger typeahead
					if (request != '') {
						this.triggerTypeahead(request);
					} else {
						this.clearTypeahead();
					}
					break;
			}
		},
		clearTypeahead: function() {
			this.$('#typeahead').empty();
		},
		finishTypeahead: function(req) {
			if (this.filteredHeads.length != 0) {

				var req_arr = req.split('.');

				if (req_arr.length == 1) {
					if (req_arr[0].length == 1)
						this.$('#cmd').val(this.filteredHeads[0]);
					else {
						this.$('#cmd').val(this.filteredHeads[0] + '()');
						this.setCaretPosition('cmd', this.$('#cmd').val().length-1);
					}
				}
				else {
					this.$('#cmd').val(req_arr[0] + '.' + this.filteredHeads[0] + '()');
					this.setCaretPosition('cmd', this.$('#cmd').val().length-1);
				}
			}
		},
		getKeys: function(key) {
			var keys = [];
			if (key == 'tasks') {
				keys = Object.keys(callback.api.objects.tasks.assigned);
				keys = keys.concat(Object.keys(callback.api.objects.tasks.priv), Object.keys(callback.api.objects.tasks.pub));

				//filtering out duplicates from assigned and private
				keys = keys.filter(function(elem, pos) {
					return keys.indexOf(elem) == pos;
				})

			}
			else if (key == 'users') {
				keys = Object.keys(callback.api.objects.users.priv);
				keys = keys.concat(Object.keys(callback.api.objects.users.pub));
			}

			else if (key == 'user_methods') {
				keys = Object.keys(callback.api.methods.users.priv);
				keys = keys.concat(Object.keys(callback.api.methods.users.pub));
			}

			return keys;
		},
		getKeysFromContext: function(context) { //returns method names
			var keys = [];
			//6 possibilities:
				//user + task
				//public, private, assigned
			if (context.type == 'user') {
				if (context.access == 'private') {
					keys = Object.keys(callback.api.methods.users.priv);
					keys = keys.concat(Object.keys(callback.api.methods.users.pub));
				}
				else if (context.access == 'public') {
					keys = Object.keys(callback.api.methods.users.pub);
				}
			}

			else if (context.type == 'task') {
				if (context.access == 'private') {
					keys = Object.keys(callback.api.methods.tasks.priv);
					keys = keys.concat(Object.keys(callback.api.methods.tasks.pub));
					keys = keys.concat(Object.keys(callback.api.methods.tasks.assigned));
				}
				else if (context.access == 'assigned') {
					keys = Object.keys(callback.api.methods.tasks.assigned);
					keys = keys.concat(Object.keys(callback.api.methods.tasks.pub));
				}
				else if (context.access == 'public') {
					keys = Object.keys(callback.api.methods.tasks.pub);
				}
			}

			return keys;

		},
		triggerTypeahead: function(req) {

			//reset it
			this.$('#typeahead').empty();

			//get new ones
			var possibleHeads = [];
			var obj = callback.process(req);
			var context = obj.context;
			var dir_entries = [];


			var to_eval;
			if (context == 'not recognised') { //task or user list, or a private method

				possibleHeads = possibleHeads.concat(this.getKeys('tasks'));
				possibleHeads = possibleHeads.concat(this.getKeys('users'));
				possibleHeads = possibleHeads.concat(this.getKeys('user_methods'));

				to_eval = req.split('(')[0];
			}

			else { 
				possibleHeads = this.getKeysFromContext(context);

				var reqs = req.split('.');
				var to_eval
				
				//private method
				if (reqs.length == 1) {
					to_eval = reqs[0].split('(')[0];
				}

				else {
					to_eval = reqs[1].split('(')[0];
				}

			}

			filteredHeads = this.filterHeads(to_eval, possibleHeads);


			var toAppend = '';


			for (var i = 0; i < filteredHeads.length; i++) {
				if (docs[filteredHeads[i]] == undefined) {
					toAppend += '<div>' + filteredHeads[i] + '</div>';
				}
				else {
					if (filteredHeads.length == 1) {
						toAppend += '<div>' + docs[filteredHeads[i]].syntax + ' - ' + docs[filteredHeads[i]].description + docs[filteredHeads[i]].examples + '</div>';
					} else {
						toAppend += '<div>' + docs[filteredHeads[i]].syntax + ' - ' + docs[filteredHeads[i]].description + '</div>';
					}
				}
			}

			//appending those heads
			this.$('#typeahead').append(toAppend);

			//copying this into global
			this.filteredHeads = filteredHeads;
		},
		filteredHeads: [], //need to be global in order for finishTypeahead to access 
		filterHeads:function(frag, possibles) {
			var filterCrit = function(element) {
				//if too long, obviously not it
				if (frag.length > element.length) {
					return false;
				}

				//just finished the completion - give it all
				else if (frag == '') {
					return true;
				}
				
				//use indexOf() for the rest of this method.
				else if (element.indexOf(frag) != 0) {
					return false;
				}
				return true;
			}

			var filtered = possibles.filter(filterCrit);

			return filtered;
		},
		scroll:function(dir) {
			var cmd = $('#cmd');
			var pointer = this.history.pointer;
			var stack = this.history.stack;
			if (dir == 'up') {
				pointer = pointer >= this.history.stack.length-1? this.history.stack.length-1:(pointer+1);
			} else if (dir == 'down') {
				pointer = pointer ==  -1? pointer:pointer-1;
			}

			if (pointer != -1) {
				var histVal = stack[pointer];
				cmd.val(histVal);
				console.log('scrolling up');
			} else {
				cmd.val('');
			}

			this.history.pointer = pointer;
			console.log('this.history.stack:', this.history.stack);
			console.log('pointer:', pointer);
		},
		store:function(req) {
			var stack = this.history.stack;
			var pointer = this.history.pointer;
			stack.unshift(req);
			console.log('stack:', stack);
			if (stack.length > this.history.MAX_SIZE) {
				stack.pop();
			}
			//resets the pointer
			pointer = -1;
		},
		handleRequest: function(res) {
			var response = callback.process(res);
			if (response.status == 'ok') {
				Backbone.trigger(response.method, response);
			}

			this.handleOutcome(response);
		},
		outcome: null,
		handleOutcome: function(res) {
			var outcome = this.$('#outcome');
			var message;

			if (res.status == 'ok') {
				message = this.instructions.success;
			} else {
				message = this.instructions.failure;
			}
			//handle outcome here
			outcome.clearQueue();
			outcome.html(message).fadeIn('fast', function() {
				//Animation complete
				outcome.delay(2500).fadeOut('slow');
			});
		},
		setCaretPosition: function(elemId, caretPos) {
			var elem = document.getElementById(elemId);

			if(elem != null) {
				if(elem.createTextRange) {
					var range = elem.createTextRange();
					range.move('character', caretPos);
					range.select();
				}
				else {
					if(elem.selectionStart) {
						elem.focus();
						elem.setSelectionRange(caretPos, caretPos);
					}
					else
						elem.focus();
				}
			}
		}
		
	});

	return Cmd;
});
