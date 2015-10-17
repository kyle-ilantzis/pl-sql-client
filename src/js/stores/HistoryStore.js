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
	var gui = require('nw.gui');
	var Watcher = require('./backend/watcher.js');

	var TAG = "HistoryStore:::";
	var NAME = "HistoryStore";

	// The maximum number of queries to remember
	var HISTORY_LIMIT = 100;

	var HistoryStore = {
		LOAD: "HistoryStore-LOAD"
	};

	var queries = [];
	var queryIdSeq = 0;

	var watcher = null;

	var notify = pl.observable(HistoryStore);

	var load = function() {

		watcher = new Watcher(gui.App.dataPath, NAME, [], update);
		watcher.watch();
	};

	var remember = function(sql) {

		if (!sql.trim()) { return; }

		var nextId = queryIdSeq++;

		queries.unshift({ id: nextId, sql: sql });

		if (queries.length > HISTORY_LIMIT) {
			queries.pop();
		}

		watcher.save(queries);

		notify();
	};

	var update = function(newQueries) {

		queries = newQueries;

		queries.forEach(function(query) {
			queryIdSeq = Math.max(query.id + 1, queryIdSeq);
		});

		notify();
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