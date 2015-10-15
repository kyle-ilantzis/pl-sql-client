/*jshint node:true*/

"use strict";

let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');
let watch = require('node-watch');

const DEFAULT_CONFIG_FOLDER = '.';
const DEFAULT_CONFIG_FILE = 'config.0.json';
const DEFAULT_ENCODING = 'utf8';

/**
 * @class
 * opts.directory = config file to load, default to .
 * opts.file = config file to load, default to config.json
 * opts.configEncoding = encoding to use, default to utf8
 */
let Config = function(opts) {
  let directory = opts.directory || DEFAULT_CONFIG_FOLDER;
  let file = opts.file || DEFAULT_CONFIG_FILE;
  let encoding = opts.configEncoding || DEFAULT_ENCODING;

  this.configDirectoryPath = directory;
  this.configFilePath = path.join(directory, file);
  this.configEncoding = encoding;

  this.watchCallbacks = [];
  this.watcherSetuped = false;
};

Config.prototype.load = () => {
  let that = this;

  return new Promise( (resolve, reject) => {
    fs.readFile(that.configFilePath, that.configEncoding, function(err, data){
      if (err){
        reject(err);
      } else {
        setup_watcher(that);
        resolve(JSON.parse(data));
      }
    });
  });
};


Config.prototype.save = (config) => {
  var that = this;

  return create_config_folder(that.configDirectoryPath).then(() => {
    return write_config(that.configFilePath, that.configEncoding, config);
  });
};

function create_config_folder(path){
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

function write_config(path, encoding, obj){
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

  watch(that.configFilePath, () => {
    fs.readFile(that.configFilePath, that.configEncoding, (err, data) => {

      if (err) {
        that.watchCallbacks.forEach( (cb) => {
          cb(err);
        });
      } else {
        let config = JSON.parse(data);

        that.watchCallbacks.forEach( (cb) => {
          cb(null, config);
        });
      }
    });
  });

  that.watcherSetuped = true;
}

/**
 * Add a callback to invoke when config changes.
 * @param {Config~configChanged} callback
 */
Config.prototype.watch = (callback) => {
  this.watchCallbacks.push(callback);
};

/**
 * Callback used by watch.
 * @callback Config~configChanged
 * @param error if an error occurs
 * @param config the new configuration read
 */

module.exports = Config;
