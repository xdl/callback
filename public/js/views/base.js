define([], function() {
	var BaseView = Backbone.View.extend({
		close: function() {
			console.log('calling close');
			this.stopListening();
			this.unbind();

			if (this.destroy) {
				//expliciting unbinding from the global bus.
				this.destroy();
			}

			//propagate this through the child views
			if (this.childViews) {
				this.childViews.forEach(function(childView) {
					childView.close();
				});
			}
		},
		directory: {
			//users: {
				//priv: {
					//u0: "idu0000" //yourself.
				//},
				//pub: {
					//u1: "idu1111",
					//u2: "idu2222",
					//u3: "idu3333",
					//u4: "idu4444"
				//}
			//},
			//tasks: {
				//priv: {
					//t0: "idt0000",
					//t1: "idt1111",
					//t2: "idt2222",
					//t3: "idt3333"
				//},
				//assigned: {
					//t4: "idt4444",
					//t5: "idt5555"
				//},
				//pub: {
					//t6: "idt6666",
					//t7: "idt7777"
				//}
			//}
		}
	});

	return BaseView;
});
