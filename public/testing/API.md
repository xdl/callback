# Methods reference
---

## User

### Private
* do/createTask(String, User, Method): void
* changeTask(Task): void
* message(String, User): void
* showAPI(): //brings up the manual *not yet done*
* dismiss() //brings back the old home screen

### Public
* showActivities([String = "all"]):String *not yet done*
* showTasks(): String  //other args: done, todo, all, authored, created //i think we need created-todo, created-done, and created-all as well.

## Task

### Private //created by you (delegator == you)
* amend(String):void 
* delete(): void

### Assigned //assigned to you (delegate == you)
* done([String]): void

### Public (neither)
* describe():void

---

# Examples

createTask("Take out the trash", u2);

defaults to:

createTask("Take out the trash.", u2, function(task, message) {message(msg, me);});
createTask({
	task: String,
	user: User,
	done: function(task, message);
});
subscribe(this);

>Singular use

creatTask('do this'); //creates a task called 'do this' for you
createTask('you do this', u2); //creates a task called 'you do this' for u2

>With callbacks

createTask('you do this', u1, t1.done()); //create a task for u1, then when he's finished it, you get marked done.
>note:
createTask('i do this', t1.done()); //this is not supported! Need the user as well, if you want to add a callback.

>Recursive with useing createTask as a callback:

createTask('you do this', u2, function() {changeTask(t3)}); //creates a task called 'you do this' for u2. When it is marked done, your active task will be changed to t3. Can nest this indefinitely.

>Callback shorthands

createTask("Take out the trash, bring the dogs in, eat cake", u2, u3, u4); //instead of using callbacks all the time.
createTask('blah, another thing, a few more times.', u2, u3, u4, t1.done()); //top it off with another callback.

createTask("Take out the trash", u2, t1.done());
createTask("blah", u2, function() {changeTask(t3)});

createTask('blah', u2, function(){changeTask(t3)});


createTask("Take out the trash", u2);
createTask("Take out the trash", u2, function(msg) { message(msg, [u1, u2, u3]);});

message("Hey, how's it going?", u2);

to several people:

message("Yo yo yo", [u1,u2,u3]);

createTask("finish it", u2, function() { t1.markDone()});

## **User**.done(`[comment]`)

Marks a task as done, optionally leaving a `comment`.

### Parameters:

* `[comment]` <String> Comment to leave

### Examples:

t1.done();

t2.done('Boy, that sure took a long time!');

## **User**.do(`[tasks], [users], [callback]`)

Alias for createTask

### Parameters:

* `[comment]` <String> Comment to leave

### Examples:

t1.done();

t2.done('Boy, that sure took a long time!');

