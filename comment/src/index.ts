import express from 'express'
import process from 'process'
import morgan from 'morgan'
import { AddressInfo } from 'net'
import mysql, { Connection } from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'

const MYSQL_URI = process.env.MYSQL_URI as string
const PORT = process.env.PORT || 80 as any

var connection : Connection

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

app.get('/', (req, res, next) => {
  connection.query(req.query.owner ? 'SELECT * FROM comments WHERE owner = ?' : 'SELECT * FROM comments', [req.query.owner])
    .then(([rows]) => res.json(rows))
    .catch(next)
})

app.get('/:path', (req, res, next) => {
  connection.query('SELECT * FROM comments WHERE path = ?', [req.params.path])
    .then(([rows]) => res.json(rows))
    .catch(next)
})

app.post('/:path', (req, res, next) => {
  connection.execute('INSERT INTO comments (owner, path, content) values (?, ?, ?)', [req.body.owner, req.params.path, req.body.content])
  .then(([result]) => res.json(result))
  .catch(next)
})

const lconnection = mysql.createConnection(MYSQL_URI) as unknown as Promise<Connection>
lconnection
  .then(c => connection = c as Connection)
  .then(_ => connection.connect())
  .then(_ => fs.readFile(path.join(__dirname, 'tables.sql'), 'utf8'))
  .then(sql => connection.execute(sql))
  .then(_ => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${ PORT }`)
  }))
