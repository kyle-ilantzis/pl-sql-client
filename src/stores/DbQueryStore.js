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
    var MultiQuery = require('./build/backend/multiquery.js');
    
    var TAG = "DbQueryStore:::";
	var NAME = "DbQueryStore";
    
    var DbQueryStore = {
        QUERY: "DbQueryStore-QUERY"
    };
    
    var queryResult = null;
    var multiquery = new MultiQuery();
    
    var notify = pl.observable(DbQueryStore);
    
    var query = function(sql) {
        
        console.log(TAG, sql);
    
        multiquery.query().then(function(result) {
            
            queryResult = result;
            
            console.log(TAG, queryResult);
            
            notify();
        });
    };
    
    pl.Dispatcher.register(NAME, function(action) {
        
        switch(action.actionType) {
           
            case DbQueryStore.QUERY:
                query(action.sql);
                break;
        } 
    });
    
    pl.DbQueryStore = pl.extend(DbQueryStore, {
        
        getQueryResult: function() {
            return queryResult;  
        }
    });
})(pl||{});