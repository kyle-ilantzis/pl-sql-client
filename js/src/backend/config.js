/*jshint node:true*/

"use strict";

let gui = require('nw.gui');
let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');

const ENCODING = 'utf8';
const CONFIG_FOLDER = gui.App.dataPath;
const CONFIG_FILE = 'config.json';

const CONFIG_FILE_PATH = path.join(CONFIG_FOLDER, CONFIG_FILE);

let Config = function() {};

Config.prototype.load = () => {
  return new Promise( (resolve, reject) => {
    fs.readFile(CONFIG_FILE_PATH, ENCODING, function(err, data){
      if (err){
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};


Config.prototype.save = (config) => {
  return create_config_folder().then(() => {
    return write_config(config);
  });
};

function create_config_folder(){
  return new Promise( (resolve, reject) => {
    mkdirp(CONFIG_FOLDER, function(err){
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function write_config(obj){
  return new Promise( (resolve, reject) => {
    let stringified = JSON.stringify(obj, null, 2);

    fs.writeFile(CONFIG_FILE_PATH, stringified, ENCODING, function(err){
      if (err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = Config;
