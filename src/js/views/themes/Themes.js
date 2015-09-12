(function(pl) {
	
	var TAG = "Themes:::";
	
	var $themes = jQuery();
	
	var themes = [];
	
	var load = function() {
		
		$themes = jQuery("link[data-theme]");
		
		themes = $themes.map(function(_,theme) {
					return jQuery(theme).data("theme");
				 })
				 .get();
		
		console.log(TAG,"available themes",themes);
		
		pl.SettingsStore.addChangeListener(onSettingsChange);
		
		setTheme(pl.SettingsStore.getTheme());	
	};
	
	var onSettingsChange = function() {
		setTheme(pl.SettingsStore.getTheme());
	};
	
	var setTheme = function(theme) {

		$themes
			.attr("rel",null)
			.filter(function(_,t) { return jQuery(t).data("theme") === theme; })
			.attr("rel","stylesheet");
	};
	
	pl.Themes = {
		
		load: load,
		
		getThemes: function() {
			return themes;
		}
	};
})(pl||{});