(function(pl) {
	
	var DbSqlite3ItemFields  = React.createClass({
		
		render: function() {
		
			return <div>
				<div>
					<div>Path</div>
					<div>{this.props.db.path}</div>
				</div>
			</div>
		}
	});
	
	pl.DbSqlite3ItemFields = DbSqlite3ItemFields;
})(pl||{});