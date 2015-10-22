(function(window) {

	var pl = {
		extend: function extend(a, b){
			for(var key in b)
				if(b.hasOwnProperty(key))
					a[key] = b[key];
			return a;
		}
	};

	window.pl = pl.extend(pl, {

		nullToNoop: function(f) { return f ? f : function(){}; },

		all: function(arr, p) {
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				if(!p(arr[i])) {
					return false;
				}
			}
			return true;
		},

		update: function(it,cmd) {
			return React.addons.update(it,cmd);
		},

		updateState: function(that,cmd) {
			that.setState(React.addons.update(that.state,cmd));
		},

		observable: function(it) {

			var callbacks;

			var notify = function() {
				callbacks.forEach(function(cb) {
					cb();
				});
			}

			notify.init = function() {
				callbacks = [];
			};

			pl.extend(it, {

				addChangeListener: function(callback) {
					callbacks.push(callback);
				},

				removeChangeListener: function(callback) {
					var i = callbacks.indexOf(callback);
					if (i !== -1) {
						callbacks.splice(i,1);
					}
				}
			});

			notify.init();

			return notify;
		}
	});
})(window);