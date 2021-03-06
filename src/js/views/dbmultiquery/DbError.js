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
	
	pl.DbError = React.createClass({
		
		render: function() {
			
			return <div className="DbError">
            
                <div className="DbErrorUrl">{this.props.queryResult.url}</div>
                
                <div className="DbErrorMsg">
                    <span className="DbErrorIcon"></span>
                    {this.props.queryResult.error.message}
                </div>
			</div>;
		}
	});
})(pl||{});