(function(pl) {
	
	var DbItemFields = React.createClass({
		
		render: function() {
		
			return <div className="DbItemFields">
				<div className="DbItemFieldsGroup">
					<div className="DbItemField">
						<div>Host</div>
						<div>{this.props.db.host}</div>
					</div>
					<div className="DbItemField">
						<div>Port</div>
						<div>{this.props.db.port}</div>
					</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div className="DbItemField">
						<div>Scheme</div>
						<div>{this.props.db.scheme}</div>
					</div>
				</div>
				<div className="DbItemFieldsGroup">
					<div className="DbItemField">
						<div>User</div>
						<div>{this.props.db.user}</div>
					</div>
					<div className="DbItemField">
						<div>Password</div>
						<div>{this.props.db.password}</div>
					</div>
				</div>
			</div>
		}
	});
	
	pl.DbItemFields = DbItemFields;
})(pl||{});