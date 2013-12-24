# callBack

A command-line inspired collaborative todo list manager.

Demo [here](http://callback.xiaodili.com).

## Commands reference

***

**Task**.done([comment])

Marks a task as done, optionally leaving a comment.

* `t2.done("boy that took a long time.");`

***

**User**.do(...args)

Creates new task(s). (Alias for createTask.)

* `do("finish homework");`
* Create several tasks: `do("finish homework, watch itchy and scratchy, play with milhouse");`
* Create a task for someone else: `do("wash the car", u2);`
* When finished, perform another command: `do("wash the car", u2, do("do the dishes", u2));`
* Indefinitely chain commands: `do("buy groceries", u2, do("make the cake", u3, do("set the table", t3.done()))));`

***

**User**.createTask(...args)

Creates new task(s).

* `createTask("finish homework");`
* Create several tasks: `createTask("finish homework, watch itchy and scratchy, play with milhouse");`
* Create a task for someone else: `createTask("wash the car", u2);`
* When finished, perform another command: `createTask("wash the car", u2, createTask("do the dishes", u2));`
* Indefinitely chain commands: `createTask("buy groceries", u2, createTask("make the cake", u3, createTask("set the table", t3.done()))));`

***

**User**.showTasks(filter)

Shows different types of tasks, either "todo", "done" or "all".

* `showTasks("all");`

***

**User/Task**.describe()

Gives more details on the task/user.

* `u2.describe();`
* `t1.describe();`

***

**User**.changeTask(task)

Changes the task you are currently working on to task.

* Change the task to t1: `changeTask(t1);`

***

## Installation

Requires Node.js and Mongodb installed.

	git clone https://github.com/xiaodili/callback.git

	cd callback

	npm install

	node app

## Background information

This is a summer pet project I undertook in order to have a go at making a full-stack web application. At the time I had just discovered Vim, so I dedicate this app as an ode to command-line/terminal based tools.

## Libraries/Frameworks

* RequireJS
* Backbone
* Mongoose
* Express
* QUnit
