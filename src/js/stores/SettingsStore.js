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
	var Config = require('./backend/config.js');
	var gui = require('nw.gui');

	var TAG = "SettingsStore:::";
	var NAME = "SettingsStore";

	var configApi = new Config({
		directory: gui.App.dataPath,
		file: 'config.0.json'
	});

	var loaded = false;

	var config = {};
	var initial = true;

	var SettingsStore = {

		BROADCAST_LOADED: "SettingsStore-BCAST_LOADED",

		LOAD: "SettingsStore-LOAD",
		SET_THEME: "SettingsStore-SET_THEME",
		SET_SIZE: "SettingsStore-SET_SIZE"
	};

	var notify = pl.observable(SettingsStore);

	var saveConfig = function() {

		configApi.save(config).catch(function(err){
			console.log(TAG, 'Error while saving configuration:', err);
		});
	};

	var load = function() {

		configApi
			.load()
			.catch(function(err){
				settingsLoaded(err, null);
				loaded = true;

			}).then( function(readConfig) {
				settingsLoaded(null, readConfig, true);
				loaded = true;

			});

		configApi.watch(function(err, config){
			settingsLoaded(err, config, false);
		});
	};

	var settingsLoaded = function(err, readConfig, first) {

			if (err && loaded) {
				console.log(TAG, 'Error while loading configuration.', err);
				return;
			}

			if (readConfig) {

				console.log(TAG, 'New configuration loaded.');

				config = pl.extend({
						theme: null,
						databases: []
					},
					readConfig
				);
			}
			else {
				console.log(TAG, 'Error while loading configuration. Initializing to empty.', err);
				// review @kyle i think it should be config here and not readConfig
				readConfig = {};
			}

			initial = first;

			pl.BroadcastActions.settingsLoaded();
			notify();
	};

	var setTheme = function(theme) {

		var i = pl.Themes.getThemes().indexOf(theme);

		config.theme = i >= 0 ? theme : pl.Themes.getDefaultTheme();

		saveConfig();
		notify();
	};

	var setSize = function(width, height) {

		config.width = width;
		config.height = height;

		saveConfig();
		notify();
	};

	var setDatabases = function() {

		config.databases = pl.DbItemStore.getDatabases();

		saveConfig();
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

			case SettingsStore.SET_SIZE:
				setSize(action.width, action.height);
				break;
		}
	});

	pl.SettingsStore = pl.extend(SettingsStore, {

		getTheme: function() {
			return config.theme || pl.Themes.getDefaultTheme();
		},

		getDatabases: function() {
			return config.databases;
		},

		getWidth: function(){
			return config.width;
		},

		getHeight: function(){
			return config.height;
		},

		isInitial: function(){
			return initial;
		}
	});
})(pl||{});
