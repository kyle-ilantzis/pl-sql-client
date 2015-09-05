(function(pl){
	
	pl.App = React.createClass({
		
		render: function() {
			
			return <div className="app">
				<pl.DbList/>
			</div>
		}
	});
})(pl||{});