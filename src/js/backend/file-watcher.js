/*jshint node:true*/

"use strict";

let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');
let watch = require('node-watch');

const DEFAULT_FOLDER = '.';
const DEFAULT_FILE = 'pl-sql-client.0.json';
const DEFAULT_ENCODING = 'utf8';

/**
 * @class
 * opts.directory = file to load, default to .
 * opts.file = file to load, default to pl-sql-client.0.json
 * opts.encoding = encoding to use, default to utf8
 */
let FileWatcher = function(opts) {
  let directory = opts.directory || DEFAULTFOLDER;
  let file = opts.file || DEFAULT_FILE;
  let encoding = opts.encoding || DEFAULT_ENCODING;

  this.directoryPath = directory;
  this.filePath = path.join(directory, file);
  this.encoding = encoding;

  this.watchCallbacks = [];
  this.watcherSetuped = false;
};

FileWatcher.prototype.load = () => {
  let that = this;

  return new Promise( (resolve, reject) => {
    fs.readFile(that.filePath, that.encoding, function(err, data){
      if (err){
        reject(err);
      } else {
        setup_watcher(that);
        resolve(JSON.parse(data));
      }
    });
  });
};


FileWatcher.prototype.save = (json) => {
  var that = this;

  return create_folder(that.directoryPath).then(() => {
    return write(that.filePath, that.encoding, json);
  });
};

function create_folder(path){
  return new Promise( (resolve, reject) => {
    mkdirp(path, function(err){
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function write(path, encoding, obj){
  return new Promise( (resolve, reject) => {
    let stringified = JSON.stringify(obj, null, 2);

    fs.writeFile(path, stringified, encoding, (err) => {
      if (err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function setup_watcher(that){
  if (that.watcherSetuped){
    return;
  }

  watch(that.filePath, () => {
    fs.readFile(that.filePath, that.encoding, (err, data) => {

      if (err) {
        that.watchCallbacks.forEach( (cb) => {
          cb(err);
        });
      } else {
        let json = JSON.parse(data);

        that.watchCallbacks.forEach( (cb) => {
          cb(null, json);
        });
      }
    });
  });

  that.watcherSetuped = true;
}

/**
 * Add a callback to invoke when the file changes.
 * @param {FileWatcher~fileChanged} callback
 */
FileWatcher.prototype.watch = (callback) => {
  this.watchCallbacks.push(callback);
};

/**
 * Callback used by watch.
 * @callback FileWatcher~fChanged
 * @param error if an error occurs
 * @param json the new json read
 */

module.exports = FileWatcher;
