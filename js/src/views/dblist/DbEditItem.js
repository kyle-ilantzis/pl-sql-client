(function(pl) {
	
	var DbEditItem = React.createClass({
		
		getInitialState: function() {
			return { db: this.props.db };
		},
		
		getDb: function() {
			
			return pl.extend(
				this.refs.dbEditFields.getDb(),
				{ id: this.state.db.id, dbType: this.refs.dbTypeSpinner.getDbType() }
			);
		},
		
		clear: function() {
			this.refs.dbEditFields.clear();
			this.setState(this.getInitialState());
		},
		
		onDbTypeChange: function(sender,dbType) {
			pl.updateState(this, { db: { dbType: {$set: dbType} } });
		},
	
		onSave: function(e) {
			pl.nullToNoop(this.props.onSave)(this,this.props.db.id);
			e.preventDefault();
		},
	
		onCancel: function(e) {
			pl.nullToNoop(this.props.onCancel)(this,this.props.db.id);
			e.preventDefault();
		},
	
		render: function() {
		
			var createDbEditFields = function(db) {
				switch(db.dbType) {
					case pl.DbTypes.DB_TYPE_MYSQL:
					case pl.DbTypes.DB_TYPE_POSTGRES:
						return <pl.DbEditFields ref="dbEditFields" db={db}/>
					case pl.DbTypes.DB_TYPE_SQLITE3:
						return <pl.DbSqlite3EditFields ref="dbEditFields" db={db}/>
					default:
						return;
				}
			};
			
			return <div>
				<pl.DbTypeSpinner ref="dbTypeSpinner" dbType={this.state.db.dbType} onChange={this.onDbTypeChange}/>
				{ createDbEditFields(this.state.db) }
				<a href="#" onClick={this.onSave}>S</a>
				<a href="#" onClick={this.onCancel}>C</a>
			</div>;
		}
	});
	
	pl.DbEditItem = DbEditItem;
})(pl||{});