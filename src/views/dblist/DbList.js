(function(pl){

	var TAG = "DbList:::";

	var ADD_DB_ID = "add";
	
	var DEFAULT_ADD_DB = {
		id: ADD_DB_ID,
		dbType: pl.DB_TYPE_MYSQL,
		host: "localhost",
		port: "3306",
		user: "root",
		password: ""
	};

	var DbList = React.createClass({
		
		getInitialState: function() {
			return { dbItems: pl.DbItemStore.getDbItems() };
		},
		
		componentDidMount: function() {
			pl.DbItemStore.addChangeListener(this.onChange);
		},
		
		componentWillUnmount: function() {
			pl.DbItemStore.removeChangeListener(this.onChange);
		},
		
		onChange: function() {
			pl.updateState(this, { dbItems: {$set: pl.DbItemStore.getDbItems()} });
		},
		
		onEdit: function(sender,id) {
			pl.DbItemActions.edit(id);
		},

		onDelete: function(sender,id) {
			pl.DbItemActions.remove(id);
			// TODO - Undo bar appears
		},
		
		onSave: function(sender,id) {
			
			if (id == ADD_DB_ID) {
				pl.DbItemActions.add(sender.getDb());
			}
			else {
				pl.DbItemActions.update(sender.getDb());
			}
		},
		
		onCancel: function(sender,id) {
		
			if (id == ADD_DB_ID) {
				sender.clear();
			}
			else {
				pl.DbItemActions.cancelEdit(id);
			}
		},

		render: function() {

			var that = this;

			var createDbItem = function(dbItem) {
				
				switch(dbItem.state) {
					case pl.DbItemStore.STATE_VIEW:
						return <pl.DbItem key={dbItem.db.id} db={dbItem.db} onEdit={that.onEdit} onDelete={that.onDelete}/>;
					case pl.DbItemStore.STATE_EDIT:
						return <pl.DbEditItem key={dbItem.db.id} db={dbItem.db} onSave={that.onSave} onCancel={that.onCancel}/>;
					default:
						console.log(TAG, "warning: unsupported dbItem.state: " + dbItem.state);
						return;
				}
			};

			return <div>
				{this.state.dbItems.map(createDbItem)}
				<pl.DbEditItem key={ADD_DB_ID} db={DEFAULT_ADD_DB} onSave={that.onSave} onCancel={that.onCancel}/>
			</div>;
		}
	});
	
	pl.DbList = DbList;
})(pl||{});