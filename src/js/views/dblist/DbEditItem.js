(function(pl) {
	
	var TAG = "DbEditItem:::";
	
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
		
		setDb: function(db) {
			this.refs.dbEditFields.setDb(db);
			pl.updateState(this, {db: {$set: db}});
		},
		
		onDbTypeChange: function(sender,dbType) {
			pl.updateState(this, { db: { dbType: {$set: dbType} } });
			pl.nullToNoop(this.props.onDbTypeChange)(this,dbType);						
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
						return <pl.DbEditFields ref="dbEditFields" db={db}/>;
					default:
						console.log(TAG,"can't create fields for dbType:",db.dbType);
						return;
				}
			};
			
			return <div className="DbEditItem">
				
				<div className="DbEditFieldsGroup">
					<pl.DbTypeSpinner ref="dbTypeSpinner" dbType={this.state.db.dbType} onChange={this.onDbTypeChange}/>
				</div>
				
				{ createDbEditFields(this.state.db) }
				
				<div className="DbEditItemActions">
					<button className="Save" onClick={this.onSave}>Save</button>
					<button className="Cancel" onClick={this.onCancel}>Cancel</button>
				</div>
			</div>;
		}
	});
	
	pl.DbEditItem = DbEditItem;
})(pl||{});