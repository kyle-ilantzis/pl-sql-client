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
	var Config = require('./build/backend/config.js');
	var gui = require('nw.gui');

	var TAG = "DbItemStore:::";
	var NAME = "DbItemStore";

	var configApi = new Config({
		directory: gui.App.dataPath,
		file: 'config.json'
	});

	var config = {};

	var DbItemStore = {

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
	var dbItems = [];

	var notify = pl.observable(DbItemStore);

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

		configApi.load().then(function(readConfig){
			return readConfig;

		}).catch(function(err){
				console.log(TAG, 'Error while loading config. Initializing to empty.');
				console.log(TAG, err);
				return {};

		}).then(function(readConfig){
			config = readConfig;

			var dbs = config.databases || [];

			dbItems = dbs.map(function(db,i){
				var mappedDb = pl.extend({},db);
				mappedDb.id = i;

				return { state: DbItemStore.STATE_VIEW, db: mappedDb };
			});

			idSeq = dbItems.length === 0 ? 0 : dbItems[dbItems.length-1].db.id + 1;
			notify();
		});

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

		saveConfiguration();

		notify();
	};

	var update = function(db) {

		updateDbItem(db.id, function(dbItem) {
			return pl.extend( dbItem, {state: DbItemStore.STATE_VIEW, db: db} );
		});

		saveConfiguration();

		notify();
	};

	function saveConfiguration() {

		dbConfig = dbItems.map(function(dbItem){
			return dbItem.db;
		});

		config.databases = dbConfig;

		configApi.save(config).catch(function(err){
			alert('Error while saving cofiguration');
			console.log(TAG, 'Error while saving configuration:');
			console.log(TAG, err);
		});
	}

	var remove = function(id) {

		var i = getDbItemIndex(id);
		if ( i !== -1 ) {
			dbItems = pl.update(dbItems, {$splice: [[i,1]]});
		}

		saveConfiguration();

		notify();
	};

	pl.Dispatcher.register(NAME, function(action) {

		switch(action.actionType) {

			case DbItemStore.LOAD:
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

		getDbItems: function() {
			return dbItems;
		},

		getDbUrls: function() {
			return dbItems.map(function(dbItem) {
				return pl.DbTypes.toUrl(dbItem.db);
			});
		}
	});
})(pl||{});
