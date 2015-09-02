/*jshint node:true*/

"use strict";

let moment = require('moment');

let MultiQuery = function() {};

/**
* @param command to execute
* @param command.urls[] to use to execute the query
* @param command.query sql query to execute
*/
MultiQuery.prototype.query = function(command) {
  return new Promise(function(resolve, reject){
    let request_date = moment().unix();

    command.urls.forEach(function(url){

    });

    let mock = [
      {
        "url": "driver://localhost/test",
        "execution_start_date": request_date + 1,
        "execution_end_date": request_date + 2,
        "fields": [
          "name",
          "owner",
          "species",
          "sex",
          "birth",
          "death"
        ],
        "values": [{
          "name": "my_name",
          "owner": "my_owner",
          "species": "my_species",
          "sex": "m",
          "birth": "2013-01-01T05:00:00.000Z",
          "death": null
        },{
          "name": "my_name2",
          "owner": "my_owner2",
          "species": "my_species2",
          "sex": "m",
          "birth": "2013-01-01T05:00:00.000Z",
          "death": null
        }]
      },
      {
        "url": "localhost2",
        "execution_start_date": request_date + 3,
        "execution_end_date": request_date + 5,
        "fields": [
          "name",
          "owner",
          "species",
          "sex",
          "birth",
          "death"
        ],
        "values": [{
          "name": "my_name",
          "owner": "my_owner",
          "species": "my_species",
          "sex": "m",
          "birth": "2013-01-01T05:00:00.000Z",
          "death": null
        }]
      }
    ];

    resolve(mock);
  });
};

module.exports = MultiQuery;
