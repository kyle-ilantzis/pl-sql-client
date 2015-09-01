/*jshint node:true*/

"use strict";

let moment = require('moment');

let MultiQuery = function() {};

MultiQuery.prototype.query = function() {
  return new Promise(function(resolve, reject){
    let request_date = moment().unix();

    let mock = {
      "SELECT * FROM pet;": {
        "1441149765": [
          {
            "database": "driver://localhost/test",
            "schema": "test",
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
            "values": {
              "name": "my_name",
              "owner": "my_owner",
              "species": "my_species",
              "sex": "m",
              "birth": "2013-01-01T05:00:00.000Z",
              "death": null
            }
          },
          {
            "database": "localhost2",
            "schema": "test",
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
            "values": {
              "name": "my_name",
              "owner": "my_owner",
              "species": "my_species",
              "sex": "m",
              "birth": "2013-01-01T05:00:00.000Z",
              "death": null
            }
          }
        ]
      }
    };

    resolve(mock);
  });
};

module.exports = MultiQuery;
