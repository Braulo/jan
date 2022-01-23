const mysql = require('mysql2/promise');

function createConnection(MYSQL_URI) {
  return mysql.createConnection(MYSQL_URI).then((c) => {
    return c;
  });
}

module.exports.loadDbConnection = async (MYSQL_URI) => {
  const db = await createConnection(MYSQL_URI);
  await db.connect();

  // erst jz exporten
  module.exports.db = db;
};
