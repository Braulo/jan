import express, { NextFunction } from 'express'
import { query, body, validationResult } from 'express-validator';
import process from 'process'
import morgan from 'morgan'
import mysql, { Connection } from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'

const MYSQL_URI = process.env.MYSQL_URI as string
const PORT = process.env.PORT || 80

var connection : Connection

const app = express()

app.use(morgan('dev'))

app.use((req : any, res : any, next : NextFunction) => {
  // set the CORS policy and CORS headers
  res.header('Access-Control-Allow-Origin', '*')
     .header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization')

  // set the CORS method headers
  if (req.method === 'OPTIONS') return res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST').status(200).json({})

  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', query('owner').isInt().optional(), (req : any, res : any, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', errors: errors.array() });

  connection.query(req.query.owner ? 'SELECT * FROM comments WHERE owner = ?' : 'SELECT * FROM comments', [req.query.owner])
    .then(([rows]) => res.json(rows))
    .catch(next)
})

app.get('/:path', (req : any, res : any, next : NextFunction) => {
  connection.query('SELECT * FROM comments WHERE path = ?', [req.params.path])
    .then(([rows]) => res.json(rows))
    .catch(next)
})

app.post('/:path', body('owner').isInt(), body('content').isString(), (req : any, res : any, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', errors: errors.array() });

  connection.execute('INSERT INTO comments (owner, path, content) values (?, ?, ?)', [req.body.owner, req.params.path, req.body.content])
    .then(([result]) => res.json(result))
    .catch(next)
})

mysql.createConnection(MYSQL_URI)
  .then(c => connection = c)
  .then(() => connection.connect())
  .then(() => fs.readFile(path.join(__dirname, 'tables.sql'), 'utf8'))
  .then((sql: string) => connection.execute(sql))
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${ PORT }`)
  }))
