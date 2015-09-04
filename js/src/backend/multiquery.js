/*jshint node:true*/

"use strict";

let moment = require('moment');
let anyDB = require('any-db');

let MultiQuery = function() {};

/**
* @param command to execute
* @param command.urls[] to use to execute the query
* @param command.query sql query to execute
*/
MultiQuery.prototype.query = function(command) {
  return new Promise(function(resolve, reject){
    let request_date = moment().unix();

    let results = [];
    let promises = [];

    // TODO @pl promiseify
    command.urls.forEach(function(url){
        promises.push(connect_to_db(url).then(function(connection){
          return prepare_for_query(url, connection);

        }).then(function(params){
          return query_db(
            params.connection,
            command.query,
            params.result
          );

        }).then(function(params) {
          return transform_data(params.result_set, params.result);

        }).then(function(result){
          return results.push(result);
        }));
    });

    Promise.all(promises).then(function(){
        resolve(results);
    });
  });
};

function connect_to_db(url) {
  return new Promise(function(resolve, reject) {
    let conn = anyDB.createConnection(url);
    resolve(conn);
  });
}

function prepare_for_query(url, connection, query){
  return new Promise(function(resolve, reject){
    let result = {};
    result.url = url;
    result.execution_start_date = moment().unix();

    resolve({
      connection: connection,
      result: result
    });
  });
}

function query_db(conn, query, result){
  return new Promise(function(resolve, reject){
    conn.query(query, function(error, result_set) {
      result.execution_end_date = moment().unix();
      conn.end();

      resolve({
        result: result,
        result_set: result_set
      });
    });
  });

}

function transform_data(result_set, result){
  return new Promise(function(resolve, reject){
    let fields_names = extract_resultset_field_names(result_set);
    result.fields = fields_names;

    result.values = extract_resultset_values(result_set, fields_names);

    resolve(result);
  });
}

function extract_resultset_field_names(result){
  return result.fields.map(function(field){
    return field.name;
  });
}

function extract_resultset_values(result, fields_names) {
  return result.rows.map(function(row){
    let obj = {};

    fields_names.forEach(function(field_name){
      obj[field_name] = row[field_name];
    });

    return obj;
  });
}

module.exports = MultiQuery;
