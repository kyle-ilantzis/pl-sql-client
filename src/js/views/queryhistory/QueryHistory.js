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
	
    var TAG = "QueryHistory:::";
    
    var ANIM_SLIDE_OUT = "slide-out";
    var ANIM_SLIDE_IN = "slide-in";
    
    pl.QueryHistory = React.createClass({
        
        getInitialState: function() {
            return { queries: pl.HistoryStore.getQueryHistory(), anim: ANIM_SLIDE_OUT };
        },
        
        componentDidMount: function() {
			pl.HistoryStore.addChangeListener(this.onChange);
		},

		componentWillUnmount: function() {
			pl.HistoryStore.removeChangeListener(this.onChange);
		},

		onChange: function() {
			pl.updateState(this, { queries: {$set: pl.HistoryStore.getQueryHistory()} });
		},
        
        onQueryHistoryClick: function() {
            if (this.state.anim === ANIM_SLIDE_IN) {
                this.toggleQueryHistory();    
            }
        },
        
        onQueryHistoryListClick: function(e) {
            // parent might otherwise toggle query history
            e.stopPropagation();
        },
        
        onQueryHistoryBtnClick: function() {
            this.toggleQueryHistory();
        },
        
        toggleQueryHistory: function() {
            var nextAnim = this.state.anim === ANIM_SLIDE_OUT ? ANIM_SLIDE_IN : ANIM_SLIDE_OUT;
            pl.updateState(this, { anim: {$set: nextAnim}});
        },
        
        render: function() {
            
            var createHistoryItem = function(item) {
                return <div className="query" key={item.id}><pre>{item.sql}</pre></div>;
            }
            
            return <div className={"QueryHistory" + " " + this.state.anim} onClick={this.onQueryHistoryClick}>                
                <div className="QueryHistoryList" onClick={this.onQueryHistoryListClick}>
                    {pl.HistoryStore.getQueryHistory().map(createHistoryItem)}                     
                </div>
                <div className="QueryHistoryBtn" onClick={this.onQueryHistoryBtnClick}>
                    <a href="#"><span></span></a>
                </div>
            </div>;
        }
    });
})(pl||{});