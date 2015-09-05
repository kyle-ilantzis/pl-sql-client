(function(pl){

	var main = function() {
		
		pl.DbItemActions.load();
		
		React.render(<pl.DbList/>,document.body);
	}
	
	pl.main = main;
})(pl||{});