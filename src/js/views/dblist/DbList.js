(function(pl){

	var TAG = "DbList:::";

	var DEFAULT_ADD_DB_TYPE = pl.DbTypes.DB_TYPE_MYSQL;

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

		onAdd: function(sender) {
			pl.DbItemActions.add(sender.getDb());
		},

		onSave: function(sender,id) {			
			pl.DbItemActions.update(sender.getDb());
		},

		onCancel: function(sender,id) {
			pl.DbItemActions.cancelEdit(id);
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

			return <div className="DbList">
				<h1>Databases</h1>
				<pl.DbAddItem defaultDbType={DEFAULT_ADD_DB_TYPE} onAdd={this.onAdd}/>
				{this.state.dbItems.map(createDbItem)}
			</div>;
		}
	});

	pl.DbList = DbList;
})(pl||{});
