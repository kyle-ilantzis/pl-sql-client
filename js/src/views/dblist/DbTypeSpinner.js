(function(pl) {
	
	var DbTypeSpinner = React.createClass({
	
		getDbType: function() {
			var select = this.refs.select.getDOMNode();
			var option = select.options[select.selectedIndex];
			return option.label;
		},
	
		onChange: function() {
			pl.nullToNoop(this.props.onChange)(this,this.getDbType());
		},

		render: function() {

			var that = this;
		
			var createOption = function(db,i) {
				return <option key={i}>{db}</option>;
			};

			return <select ref="select" onChange={this.onChange} defaultValue={this.props.dbType}>
				{ pl.DbTypes.DB_TYPES.map(createOption) }
			</select>;
		}
	});
	
	pl.DbTypeSpinner = DbTypeSpinner;
})(pl||{});