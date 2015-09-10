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
			console.log(TAG,"dbType changed",db);
			pl.updateState(this, { dbType: {$set: dbType } });
			sender.setDb(db);
		},
		
		onSave: function() {
			console.log(TAG,"edit saved");
			pl.nullToNoop(this.props.onAdd)(this);
		},
		
		onCancel: function(sender,dbType) {
			var db = this.getDefaultDb();
			console.log(TAG,"cancel",db);
			sender.setDb(db);
		},
		
		render: function() {
			
			var db = this.getDefaultDb();
			console.log(TAG,"render",db);
			return <pl.DbEditItem ref="dbEditItem" db={db} onDbTypeChange={this.onDbTypeChange} onSave={this.onSave} onCancel={this.onCancel}/>; 
		}
	});
})(pl||{});