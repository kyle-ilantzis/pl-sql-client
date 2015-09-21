(function(pl) {
	
	var MultiQuery = require('./backend/multiquery.js');
	
	pl.CmdError = React.createClass({
				
		render: function() {
			
			var that = this;
			
			var getErrorMsg = function() {
				
				switch(that.props.error) {
					
					case MultiQuery.Errors.ERROR_QUERY_EMPTY:
						return "Please enter a query command.";
					
					case MultiQuery.Errors.ERROR_NO_DATABASE:
						return "Please add databases to query in the settings page.";
				}
			};
			
			return  <div className="CmdError">                
                <div className="CmdErrorMsg">
                    <span className="CmdErrorIcon"></span>
                    {getErrorMsg()}
                </div>
			</div>;
		}
	});
})(pl||{});