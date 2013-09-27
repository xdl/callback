define([], function() {
	return {
		done: {
			syntax: '<b>Task</b>.<method>done</method>(<code><string>[comment]</string></code>)',
			description: 'Marks a task as done, optionally leaving a <string>comment</string>.',
			examples: '<ul><li><code>t2.<method>done</method>(<string>"boy that took a long time."</string>);</li></ul>'
		},
		do: {
			syntax: '<b>User</b>.<method>do</method>(<code>...args</code>)',
			description: 'Creates new task(s). (Alias for createTask.)',
		examples: '<ul><li><code><method>do</method>(<string>"finish homework"</string>);</code></li> <li>Create several tasks: <code><method>do</method>(<string>"finish homework, watch itchy and scratchy, play with milhouse"</string>);</code></li> <li>Create a task for someone else: <code><method>do</method>(<string>"wash the car"</string>, u2);</code></li> <li>When finished, perform another command: <code><method>do</method>(<string>"wash the car"</string>, u2, <method>do</method>(<string>"do the dishes"</string>, u2));</code></li> <li>Indefinitely chain commands: <code><method>do</method>(<string>"buy groceries"</string>, u2, <method>do</method>(<string>"make the cake"</string>, u3, <method>do</method>(<string>"set the table"</string>, t3.<method>done</method>()))));</code></li> </ul>'
		},
		createTask:{
			syntax: '<b>User</b>.createTask(<code>...args</code>)',
			description: 'Creates new task(s).',
		examples: '<ul><li><code><method>createTask</method>(<string>"finish homework"</string>);</code></li> <li>Create several tasks: <code><method>createTask</method>(<string>"finish homework, watch itchy and scratchy, play with milhouse"</string>);</code></li> <li>Create a task for someone else: <code><method>createTask</method>(<string>"wash the car"</string>, u2);</code></li> <li>When finished, perform another command: <code><method>createTask</method>(<string>"wash the car"</string>, u2, <method>createTask</method>(<string>"do the dishes"</string>, u2));</code></li> <li>Indefinitely chain commands: <code><method>createTask</method>(<string>"buy groceries"</string>, u2, <method>createTask</method>(<string>"make the cake"</string>, u3, <method>createTask</method>(<string>"set the table"</string>, t3.<method>done</method>()))));</code></li> </ul>'
		},
		showTasks: {
			syntax: '<b>User</b>.<method>showTasks</method>(<code>filter</code>)',
			description: 'Shows different types of tasks, either <code><string>"todo"</string></code>, <code><string>"done"</string></code> or <code><string>"all"</string></code>.',
			examples: '<ul><li><code>showTasks(<string>"all"</string>)</code>;</li></ul>'
		},
		describe: {
			syntax: '<b>User/Task</b>.<method>describe</method>()',
			description: "Gives more details on the task/user.",
			examples: '<ul><li><code>u2.<method>describe</method>();</code></li><li><code>t1.<method>describe</method>();</code></ul>'
		},
		changeTask:{
			syntax: '<b>User</b>.<method>changeTask</method>(<code>task</code>)',
			description: 'Changes the task you are currently working on to <code>task</code>.',
			examples: '<ul><li>Change the task to t1: <code><method>changeTask</method>(t1);</code></li></ul>'
		}
	}
});

