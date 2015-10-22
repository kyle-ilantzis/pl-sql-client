(function(pl) {
	var gui = require('nw.gui');
	var win = gui.Window.get();

	var TAG = "Window:::";

	// How long to wait before setting the new window rect dimensions
	var SET_WINDOW_RECT_DELAY = 500;

	var loaded = false;

	var setWindowRectTimeoutId = null;

	var load = function() {

		if ( pl.SettingsStore.getWindowRect() == null ) {
			pl.SettingsStore.addChangeListener(onSettingsChange);
		} else {
			registerWindowListeners();
		}
	};

	var onSettingsChange = function() {

		if (loaded){
			return;
		}

		loaded = true;

		registerWindowListeners();
	};

	var registerWindowListeners = function() {

		// set the window dimensions for the first only time.
		// After this we should not need to set them again.
		var windowRect = pl.SettingsStore.getWindowRect();
		if (windowRect != null ) {
			win.x = windowRect.x;
			win.y = windowRect.y;
			win.height = windowRect.height;
			win.width = windowRect.width;
		}

		win.on('move', postSetWindowRect);
		win.on('resize', postSetWindowRect);

		// When the window is closed we also save the window dimensions.
		// This makes a multi-instance app save the dimensions of the last window closed.
		win.on('close', function() {

			pl.SettingsActions.setWindowRect(win.x, win.y, win.width, win.height);

			// from nwjs documentation
			// If developer is listening to the close event of a window, the Window.close() call to that window will not close the window but send the close event.
			// Usually you would do some shutdown work in the callback of close event, and then call this.close(true) to really close the window, which will not be caught again. Forgetting to add true when calling this.close() in the callback will result in infinite loop.
			this.close(true);
		});
	}

	// Delays setting the window rectangle because resize events
	// happen continuously as the user changes the window size.
	var postSetWindowRect = function() {

		if ( setWindowRectTimeoutId ) {
			clearTimeout( setWindowRectTimeoutId );
			setWindowRectTimeoutId = null;
		}

		setWindowRectTimeoutId = setTimeout(function() {

			pl.SettingsActions.setWindowRect(win.x, win.y, win.width, win.height);
			setWindowRectTimeoutId = null;

		}, SET_WINDOW_RECT_DELAY);
	};

	pl.Window = {
		load: load
	};
})(pl||{});
