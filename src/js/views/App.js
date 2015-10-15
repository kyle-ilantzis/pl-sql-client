(function(pl){
	
	var TAG = "App:::";
	
	var MULTIQUERY = "App-MULTIQUERY";
	var DBLIST = "App-DBLIST";
	
	pl.App = React.createClass({
		
		getInitialState() {
			return { view: MULTIQUERY };
		},
		
		onMultiQueryClick: function(e) {
			pl.updateState(this, { view: {$set: MULTIQUERY}});
			e.preventDefault();
		},
		
		onDbListClick: function(e) {
			pl.updateState(this, { view: {$set: DBLIST}});
			e.preventDefault();
		},
		
		onQueryHistoryItemClick: function(sql) {
			this.refs.dbMultiQuery.setSql(sql);
		},
		
		render: function() {
			
			var that = this;
			
			var multiquery = function(value1,value2) {
				return that.state.view === MULTIQUERY ? value1 : value2;
			}
			
			var dblist = function(value1,value2) {
				return that.state.view === DBLIST ? value1 : value2;
			}
			
			return <div className="app">
			
				<ul className="app-nav">
				
					<li className={dblist("active")}
						onClick={this.onDbListClick}>
						
						<a href="#"><span className="nav-dblist-btn"></span></a>
					</li>
				
					<li className={multiquery("active")} 
						onClick={this.onMultiQueryClick}>
						
						<a href="#"><span className="nav-multiquery-btn"></span></a>
					</li>									
				</ul>
			
				<div className={multiquery("show", "hidden")}>
					<div className="app-query-wrap">
						<pl.QueryHistory onQueryHistoryItemClick={this.onQueryHistoryItemClick}/>
						<pl.DbMultiQuery ref="dbMultiQuery"/>
					</div>
				</div>
				
				<div className={dblist("show", "hidden")}>
					<div className="app-settings-wrap">
						<pl.ThemeSpinner/>
						<pl.DbList/>	
					</div>					
				</div>
			</div>
		}
	});
})(pl||{});