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

	var TAG = "SettingsStore:::";
	var NAME = "SettingsStore";

	var SettingsStore = {

		BROADCAST_LOADED: "SettingsStore-BCAST_LOADED",

		LOAD: "SettingsStore-LOAD",
		SET_THEME: "SettingsStore-SET_THEME"
	};

	var loaded;
	var config;

	var watcher;
	var notify = pl.observable(SettingsStore);

	var init = function() {
		loaded = false;
		config = {
			theme: null,
			databases: []
		};
		if (watcher) {
			watcher.die();
		}
		watcher = new Watcher(gui.App.dataPath, NAME, update);
		notify.init();
	};

	var load = function() {
		watcher.watch(update);
	};

	var setTheme = function(theme) {

		var i = pl.Themes.getThemes().indexOf(theme);

		config.theme = i >= 0 ? theme : pl.Themes.getDefaultTheme();

		watcher.save(config);
		notify();
	};

	var setDatabases = function() {

		config.databases = pl.DbItemStore.getDatabases();

		watcher.save(config);
		notify();
	};

	var update = function(newConfig) {

			config = pl.extend({
					theme: null,
					databases: []
				},
				newConfig
			);

			pl.BroadcastActions.settingsLoaded();
			notify();
	};

	pl.Dispatcher.register(NAME, function(action) {

		switch (action.actionType) {

			case pl.DbItemStore.BROADCAST_CHANGED:
				setDatabases();
				break;

			case SettingsStore.LOAD:
				load();
				break;

			case SettingsStore.SET_THEME:
				setTheme(action.theme);
				break;
		}
	});

	pl.SettingsStore = pl.extend(SettingsStore, {

		_init: init,

		getTheme: function() {
			return config.theme || pl.Themes.getDefaultTheme();
		},

		getDatabases: function() {
			return config.databases;
		}
	});

	init();
})(pl||{});
