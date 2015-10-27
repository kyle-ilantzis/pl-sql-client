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
			return {
				isQuerying: pl.DbQueryStore.isQuerying(),
				multiQueryResult: pl.DbQueryStore.getMultiQueryResult()
			};
		},

		componentDidMount: function() {
			pl.DbQueryStore.addChangeListener(this.onChange);
		},

		componentWillUnmount: function() {
			pl.DbQueryStore.removeChangeListener(this.onChange);
		},

		onChange: function() {
			pl.updateState(this, {
				isQuerying: {$set: pl.DbQueryStore.isQuerying()},
				multiQueryResult: {$set: pl.DbQueryStore.getMultiQueryResult()}
			});
		},

		setSql: function(sql) {
			this.refs.dbInputSql.setSql(sql);
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

			var createOutput = function(isQuerying, multiQueryResult) {

				console.log(TAG, "createOutput", "isQuerying=", isQuerying, "multiQueryResult=", multiQueryResult);

				if ( isQuerying ) {
					return <div className="DbMultiQuerySpinner">
						<span></span>
					</div>;
				}
				else if ( multiQueryResult && multiQueryResult.error ) {
					return <pl.CmdError error={multiQueryResult.error}/>;
				}
				else if ( multiQueryResult ) {
					return multiQueryResult.results.map(createDbQuery);
				}
			}

			return <div>
				<pl.DbInputSql ref="dbInputSql" isQuerying={this.state.isQuerying}/>
				{createOutput(this.state.isQuerying, this.state.multiQueryResult)}
			</div>;
		}
	});
})(pl||{});
