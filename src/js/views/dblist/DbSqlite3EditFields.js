(function(pl) {
	
	var DbSqlite3EditFields = React.createClass({
	
		mixins: [React.addons.LinkedStateMixin],
		
		getInitialState: function() {
			return { path: this.props.db.path };
		},
	
		getDb: function() {
			return pl.extend({},this.state);
		},
	
		clear: pl.noop,
	
		render: function() {
			
			return <div className="DbSqlite3EditFields">
				<div>
					<label>Path</label>
					<input ref="path" name="path" type="text" valueLink={this.linkState('path')}/>
				</div>
			</div>
		}
	});
	
	pl.DbSqlite3EditFields = DbSqlite3EditFields;
})(pl||{});