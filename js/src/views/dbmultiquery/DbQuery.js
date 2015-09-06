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

(function(pl){
	
	var TAG = "DbQuery:::";
	
	pl.DbQuery = React.createClass({
		
		render: function() {
			
			var that = this;
			
			var createTable = function() {
				
				return <table>				
						{createHeader()}
						{createRows()}
				</table>;
			};
			
			var createHeader = function() {
				
				var createHeaderField = function(field,i) {
					return <th key={i}>{field}</th>;
				}
				
				return <tr>
					{that.props.queryResult.fields.map(createHeaderField)}
				</tr>;
			};
			
			var createRows = function() {
				
				var rows = that.props.queryResult.values.map(function(value) {
					return that.props.queryResult.fields.map(function(field) { 
						return value[field];
					});
				});				
				
				console.log(rows);
				
				var createRowData = function(data,i) {
					return <td key={i}>{String(data)}</td>;
				}
				
				return rows.map(function(row,i) {
					return <tr key={i}>
						{row.map(createRowData)}
					</tr>;
				});
			};
			
			
			return <div>
				{createTable()}
			</div>;
		}
	});
})(pl||{});