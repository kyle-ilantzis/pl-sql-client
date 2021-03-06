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

		BROADCAST_CHANGED: "DbItemStore-BCAST_CHANGED",

		LOAD: "DbItemStore-LOAD",

		EDIT: "DbItemStore-EDIT",
		CANCEL_EDIT: "DbItemStore-CANCEL_EDIT",
		ADD: "DbItemStore-ADD",
		UPDATE: "DbItemStore-UDPATE",
		DELETE: "DbItemStore-DELETE",

		STATE_VIEW: "DbItemStore-STATE_VIEW",
		STATE_EDIT: "DbItemStore-STATE_EDIT"
	};

	var idSeq;
	var dbItems;

	var notify = pl.observable(DbItemStore);

	var init = function() {
		idSeq = 0;
		dbItems = [];
		notify.init();
	};

	var getDbItemIndex = function(id) {
		return _.findIndex(dbItems, function(dbItem) { return dbItem.db.id === id; });
	};

	var updateDbItem = function(id, f) {

		var i = getDbItemIndex(id);
		if ( i !== -1 ) {
			var newDbItem = f( pl.extend({},dbItems[i]) );
			dbItems = pl.update(dbItems, {$splice: [[i,1,newDbItem]]});
		}
	};

	var load = function() {

		var dbs = pl.SettingsStore.getDatabases();

		dbItems = dbs.map(function(db,i){
			var mappedDb = pl.extend({},db);
			mappedDb.id = i;

			return { state: DbItemStore.STATE_VIEW, db: mappedDb };
		});

		idSeq = dbItems.length === 0 ? 0 : dbItems[dbItems.length-1].db.id + 1;
		notify();
	};

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

		pl.BroadcastActions.databasesChanged();
		notify();
	};

	var update = function(db) {

		updateDbItem(db.id, function(dbItem) {
			return pl.extend( dbItem, {state: DbItemStore.STATE_VIEW, db: db} );
		});

		pl.BroadcastActions.databasesChanged();
		notify();
	};

	var remove = function(id) {

		var i = getDbItemIndex(id);
		if ( i !== -1 ) {
			dbItems = pl.update(dbItems, {$splice: [[i,1]]});
		}

		pl.BroadcastActions.databasesChanged();
		notify();
	};

	pl.Dispatcher.register(NAME, function(action) {

		switch(action.actionType) {

			case pl.SettingsStore.BROADCAST_LOADED:
				load();
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

		_init: init,

		getDbItems: function() {
			return dbItems;
		},

		getDatabases: function() {
			return dbItems.map(function(dbItem) {
				return dbItem.db;
			});
		},

		getDbUrls: function() {
			return dbItems.map(function(dbItem) {
				return {
					id: dbItem.id,
					url: pl.DbTypes.toUrl(dbItem.db)
				};
			});
		}
	});

	init();
})(pl||{});
