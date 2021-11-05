'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const process = require( 'process' )
const morgan = require( 'morgan' )
const mysql = require( 'mysql2/promise' )
const fs = require( 'fs/promises' )
const path = require( 'path' )
const { uuidv4: v4 } = require( 'uuid' )
const Busboy = require( 'busboy' )

const MYSQL_URI = process.env.MYSQL_URI
const PORT = process.env.PORT || 80

var connection

const app = express()

app.use(morgan('dev'))

app.use((req, res, next) => {
  // set the CORS policy and CORS headers
  res.header('Access-Control-Allow-Origin', '*')
     .header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization')

  // set the CORS method headers
  if (req.method === 'OPTIONS') return res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST').status(200).json({})

  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', query('owner').isString().optional(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', errors: errors.array() });

  connection.query(req.query.owner ? 'SELECT * FROM comments WHERE owner = ?' : 'SELECT * FROM comments', [req.query.owner])
    .then(([rows]) => res.json({ status: true, result: rows }))
    .catch(next)
})

app.get('/:path', (req, res, next) => {
  connection.query('SELECT * FROM comments WHERE path = ?', [req.params.path])
    .then(([rows]) => res.json({ status: true, result: rows }))
    .catch(next)
})

app.post('/:path', body('owner').isString(), body('content').isString(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map(e => e.param + ':' + e.msg).join(', ') });

  const id = uuidv4()

  connection.execute('INSERT INTO comments (id, owner, path, content) values (?, ?, ?, ?)', [id, req.body.owner, req.params.path, req.body.content])
    .then(() => res.json({ success: true, result: id }))
    .catch(next)
})

app.put('/:id', (req, res, next) => {
  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    
    // file.pipe()
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });

  busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.writeHead(303, { Connection: 'close', Location: '/' });
    res.end();
  });
  req.pipe(busboy)
})

app.delete('/', body('id').isString(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map(e => e.param + ':' + e.msg).join(', ') });

  connection.execute('DELETE comments WHERE id = ?', [req.body.id])
    .then(() => res.json({ success: true, result: null }))
    .catch(next)
})

/* Error Handler */
app.use((err, req, res) => res.status(500).json({ success: false, error: err.name, message: err.message }))

mysql.createConnection(MYSQL_URI)
  .then(c => connection = c)
  .then(() => connection.connect())
  .then(() => fs.readFile(path.join(__dirname, 'tables.sql'), 'utf8'))
  .then(sql => connection.execute(sql))
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${ PORT }`)
  }))
