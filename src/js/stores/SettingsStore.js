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
	
	var TAG = "SettingsStore:::";
	var NAME = "SettingsStore";

	var configApi = new Config({
		directory: gui.App.dataPath,
		file: 'config.json'
	});

	var loaded = false;
	
	var config = {};
	
	var SettingsStore = {
		
		BROADCAST_LOADED: "SettingsStore-BCAST_LOADED",
		
		LOAD: "SettingsStore-LOAD",
		SET_THEME: "SettingsStore-SET_THEME",
		
		THEME_LIGHT: "SettingsStore-THEME_LIGHT",
		THEME_DARK: "SettingsStore-THEME_DARK"
	};
	
	var notify = pl.observable(SettingsStore);
	
	var saveConfig = function() {

		configApi.save(config).catch(function(err){
			console.log(TAG, 'Error while saving configuration:', err);
		});
	};
	
	var load = function() {
		
		configApi.load().then(function(readConfig){			
			return readConfig;
					
		}).catch(function(err){						
			console.log(TAG, 'Error while loading config. Initializing to empty.', err);
			return {};
			
		}).then( function(readConfig) {
			loaded = true;
			config = readConfig;
			pl.BroadcastActions.settingsLoaded();			
			notify();	
		});
	};
	
	var setTheme = function(theme) {
		
		config.theme = theme;
		saveConfig();
		notify();
	};
	
	var setDatabases = function(databases) {
		
		config.databases = databases;
		saveConfig();
		notify();
	};
	
	pl.Dispatcher.register(NAME, function(action) {
		
		switch (action.actionType) {
			
			case pl.DbItemStore.BROADCAST_DATABASES:
				setDatabases(action.databases);
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
		
		getTheme: function() {
			return config.theme;	
		},
		
		getDatabases: function() {
			return config.databases;
		}
	});
})(pl||{});