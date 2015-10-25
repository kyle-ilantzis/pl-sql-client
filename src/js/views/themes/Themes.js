(function(pl) {
	
	var TAG = "Themes:::";

	var $defaultTheme;
	var $themes;
	var defaultTheme;
	var themes;
	var lastTheme;

	var init = function() {

		$defaultTheme = jQuery();
		$themes = jQuery();
		defaultTheme = null;
		themes = [];
		lastTheme = null;
	};

	var load = function() {
		
		$themes = jQuery("link[data-theme]");
		
		$defaultTheme = $themes
						.filter('[data-theme-default]')
						.first();
		
		defaultTheme = $defaultTheme.data("theme");
		
		themes = $themes.map(function(_,theme) {
					return jQuery(theme).data("theme");
				 })
				 .get();
		
		console.log(TAG,"available themes",themes,"default theme",$defaultTheme.data("theme"));
		
		pl.SettingsStore.addChangeListener(onSettingsChange);
		
		setTheme(pl.SettingsStore.getTheme());	
	};
	
	var onSettingsChange = function() {
		setTheme(pl.SettingsStore.getTheme());
	};
	
	var setTheme = function(theme) {

		if (lastTheme == theme) {
			return;
		}

		lastTheme = theme;

		var isTheme = function(t) { return jQuery(t).data("theme") === theme; };

		var $theTheme = $themes
			.filter(function(_,t) { return isTheme(t); });
						
		var $otherThemes = $themes
			.filter(function(_,t) { return !isTheme(t); });
						
		$theTheme.attr("rel","stylesheet");			
		$otherThemes.attr("rel",null);			
	};
	
	pl.Themes = {

		_init: init,

		load: load,
		
		getDefaultTheme: function() {
			return defaultTheme;
		},
		
		getThemes: function() {
			return themes;
		}
	};

	init();
})(pl||{});