(function(pl) {
	
	var TAG = "DbAddItem:::";
	
	pl.DbAddItem = React.createClass({
		
		getInitialState: function() {
			return { dbType: this.props.defaultDbType };	
		},
		
		getDb: function() {
			return this.refs.dbEditItem.getDb();
		},
		
		getDefaultDb: function(dbType) {
			return pl.DbTypes.DB_DEFAULTS[dbType||this.state.dbType];
		},
		
		onDbTypeChange: function(sender,dbType) {
			var db = this.getDefaultDb(dbType);
			pl.updateState(this, { dbType: {$set: dbType } });
			sender.setDb(db);
		},
		
		onSave: function() {
			pl.nullToNoop(this.props.onAdd)(this);
		},
		
		onCancel: function(sender,dbType) {
			sender.setDb(this.getDefaultDb());
		},
		
		render: function() {
			return <pl.DbEditItem ref="dbEditItem" db={this.getDefaultDb()} onDbTypeChange={this.onDbTypeChange} onSave={this.onSave} onCancel={this.onCancel}/>; 
		}
	});
})(pl||{});