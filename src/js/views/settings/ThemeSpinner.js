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
	
    var TAG = "ThemeSpinner:::";
    
	pl.ThemeSpinner = React.createClass({
        
        getInitialState: function() {
            return { theme: pl.SettingsStore.getTheme() };
        },
        
        componentWillMount: function() {
            pl.SettingsStore.addChangeListener(this.onSettingsChange);  
        },
        
        componentWillUnmount: function() {
            pl.SettingsStore.removeChangeListener(this.onSettingsChange);
        },
        
        onSettingsChange: function() {
            pl.updateState(this, { theme: {$set: pl.SettingsStore.getTheme()} });
        },
         
        onChange: function() {
            var newTheme = this.refs.spinner.getDOMNode().value;
            pl.SettingsActions.setTheme(newTheme);
        },

        render: function() {
            
            var createOption = function(theme,i) {
                return <option key={i}>{theme}</option>;
            };
            
            return <div className="ThemeSpinner">
                <h1>Theme</h1>
                <div>
                    <select ref="spinner" value={this.state.theme} onChange={this.onChange}>
                        {pl.Themes.getThemes().map(createOption)}
                    </select>
                </div>
            </div>;
        }
    });
})(pl||{});