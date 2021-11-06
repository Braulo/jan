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

app.get('/', query('owner').isString().isLength({ max: 48 }).optional(), (req, res, next) => {
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

app.post('/:path', body('owner').isString().isLength({ max: 48 }), body('content').isString(), body('image').isString().isLength({ max: 48 }).optional(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map(e => e.param + ':' + e.msg).join(', ') });

  const id = uuidv4()

  connection.execute('INSERT INTO comments (id, owner, path, content, image) values (?, ?, ?, ?, ?)', [id, req.body.owner, req.params.path, req.body.content, req.body.image])
    .then(() => res.json({ success: true, result: id }))
    .catch(next)
})

app.put('/:id', body('owner').isString().isLength({ max: 48 }), body('content').isString(), body('image').isString().isLength({ max: 48 }).optional(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map(e => e.param + ':' + e.msg).join(', ') });

  connection.execute('UPDATE comments SET owner = IFNULL(?, owner), content = IFNULL(?, content), image = IFNULL(?, image) WHERE id = ?', [req.body.owner, req.body.content, req.body.image, req.params.id])
    .then(([{ affectedRows }]) => {
      if(affectedRows > 0) res.json({ success: true, result: null })
      else res.status(400).json({ success: false, error: 'NotFoundError', message: 'comment with id not found' })
    })
    .catch(next)
})

app.delete('/:id', (req, res, next) => {
  connection.execute('DELETE FROM comments WHERE id = ?', [req.params.id])
    .then(([{ affectedRows }]) => {
      if(affectedRows > 0) res.json({ success: true, result: null })
      else res.status(400).json({ success: false, error: 'NotFoundError', message: 'comment with id not found' })
    })
    .catch(next)
})

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
