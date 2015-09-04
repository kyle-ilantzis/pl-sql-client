(function(pl){

	var ADD_DB_ID = "add";
	
	var DEFAULT_ADD_DB = {
		id: ADD_DB_ID,
		dbType: pl.DB_TYPE_MYSQL,
		host: "localhost",
		port: "3306",
		user: "root",
		password: ""
	};

	var STATE_VIEW = "VIEW";
	var STATE_EDIT = "EDIT";

	var DbList = React.createClass({
		
		getInitialState: function() {
		
			var dbItems = this.props.dbs.map(function(db,i){	
				
				var mappedDb = pl.extend({},db);
				mappedDb.id = i;
			
				return { state: STATE_VIEW, db: mappedDb };
			});
		
			var idSeq = dbItems.length == 0 ? 0 : dbItems[dbItems.length-1].db.id + 1;
			
			return { idSeq: idSeq, dbItems: dbItems };
		},
		
		getDbItemIndex: function(id) {
			return pl.findIndex(this.state.dbItems, function(dbItem) { return dbItem.db.id === id; });
		},
		
		updateDbItem: function(id, f) {
		
			var i = this.getDbItemIndex(id);
			if ( i !== -1 ) {
				var newDbItem = f( pl.extend({},this.state.dbItems[i]) );
				pl.update(this, { dbItems: {$splice: [[i,1,newDbItem]]} });
			}				
		},
		
		onEdit: function(sender,id) {
			this.updateDbItem(id, function(dbItem) {
				return pl.extend( dbItem, {state: STATE_EDIT} );
			});
		},

		onDelete: function(sender,id) {
		
			var i = this.getDbItemIndex(id);
			if ( i !== -1 ) {
				pl.update(this, { dbItems: {$splice: [[i,1]]} });
			}	

			// TODO - Undo bar appears
		},
		
		onSave: function(sender,id) {
			
			if (id == ADD_DB_ID) {
				
				var idSeq = this.state.idSeq;
				
				var newDb = this.refs.dbAddItem.getDb();
				newDb.id = idSeq++;
				
				var newDbItem = { state: STATE_VIEW, db: newDb };
			
				pl.update(this, { idSeq: {$set: idSeq}, dbItems: {$push: [newDbItem]}});
			}
			else {
				this.updateDbItem(id, function(dbItem) {
					return pl.extend( dbItem, {state: STATE_VIEW, db: sender.getDb()} );
				});
			}
		},
		
		onCancel: function(sender,id) {
		
			if (id == ADD_DB_ID) {
				sender.clear();
			}
			else {
				this.updateDbItem(id, function(dbItem) {
					return pl.extend( dbItem, {state: STATE_VIEW} );
				});
			}
		},

		render: function() {

			var that = this;

			var createDbItem = function(dbItem) {
				
				switch(dbItem.state) {
					case STATE_VIEW:
						return <pl.DbItem key={dbItem.db.id} db={dbItem.db} onEdit={that.onEdit} onDelete={that.onDelete}/>;
					case STATE_EDIT:
						return <pl.DbEditItem key={dbItem.db.id} db={dbItem.db} onSave={that.onSave} onCancel={that.onCancel}/>;
					default:
						console.log("warning: unsupported dbItem.state: " + dbItem.state);
						return;
				}
			};

			return <div>
				{this.state.dbItems.map(createDbItem)}
				<pl.DbEditItem ref="dbAddItem" key={ADD_DB_ID} db={DEFAULT_ADD_DB} onSave={that.onSave} onCancel={that.onCancel}/>
			</div>;
		}
	});
	
	pl.DbList = DbList;
})(pl||{});