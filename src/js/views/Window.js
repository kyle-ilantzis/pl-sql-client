(function(pl) {

	var TAG = "Window:::";

	var gui = require('nw.gui');
  var win = gui.Window.get();

	var load = function() {

		pl.SettingsStore.addChangeListener(onSettingsChange);

    gui.Window.get().on('resize', function(width, height) {
      pl.SettingsActions.setSize(width, height);
    });

    gui.Window.get().on('close', function() {

      pl.SettingsActions.setSize(win.width, win.height);

      // from nwjs documentation
       // If developer is listening to the close event of a window, the Window.close() call to that window will not close the window but send the close event.
       // Usually you would do some shutdown work in the callback of close event, and then call this.close(true) to really close the window, which will not be caught again. Forgetting to add true when calling this.close() in the callback will result in infinite loop.
      this.close(true);
    });
	};

	var onSettingsChange = function() {
		if (pl.SettingsStore.isInitial()){
			resize(pl.SettingsStore.getWidth(), pl.SettingsStore.getHeight());
		}
	};

	var resize = function(width, height) {
		if (width === win.width && height === win.height){
			return;
		}

    if (width !== null) {
      win.width = width;
    }

    if (height !== null) {
      win.height = height;
    }
	};

	pl.Window = {
		load: load
	};
})(pl||{});
