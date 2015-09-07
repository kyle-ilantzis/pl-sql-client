(function(pl){
	
	pl.App = React.createClass({
		
		render: function() {
			
			return <div className="app">
			
				<pl.DbMultiQuery/>
				
				<pl.DbList/>
			</div>
		}
	});
})(pl||{});