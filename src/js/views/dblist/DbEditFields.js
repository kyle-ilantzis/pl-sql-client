(function(pl) {
	
	var DbEditFields = React.createClass({
		
		mixins: [React.addons.LinkedStateMixin],
		
		getInitialState: function() {
			return {
				host: this.props.db.host,
				port: this.props.db.port,
				scheme: this.props.db.scheme,
				user: this.props.db.user,
				password: this.props.db.password
			};
		},
		
		getDb: function() {
			return pl.extend({},this.state);
		},
		
		setDb: function(db) {
			this.setState(db);	
		},
		
		clear: function() {
			this.setState(this.getInitialState());
		},
		
		render: function() {
		
			return <div className="DbEditFields">
				<div className="DbEditFieldsGroup">
					<div>
						<label>Host</label>
						<input type="text" valueLink={this.linkState('host')}/>
					</div>
					<div>
						<label>Port</label>
						<input type="text" valueLink={this.linkState('port')}/>
					</div>
				</div>
				<div className="DbEditFieldsGroup">
					<div>
						<label>Scheme</label>
						<input type="text" valueLink={this.linkState('scheme')}/>
					</div>
				</div>
				<div className="DbEditFieldsGroup">
					<div>
						<label>User</label>
						<input type="text" valueLink={this.linkState('user')}/>
					</div>
					<div>
						<label>Password</label>
						<input type="text" valueLink={this.linkState('password')}/>
					</div>
				</div>
			</div>
		}
	});
	
	pl.DbEditFields = DbEditFields;
})(pl||{});