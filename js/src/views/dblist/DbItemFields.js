(function(pl) {
	
	var DbItemFields = React.createClass({
		
		render: function() {
		
			return <div className="DbItemFields">
				<div className="DbItemFieldsGroup">
					<div>{this.props.db.dbType}</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div>Host</div>
					<div>{this.props.db.host}</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div>Port</div>
					<div>{this.props.db.port}</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div>User</div>
					<div>{this.props.db.user}</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div>Password</div>
					<div>{this.props.db.password}</div>
				</div>
			</div>
		}
	});
	
	pl.DbItemFields = DbItemFields;
})(pl||{});