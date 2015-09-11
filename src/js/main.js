(function(pl){

	var main = function() {
		
		pl.Themes.load();
		pl.SettingsActions.load();
		
		React.render(<pl.App/>,document.body);
	}
	
	pl.main = main;
})(pl||{});