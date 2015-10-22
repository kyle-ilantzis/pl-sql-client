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

var FileWatcher = require('./file-watcher.js');

var TAG = "Watcher:::";

var Watcher = function(dir, name, cb) {

	this._fileWatcherApi = new FileWatcher({
		directory: dir,
		file: name + '.json'
	});

	this._name = name;
	this._cb = cb;
}

Watcher.prototype.name = function() {
	return this._name;
}

Watcher.prototype.loaded = function() {
	return this._loaded;
}

Watcher.prototype.watch = function() {

	var that = this;

	this._fileWatcherApi
		.load()
		.catch(function(err){

			that._update(err, null);
		})
		.then(function(readConfig) {

			that._update(null, readConfig);
		});

	this._fileWatcherApi.watch(function(err, readValue) {
		that._update(err, readValue);
	});
}

Watcher.prototype.save = function(newValue) {

	var that = this;

	this._fileWatcherApi
		.save(newValue)
		.catch(function(err){
			console.log(TAG, 'Error while saving', that._name, ':', err);
		});
};

Watcher.prototype._update = function(err, readValue) {

	if (readValue) {

		console.log(TAG, 'New', this._name, 'loaded.');
		this._cb(readValue);
	} else {

		console.log(TAG, 'Error while loading', this._name, '.', err);
	}
};

module.exports = Watcher;