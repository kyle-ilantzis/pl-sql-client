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
	
	pl.DbInputSql = React.createClass({
		
		editor: null,
		
		componentDidMount: function() {
			
			editor = ace.edit(this.refs.editor.getDOMNode());
			// FIXME - if pl-sql-client dark theme then use ace chaos theme
			editor.setTheme("ace/theme/sqlserver");
			editor.getSession().setMode("ace/mode/sql");
			
			jQuery(".editor-wrap", this.getDOMNode()).resizable({
				resize: function() { editor.resize(); }
			});
		},
		
		componentWillUnmount: function() {
			if (editor) { editor.destroy(); }
		},
		
		onClick: function() {
			pl.DbQueryActions.query(editor.getValue());
		},
		
		render: function() {
			
			return <div className="DbInputSql">
				
				<div className="editor-wrap">
					<div ref="editor" className="editor"></div>
				</div>
				
				<button onClick={this.onClick}>Go</button>
			</div>;
		}
	});
})(pl||{});