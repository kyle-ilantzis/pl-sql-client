(function(pl){

	var main = function() {
		
		pl.DbItemActions.load();
		
		// dummy query here for now
		pl.DbQueryActions.query("SELECT * FROM USERS");
		
		React.render(<pl.App/>,document.body);
	}
	
	pl.main = main;
})(pl||{});