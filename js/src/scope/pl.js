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
		
		noop: function(){},
		
		nullToNoop: function(f) { return f ? f : noop; },
		
		findIndex: function(arr,f) {
			
			var len = arr.length;
			for(var i = 0; i < len; i++) {
				if (f(arr[i])) {
					return i;
				}
			}
			
			return -1;
		},
		
		update: function(it,cmd) {
			return React.addons.update(it,cmd);
		},
		
		updateState: function(that,cmd) {
			that.setState(React.addons.update(that.state,cmd));
		},
		
		include: function(that,props) {
			props.forEach(function(prop) { that[prop] = pl[prop]; });
		},
		
		observable: function(it) {
			
			var callbacks = [];
			
			var notify = function() {
				callbacks.forEach(function(cb) {
					cb();
				});
			}
			
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
			
			return notify;
		}
	});
})(window);