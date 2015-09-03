(function(window){
		var noop = function() {};
		var nullToNoop = function(f) { return f ? f : noop; }
		
		function extend(a, b){
			for(var key in b)
				if(b.hasOwnProperty(key))
					a[key] = b[key];
			return a;
		}
		
		function findIndex(arr,f) {
			
			var len = arr.length;
			for(var i = 0; i < len; i++) {
				if (f(arr[i])) {
					return i;
				}
			}
			
			return -1;
		}
		
		var update = function(that,cmd) {
			that.setState(React.addons.update(that.state,cmd));
		};
		
		var DB_TYPE_NIL = "";
		var DB_TYPE_MYSQL = "MYSQL";
		var DB_TYPE_POSTGRES = "POSTGRES";
		var DB_TYPE_SQLITE3 = "SQLITE3";
	
		var DB_TYPES = [DB_TYPE_MYSQL, DB_TYPE_POSTGRES, DB_TYPE_SQLITE3];
		
		var ADD_DB_ID = "add";
		
		var DEFAULT_ADD_DB = {
			id: ADD_DB_ID,
			dbType: DB_TYPE_MYSQL,
			host: "localhost",
			port: "3306",
			user: "root",
			password: ""
		};
	
		var STATE_VIEW = "VIEW";
		var STATE_EDIT = "EDIT";
		
		var DbTypeSpinner = React.createClass({
		
			getDbType: function() {
				var select = this.refs.select.getDOMNode();
				var option = select.options[select.selectedIndex];
				return option.label;
			},
		
			onChange: function() {
				nullToNoop(this.props.onChange)(this,this.getDbType());
			},

			render: function() {

				var that = this;
			
				var createOption = function(db,i) {
					return <option key={i}>{db}</option>;
				};

				return <select ref="select" onChange={this.onChange} defaultValue={this.props.dbType}>
					{ DB_TYPES.map(createOption) }
				</select>;
			}
		});
		
		var DbEditFields = React.createClass({
			
			mixins: [React.addons.LinkedStateMixin],
			
			getInitialState: function() {
				return {
					host: this.props.db.host,
					port: this.props.db.port,
					user: this.props.db.user,
					password: this.props.db.password
				};
			},
			
			getDb: function() {
				return extend({},this.state);
			},
			
			clear: function() {
				this.setState(this.getInitialState());
			},
			
			render: function() {
			
				return <div>
					<div>
						<label>Host</label>
						<input type="text" valueLink={this.linkState('host')}/>
					</div>
					<div>
						<label>Port</label>
						<input type="text" valueLink={this.linkState('port')}/>
					</div>
					<div>
						<label>User</label>
						<input type="text" valueLink={this.linkState('user')}/>
					</div>
					<div>
						<label>Password</label>
						<input type="text" valueLink={this.linkState('password')}/>
					</div>
				</div>
			}
		});

		var DbSqlite3EditFields = React.createClass({
		
			mixins: [React.addons.LinkedStateMixin],
			
			getInitialState: function() {
				return { path: this.props.db.path };
			},
		
			getDb: function() {
				return extend({},this.state);
			},
		
			clear: noop,
		
			render: function() {
				
				return <div>
					<div>
						<label>Path</label>
						<input ref="path" name="path" type="text" valueLink={this.linkState('path')}/>
					</div>
				</div>
			}
		});
		
		var DbItemFields = React.createClass({
			
			render: function() {
			
				return <div>
					<div>
						<div>Host</div>
						<div>{this.props.db.host}</div>
					</div>
					<div>
						<div>Port</div>
						<div>{this.props.db.port}</div>
					</div>
					<div>
						<div>User</div>
						<div>{this.props.db.user}</div>
					</div>
					<div>
						<div>Password</div>
						<div>{this.props.db.password}</div>
					</div>
				</div>
			}
		});
		
		var DbSqlite3ItemFields  = React.createClass({
			
			render: function() {
			
				return <div>
					<div>
						<div>Path</div>
						<div>{this.props.db.path}</div>
					</div>
				</div>
			}
		});
		
		var DbItem = React.createClass({

			onEdit: function(e) {
				nullToNoop(this.props.onEdit)(this,this.props.db.id);
				e.preventDefault();
			},

			onDelete: function(e) {
				nullToNoop(this.props.onDelete)(this,this.props.db.id);
				e.preventDefault();
			},

			render: function() {
				
				var createItemFields = function(db) {
					switch(db.dbType) {
						case DB_TYPE_MYSQL:
						case DB_TYPE_POSTGRES:
							return <DbItemFields db={db}/>
						case DB_TYPE_SQLITE3:
							return <DbSqlite3ItemFields db={db}/>
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

		var DbEditItem = React.createClass({
			
			getInitialState: function() {
				return { db: this.props.db };
			},
			
			getDb: function() {
				
				return extend(
					this.refs.dbEditFields.getDb(),
					{ id: this.state.db.id, dbType: this.refs.dbTypeSpinner.getDbType() }
				);
			},
			
			clear: function() {
				this.refs.dbEditFields.clear();
				this.setState(this.getInitialState());
			},
			
			onDbTypeChange: function(sender,dbType) {
				update(this, { db: { dbType: {$set: dbType} } });
			},
		
			onSave: function(e) {
				nullToNoop(this.props.onSave)(this,this.props.db.id);
				e.preventDefault();
			},
		
			onCancel: function(e) {
				nullToNoop(this.props.onCancel)(this,this.props.db.id);
				e.preventDefault();
			},
		
			render: function() {
			
				var createDbEditFields = function(db) {
					switch(db.dbType) {
						case DB_TYPE_MYSQL:
						case DB_TYPE_POSTGRES:
							return <DbEditFields ref="dbEditFields" db={db}/>
						case DB_TYPE_SQLITE3:
							return <DbSqlite3EditFields ref="dbEditFields" db={db}/>
						default:
							return;
					}
				};
				
				return <div>
					<DbTypeSpinner ref="dbTypeSpinner" dbType={this.state.db.dbType} onChange={this.onDbTypeChange}/>
					{ createDbEditFields(this.state.db) }
					<a href="#" onClick={this.onSave}>S</a>
					<a href="#" onClick={this.onCancel}>C</a>
				</div>;
			}
		});

		var DbList = React.createClass({
			
			getInitialState: function() {
			
				var dbItems = this.props.dbs.map(function(db,i){	
					
					var mappedDb = extend({},db);
					mappedDb.id = i;
				
					return { state: STATE_VIEW, db: mappedDb };
				});
			
				var idSeq = dbItems.length == 0 ? 0 : dbItems[dbItems.length-1].db.id + 1;
				
				return { idSeq: idSeq, dbItems: dbItems };
			},
			
			getDbItemIndex: function(id) {
				return findIndex(this.state.dbItems, function(dbItem) { return dbItem.db.id === id; });
			},
			
			updateDbItem: function(id, f) {
			
				var i = this.getDbItemIndex(id);
				if ( i !== -1 ) {
					var newDbItem = f( extend({},this.state.dbItems[i]) );
					update(this, { dbItems: {$splice: [[i,1,newDbItem]]} });
				}				
			},
			
			onEdit: function(sender,id) {
				this.updateDbItem(id, function(dbItem) {
					return extend( dbItem, {state: STATE_EDIT} );
				});
			},

			onDelete: function(sender,id) {
			
				var i = this.getDbItemIndex(id);
				if ( i !== -1 ) {
					update(this, { dbItems: {$splice: [[i,1]]} });
				}	

				// TODO - Undo bar appears
			},
			
			onSave: function(sender,id) {
				
				if (id == ADD_DB_ID) {
					
					var idSeq = this.state.idSeq;
					
					var newDb = this.refs.dbAddItem.getDb();
					newDb.id = idSeq++;
					
					var newDbItem = { state: STATE_VIEW, db: newDb };
				
					update(this, { idSeq: {$set: idSeq}, dbItems: {$push: [newDbItem]}});
				}
				else {
					this.updateDbItem(id, function(dbItem) {
						return extend( dbItem, {state: STATE_VIEW, db: sender.getDb()} );
					});
				}
			},
			
			onCancel: function(sender,id) {
			
				if (id == ADD_DB_ID) {
					sender.clear();
				}
				else {
					this.updateDbItem(id, function(dbItem) {
						return extend( dbItem, {state: STATE_VIEW} );
					});
				}
			},

			render: function() {

				var that = this;

				var createDbItem = function(dbItem) {
					
					switch(dbItem.state) {
						case STATE_VIEW:
							return <DbItem key={dbItem.db.id} db={dbItem.db} onEdit={that.onEdit} onDelete={that.onDelete}/>;
						case STATE_EDIT:
							return <DbEditItem key={dbItem.db.id} db={dbItem.db} onSave={that.onSave} onCancel={that.onCancel}/>;
						default:
							console.log("warning: unsupported dbItem.state: " + dbItem.state);
							return;
					}
				};

				return <div>
					{this.state.dbItems.map(createDbItem)}
					<DbEditItem ref="dbAddItem" key={ADD_DB_ID} db={DEFAULT_ADD_DB} onSave={that.onSave} onCancel={that.onCancel}/>
				</div>;
			}
		});
		
		window.DB_TYPE_NIL = DB_TYPE_NIL;
		window.DB_TYPE_MYSQL = DB_TYPE_MYSQL;
		window.DB_TYPE_POSTGRES = DB_TYPE_POSTGRES;
		window.DB_TYPE_SQLITE3 = DB_TYPE_SQLITE3;
		window.DB_TYPES = DB_TYPES;
		window.DbList = DbList;
})(window);