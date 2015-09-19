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

	var TAG = "DbMultiQuery:::";

	pl.DbMultiQuery = React.createClass({

		getInitialState: function() {
			return { multiQueryResult: pl.DbQueryStore.getMultiQueryResult() };
		},

		componentDidMount: function() {
			pl.DbQueryStore.addChangeListener(this.onChange);
		},

		componentWillUnmount: function() {
			pl.DbQueryStore.removeChangeListener(this.onChange);
		},

		onChange: function() {
			pl.updateState(this, { multiQueryResult: {$set: pl.DbQueryStore.getMultiQueryResult()} });
		},

		render: function() {

			var that = this;

			var key = function(i) {
				return that.state.multiQueryResult.id + "_" + i;
			};

			var createDbQuery = function(queryResult,i) {
				return queryResult.error ?
						 <pl.DbError key={key(i)} queryResult={queryResult}/>:
						 <pl.DbQuery key={key(i)} queryResult={queryResult}/>;
			};
			
			return <div>
				<pl.DbInputSql/>
				{
					this.state.multiQueryResult.error ?
						<pl.CmdError error={this.state.multiQueryResult.error}/> :
						that.state.multiQueryResult.results.map(createDbQuery)
				}
			</div>;
		}
	});
})(pl||{});
