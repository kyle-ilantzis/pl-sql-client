(function(pl) {
	
	var TAG = "Themes:::";
	
	var THEME_LIGHT = "light";
	var THEME_DARK = "dark";
	var THEMES = ["light", "dark"];
	var THEME_DEFAULT = THEME_LIGHT;
	
	var load = function() {
		pl.SettingsStore.addChangeListener(onSettingsChange);		
		setTheme(pl.SettingsStore.getTheme());	
	};
	
	var onSettingsChange = function() {
		setTheme(pl.SettingsStore.getTheme());
	};
	
	var setTheme = function(theme) {
		
		var i = THEMES.indexOf(theme);
		var hasTheme = i >= 0;
		
		var newTheme = hasTheme ? theme : THEME_DEFAULT;
		
		var html = document.body.parentElement;		
		html.className = newTheme;
	};
	
	pl.Themes = {
		
		load: load,
		
		getThemes: function() {
			return THEMES;
		}
	};
})(pl||{});