(function(pl) {
	
	var DbEditFields = React.createClass({
		
		mixins: [React.addons.LinkedStateMixin],
		
		getInitialState: function() {
			return {
				host: this.props.db.host,
				port: this.props.db.port,
				user: this.props.db.user,
				password: this.props.db.password
			};
		},
		
		getDb: function() {
			return pl.extend({},this.state);
		},
		
		clear: function() {
			this.setState(this.getInitialState());
		},
		
		render: function() {
		
			return <div>
				<div>
					<label>Host</label>
					<input type="text" valueLink={this.linkState('host')}/>
				</div>
				<div>
					<label>Port</label>
					<input type="text" valueLink={this.linkState('port')}/>
				</div>
				<div>
					<label>User</label>
					<input type="text" valueLink={this.linkState('user')}/>
				</div>
				<div>
					<label>Password</label>
					<input type="text" valueLink={this.linkState('password')}/>
				</div>
			</div>
		}
	});
	
	pl.DbEditFields = DbEditFields;
})(pl||{});