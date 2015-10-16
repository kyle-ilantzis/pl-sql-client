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

	var TAG = "HistoryStore:::";
	var NAME = "HistoryStore";

	// The database version, useful during database updgrades
	var VERSION = 1;

	// The maximum number of queries to remember
	var HISTORY_LIMIT = 100;

	var DB_ACTION_MAX_ATTEMPS = 30;
	var DB_ACTION_RETRY_WAIT = 500;

	var HistoryStore = {
		LOAD: "HistoryStore-LOAD"
	};

	var db = new Dexie(NAME);
	var queries = [];

	var notify = pl.observable(HistoryStore);

	var logError = function(action, error) {
		console.log(TAG, action, "error", error);
	};

	var withDb = function(actionName, action) {

		var itr = function(actionName, action, i) {

			if ( i == 0 ) {
				return;
			}

			console.log(TAG, "withDb action", actionName, "attemp", DB_ACTION_MAX_ATTEMPS - i + 1);

			db.open()
				.catch(function() {
					console.log(TAG, "open", "error", error);
				});

			action()
				.then(function() {
					db.close();
				})
				.catch(function(error) {
					console.log(TAG, actionName, "error", error);
					db.close();

					setTimeout(
						function() {
							itr(actionName, action, i - 1);
						},
						DB_ACTION_RETRY_WAIT
					);
				});
		}

		itr(actionName, action, DB_ACTION_MAX_ATTEMPS);
	}

	var load = function() {

		db
			.version(VERSION)
			.stores({
				/**
				 * The history table stores user's past queries.
				 * This table will be accessible via `db.history`.
				 *
				 * ++id:	An auto-incremented primary key used only for sorting.
				 * 			The bigger the id the newer the query.
				 *
				 * sql: 	The query the user entered.
				 */
				history: "++id,sql"
			});

		withDb("load", function() {
			return db.history
				.reverse()
				.toArray(function(allQueries) {
					queries = allQueries;
					notify();
				});
		});
	};

	var remember = function(sql) {

		if (!sql.trim()) { return; }

		withDb("remember", function() {
			return db.transaction("rw", db.history, function() {
				db.history.count(function(count) {

					if ( count >= HISTORY_LIMIT ) {
						db.history.limit(count - HISTORY_LIMIT + 1).delete();
					}

					db.history.add({ sql: sql });

					db.history
						.reverse()
						.toArray(function(allQueries) {
							queries = allQueries;
							notify();
						});
				});
			});
		});
	};

	pl.Dispatcher.register(NAME, function(action) {

		switch(action.actionType) {

			case HistoryStore.LOAD:
				load();
				break;

			case pl.DbQueryStore.QUERY:
				remember(action.sql);
				break;
		}
	});

	pl.HistoryStore = pl.extend(HistoryStore, {

		getQueryHistory: function() {
			return queries;
		}
	});
})(pl||{});