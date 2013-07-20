#Methods reference

---

##User

###Private
* createTask(String, User, Method): void
* changeTask(Task): void
* message(String, User[]): void

###Public
* listActivities([String = "all"]):String
* listTasks(): String  //other args: pending, finished, active, all

##Task

###Private
* amend(String):void 
* delete(): void

###Public
* done([String]): void

---

#Examples

createTask("Take out the trash", u2);

defaults to:

createTask("Take out the trash.", u2, function(task, message) {message(msg, me);});
createTask({
	task: String,
	user: User,
	done: function(task, message);
});
subscribe(this);

createTask("Take out the trash", u2, t1.done());
createTask("blah", u2, changeTask(t3));

createTask("Take out the trash", u2);
createTask("Take out the trash, bring the dogs in, eat cake", u2, u3, u4);
createTask("Take out the trash", u2, function(msg) { message(msg, [u1, u2, u3]);});

message("Hey, how's it going?", u2);

to several people:

message("Yo yo yo", [u1,u2,u3]);




createTask("finish it", u2, function() { t1.markDone()});
