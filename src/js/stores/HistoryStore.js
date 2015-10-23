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

	var HistoryStore = {

		// The maximum number of queries to remember
		HISTORY_LIMIT: 100,

		LOAD: "HistoryStore-LOAD"
	};

	var queries;
	var queryIdSeq;

	var watcher;
	var notify = pl.observable(HistoryStore);

	var init = function() {
		queries = [];
		queryIdSeq = 0;
		if (watcher) {
			watcher.die();
		}
		watcher = new Watcher(gui.App.dataPath, NAME, [], update);
		notify.init();
	}

		watcher = new Watcher(gui.App.dataPath, NAME + '.' + pl.VERSION, update);
		watcher.watch();
	};

	var remember = function(sql) {

		if (!sql.trim()) { return; }

		var nextId = queryIdSeq++;

		var newQuery = { id: nextId, sql: sql };

		var dropAmount = Math.max(0, (queries.length + 1) - HISTORY_LIMIT);
		var dropIndex = queries.length - dropAmount;
		var dropCmd = [dropIndex, dropAmount];

		var insertCmd = [0, 0, newQuery];

		queries = pl.update(queries, {$splice: [dropCmd, insertCmd]});

		watcher.save(queries);
		notify();
	};

	var update = function(newQueries) {

		queries = newQueries;

		queryIdSeq = queries.reduce(
			function(newQueryIdSeq, query) { return Math.max(query.id + 1, newQueryIdSeq); },
			0
		);

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

		_init: init,

		getQueryHistory: function() {
			return queries;
		}
	});

	init();
})(pl||{});