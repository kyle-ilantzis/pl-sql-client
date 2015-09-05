(function(pl) {
	
	var DbItemFields = React.createClass({
		
		render: function() {
		
			return <div>
				<div>
					<div>Host</div>
					<div>{this.props.db.host}</div>
				</div>
				<div>
					<div>Port</div>
					<div>{this.props.db.port}</div>
				</div>
				<div>
					<div>User</div>
					<div>{this.props.db.user}</div>
				</div>
				<div>
					<div>Password</div>
					<div>{this.props.db.password}</div>
				</div>
			</div>
		}
	});
	
	pl.DbItemFields = DbItemFields;
})(pl||{});