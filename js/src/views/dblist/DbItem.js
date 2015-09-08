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
					case pl.DbTypes.DB_TYPE_MYSQL:
					case pl.DbTypes.DB_TYPE_POSTGRES:
						return <pl.DbItemFields db={db}/>
					case pl.DbTypes.DB_TYPE_SQLITE3:
						return <pl.DbSqlite3ItemFields db={db}/>
					default:
						return;
				}
			};
		
			return <div className="DbItem">
			
				<div  className="DbType">
					<div>
						<div>{this.props.db.dbType}</div>
					</div>
				</div>
			
				{createItemFields(this.props.db)}
				
				<div className="DbItemActions">
					<button className="Edit" onClick={this.onEdit}>Edit</button>
					<button className="Cancel" onClick={this.onDelete}>Delete</button>
				</div>
			</div>;
		}
	});
	
	pl.DbItem = DbItem;
})(pl||{});