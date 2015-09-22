(function(pl){
	
	var TAG = "App:::";
	
	var MULTIQUERY = "App-MULTIQUERY";
	var DBLIST = "App-DBLIST";
	
	pl.App = React.createClass({
		
		getInitialState() {
			return { view: MULTIQUERY };
		},
		
		onMultiQueryClick: function(e) {
			console.log(TAG, "onMuliQueryClick");
			pl.updateState(this, { view: {$set: MULTIQUERY}});
			e.preventDefault();
		},
		
		onDbListClick: function(e) {
			console.log(TAG, "onDbListClick");
			pl.updateState(this, { view: {$set: DBLIST}});
			e.preventDefault();
		},
		
		onQueryHistoryItemClick: function(sql) {
		
			console.log(TAG,"query history itm", sql);	
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
						<pl.DbMultiQuery/>
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