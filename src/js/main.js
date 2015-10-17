(function(pl){

	var main = function() {

		pl.Window.load();
		pl.Themes.load();
		pl.SettingsActions.load();
		pl.HistoryActions.load();

		React.render(<pl.App/>,document.body);
	}

	pl.main = main;
})(pl||{});
