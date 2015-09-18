(function(pl) {
	
	var TAG = "Themes:::";
	
	var $themes = jQuery();
	
	var $defaultTheme;
	
	var defaultTheme;
	var themes = [];
	
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

		var isTheme = function(t) { return jQuery(t).data("theme") === theme; };

		var $maybeTheme = $themes
			.filter(function(_,t) { return isTheme(t); });
			
		var $theTheme = $maybeTheme.length > 0 ? $maybeTheme : $defaultTheme;
			
		$theTheme
			.attr("rel","stylesheet");
			
		$themes
			.filter(function(_,t) { return !isTheme(t); })
			.attr("rel",null);	
	};
	
	pl.Themes = {
		
		load: load,
		
		getDefaultTheme: function() {
			return defaultTheme;
		},
		
		getThemes: function() {
			return themes;
		}
	};
})(pl||{});