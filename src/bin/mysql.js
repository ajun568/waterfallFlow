const mysql = require('mysql');
const { MYSQL_CONF } = require('./conf');

const connection = mysql.createConnection(MYSQL_CONF);
connection.connect();

const exec = (sql) => {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  })
  return promise;
}

module.exports = { exec, escape: mysql.escape };
