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
MultiQuery.prototype.query = command => {
  return new Promise( (resolve, reject) => {
    let request_date = moment().unix();

    let results = [];
    let promises = [];

    command.urls.forEach( url => {
        promises.push(connect_to_db(url).then( connection => {
          return prepare_for_query(url, connection);

        }).then( params => {
          return query_db(
            params.connection,
            command.query,
            params.result
          );

        }).then( params => {
          return transform_data(params.result_set, params.result);

        }).then( result => {
          return results.push(result);

        }).catch( error => {
          results.push(transform_error(url, error));

        })
      );
    });

    Promise.all(promises).then(() => {
        resolve(results);
    });
  });
};

function connect_to_db(url) {
  return new Promise( (resolve, reject) => {
    let conn = anyDB.createConnection(url, (error) => {

      if (error !== null) {
        reject(error);
      } else {
        resolve(conn);
      }
    });
  });
}

function prepare_for_query(url, connection, query){
  return new Promise( (resolve, reject) => {
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
  return new Promise( (resolve, reject) => {
    conn.query(query, (error, result_set) => {
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
  return new Promise( (resolve, reject) => {
    let fields_names = extract_resultset_field_names(result_set);
    result.fields = fields_names;

    result.values = extract_resultset_values(result_set, fields_names);

    resolve(result);
  });
}

function extract_resultset_field_names(result){
  return result.fields.map( field => {
    return field.name;
  });
}

function extract_resultset_values(result, fields_names) {
  return result.rows.map( row => {
    let obj = {};

    fields_names.forEach( field_name => {
      obj[field_name] = row[field_name];
    });

    return obj;
  });
}

function transform_error(url, error){
  return {
    url: url,
    error: error
  };
}

module.exports = MultiQuery;
