/*jshint node:true*/

"use strict";

let MultiQuery = require('./multiquery.js');
let multiquery = new MultiQuery();

let command = {
  urls: ["", ""],
  query: "SELECT * FROM pet"
};

multiquery.query(command).then( result =>  {
  console.log(JSON.stringify(result, null, ' '));
}, error => {
  console.log(error);
});
