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

	pl.BroadcastActions = {

		settingsLoaded: function() {
			pl.Dispatcher.dispatch({
				actionType: pl.SettingsStore.BROADCAST_LOADED
			});
		},

		databasesChanged: function() {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.BROADCAST_CHANGED
			});
		},
	};
})(pl||{});
