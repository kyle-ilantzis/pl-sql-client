(function(pl) {
	
	pl.CmdError = React.createClass({
		
		render: function() {
			return <p>CMD ERR: {(this.props.error.message)}</p>
		}
	});
})(pl||{});