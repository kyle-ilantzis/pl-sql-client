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
	
	var TAG = "DbItemActions";
	
	pl.DbItemActions = {
		
		load: function() {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.LOAD
			});
		},
		
		loaded: function(dbs) {
			
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.LOADED,
				dbs: dbs
			});
		},
		
		edit: function(id) {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.EDIT,
				id: id
			});
		},
		
		cancelEdit: function(id) {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.CANCEL_EDIT,
				id: id
			});
		},
		
		add: function(db) {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.ADD,
				db: db
			});
		},
		
		update: function(db) {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.UPDATE,
				db: db
			});
		},
		
		remove: function(id) {
			pl.Dispatcher.dispatch({
				actionType: pl.DbItemStore.DELETE,
				id: id
			});
		}
	}
})(pl||{});