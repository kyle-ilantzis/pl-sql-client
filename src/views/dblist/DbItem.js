(function(pl) {
	
	var DbItem = React.createClass({

		onEdit: function(e) {
			pl.nullToNoop(this.props.onEdit)(this,this.props.db.id);
			e.preventDefault();
		},

		onDelete: function(e) {
			pl.nullToNoop(this.props.onDelete)(this,this.props.db.id);
			e.preventDefault();
		},

		render: function() {
			
			var createItemFields = function(db) {
				switch(db.dbType) {
					case pl.DB_TYPE_MYSQL:
					case pl.DB_TYPE_POSTGRES:
						return <pl.DbItemFields db={db}/>
					case pl.DB_TYPE_SQLITE3:
						return <pl.DbSqlite3ItemFields db={db}/>
					default:
						return;
				}
			};
		
			return <div>
				{createItemFields(this.props.db)}
				<a href="#" onClick={this.onEdit}>E</a>
				<a href="#" onClick={this.onDelete}>D</a>
			</div>;
		}
	});
	
	pl.DbItem = DbItem;
})(pl||{});