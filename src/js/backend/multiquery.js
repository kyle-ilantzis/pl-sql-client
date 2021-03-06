/*jshint node:true*/

"use strict";

const TAG = "MultiQuery:::";

let moment = require('moment');
let anyDB = require('any-db');

let MultiQuery = function() {};

const Errors = {
  ERROR_QUERY_EMPTY: new Error("Query is empty!"),
  ERROR_NO_DATABASE: new Error("No database specified!")
};

MultiQuery.Errors = Errors;

/**
* @param command to execute
* @param command.urls[].url url to use to execute the query
* @param command.urls[].id identifier of the database
* @param command.query sql query to execute
*/
MultiQuery.prototype.query = command => {
  console.log(TAG, command);

  if ((!command.query) || command.query.trim() === ''){
    return Promise.reject(Errors.ERROR_QUERY_EMPTY);
  }

  if ((!command.urls) || command.urls.length === 0){
    return Promise.reject(Errors.ERROR_NO_DATABASE);
  }

  return new Promise( (resolve, reject) => {
    let request_date = moment().unix();

    let results = [];
    let promises = [];

    command.urls.forEach( (url, index) => {
        promises.push(connect_to_db(url.url).then( connection => {
          return prepare_for_query(url, connection);

        }).then( params => {
          return query_db(
            params.connection,
            command.query,
            params.result
          );

        }).then( params => {
          return transform_data(url, params.result_set, params.result);

        }).then( result => {
          results[index] = result;

        }).catch( error => {
          results[index] = transform_error(url, error);

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

    result.id = url.id;
    result.url = url.url;

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

      if (error) {
        reject(error);
        return;
      }

      resolve({
        result: result,
        result_set: result_set
      });

    });
  });

}

function transform_data(id, result_set, result){
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
    id: url.id,
    url: url.url,
    error: error
  };
}

module.exports = MultiQuery;
