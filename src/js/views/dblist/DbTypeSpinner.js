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

			return <div className="DbTypeSpinner"> 
				<select ref="select" defaultValue={this.props.dbType} onChange={this.onChange} >
					{ pl.DbTypes.DB_TYPES.map(createOption) }
				</select>
			</div>;
		}
	});
	
	pl.DbTypeSpinner = DbTypeSpinner;
})(pl||{});