(function(pl) {
	
	var DbSqlite3ItemFields  = React.createClass({
		
		render: function() {
		
			return <div className="DbSqlite3ItemFields">
				<div className="DbItemFieldsGroup">
					<div>Path</div>
					<div>{this.props.db.path}</div>
				</div>
			</div>
		}
	});
	
	pl.DbSqlite3ItemFields = DbSqlite3ItemFields;
})(pl||{});