const mysql = require( 'mysql2/promise' )

var connection

export default connection
export function createConnection(MYSQL_URI) {
    return mysql.createConnection(MYSQL_URI)
        .then(c => {
            connection = c
            return c.connect()
        })
}