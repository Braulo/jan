'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const process = require( 'process' )
const morgan = require( 'morgan' )
const mysql = require( 'mysql2/promise' )
const fs = require( 'fs/promises' )
const path = require( 'path' )
const { v4: uuidv4 } = require( 'uuid' )

const MYSQL_URI = process.env.MYSQL_URI
const PORT = process.env.PORT || 80

var connection

const app = express()

app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  req.mysql = connection

  next()
})

app.use('/family', require('./routes/family'))
app.use('/member', require('./routes/member'))
app.use('/shopping', require('./routes/shopping'))

/* Error Handler */
app.use((err, req, res, next) => res.status(500).json({ success: false, error: err.name, message: err.message }))

mysql.createConnection(MYSQL_URI)
  .then(c => connection = c)
  .then(() => connection.connect())
  .then(() => fs.readFile(path.join(__dirname, 'tables.sql'), 'utf8'))
  .then(sql => connection.execute(sql))
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${ PORT }`)
  }))
