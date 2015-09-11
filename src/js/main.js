(function(pl){

	var main = function() {
		
		pl.DbItemActions.load();
		
		React.render(<pl.App/>,document.body);
	}
	
	pl.main = main;
})(pl||{});