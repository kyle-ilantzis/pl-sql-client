/*!
	pl-sql-client - Query many database at once
    Copyright (C) 2015  Kyle Ilantzis, Pier-Luc Caron St-Pierre

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(pl) {

	var TAG = "DbItemStore:::";
	var NAME = "DbItemStore";

	var DbItemStore = {
		
		LOAD: "DbItemStore-LOAD",
		LOADED: "DbItemStore-LOADED",
		
		EDIT: "DbItemStore-EDIT",
		CANCEL_EDIT: "DbItemStore-CANCEL_EDIT",
		ADD: "DbItemStore-ADD",
		UPDATE: "DbItemStore-UDPATE",
		DELETE: "DbItemStore-DELETE",
			
		STATE_VIEW: "DbItemStore-STATE_VIEW",
		STATE_EDIT: "DbItemStore-STATE_EDIT"
	}

	var idSeq;
	var dbItems = null;
	var callbacks = [];
	
	var notify = function() {
		callbacks.forEach(function(cb) {
			cb();
		});
	}
	
	var getDbItemIndex = function(id) {		
		return pl.findIndex(dbItems, function(dbItem) { return dbItem.db.id === id; });
	};
		
	var updateDbItem = function(id, f) {
	
		var i = getDbItemIndex(id);
		if ( i !== -1 ) {
			var newDbItem = f( pl.extend({},dbItems[i]) );
			dbItems = pl.update(dbItems, {$splice: [[i,1,newDbItem]]});
		}				
	};
	
	var load = function() {
	
		// TODO - Fetch the dbItems from disk/network/whatever
		
		pl.DbItemActions.loaded([
			{ host: "localhost", port: "3306", username:"", password: "", dbType: pl.DB_TYPE_MYSQL},
			{ host: "localhost", port: "4545", username:"", password: "", dbType: pl.DB_TYPE_POSTGRES}
		]);
	};
	
	var loaded = function(dbs) {
		
		dbItems = dbs.map(function(db,i){	
				
			var mappedDb = pl.extend({},db);
			mappedDb.id = i;
		
			return { state: DbItemStore.STATE_VIEW, db: mappedDb };
		});
		
		idSeq = dbItems.length == 0 ? 0 : dbItems[dbItems.length-1].db.id + 1;
		
		notify();		
	}
	
	var edit = function(id) {
		
		updateDbItem(id, function(dbItem) {
			return pl.extend( dbItem, {state: DbItemStore.STATE_EDIT} );
		});
		
		notify();
	};
	
	var cancelEdit = function(id) {
		
		updateDbItem(id, function(dbItem) {
			return pl.extend( dbItem, {state: DbItemStore.STATE_VIEW} );
		});
		
		notify();
	};
	
	var add = function(db) {
		
		db.id = idSeq++;

		var newDbItem = { state: DbItemStore.STATE_VIEW, db: db };
	
		dbItems = pl.update(dbItems, {$push: [newDbItem]});
		
		notify();
	};
	
	var update = function(db) {
		
		updateDbItem(db.id, function(dbItem) {
			return pl.extend( dbItem, {state: DbItemStore.STATE_VIEW, db: db} );
		});
		
		notify();
	};
	
	var remove = function(id) {
		
		var i = getDbItemIndex(id);
		if ( i !== -1 ) {
			dbItems = pl.update(dbItems, {$splice: [[i,1]]});
		}
		
		notify();	
	};
	
	pl.Dispatcher.register(NAME, function(action) {
		
		switch(action.actionType) {
			
			case DbItemStore.LOAD:
				load();
				break;
			
			case DbItemStore.LOADED:
				loaded(action.dbs);
				break;
				
			case DbItemStore.EDIT:
				edit(action.id);
				break;
				
			case DbItemStore.CANCEL_EDIT:
				cancelEdit(action.id);
				break;
				
			case DbItemStore.ADD:
				add(action.db);
				break;
				
			case DbItemStore.UPDATE:
				update(action.db);
				break;
				
			case DbItemStore.DELETE:
				remove(action.id);
				break;
		}
	});
	
	pl.DbItemStore = pl.extend(DbItemStore, {
			
		getDbItems: function() {
			return dbItems;
		},
		
		addChangeListener: function(callback) {
			callbacks.push(callback);
		},
		
		removeChangeListener: function(callback) {
			var i = callbacks.indexOf(callback);
			if (i !== -1) {
				callbacks.splice(i,1);
			}
		}
	});
})(pl||{});