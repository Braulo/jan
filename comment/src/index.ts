import express, { NextFunction, Request, Response } from 'express'
import { query, body, validationResult } from 'express-validator';
import process from 'process'
import morgan from 'morgan'
import mysql, { Connection } from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Busboy from 'busboy'

const MYSQL_URI = process.env.MYSQL_URI as string
const PORT = process.env.PORT || 80

var connection : Connection

const app = express()

app.use(morgan('dev'))

app.use((req : Request, res : Response, next : NextFunction) => {
  // set the CORS policy and CORS headers
  res.header('Access-Control-Allow-Origin', '*')
     .header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization')

  // set the CORS method headers
  if (req.method === 'OPTIONS') return res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST').status(200).json({})

  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', query('owner').isString().optional(), (req : any, res : any, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', errors: errors.array() });

  connection.query(req.query.owner ? 'SELECT * FROM comments WHERE owner = ?' : 'SELECT * FROM comments', [req.query.owner])
    .then(([rows]) => res.json({ status: true, result: rows }))
    .catch(next)
})

app.get('/:path', (req : any, res : any, next : NextFunction) => {
  connection.query('SELECT * FROM comments WHERE path = ?', [req.params.path])
    .then(([rows]) => res.json({ status: true, result: rows }))
    .catch(next)
})

app.post('/:path', body('owner').isString(), body('content').isString(), (req : any, res : any, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map((e: any) => e.param + ':' + e.msg).join(', ') });

  const id = uuidv4()

  connection.execute('INSERT INTO comments (id, owner, path, content) values (?, ?, ?, ?)', [id, req.body.owner, req.params.path, req.body.content])
    .then(() => res.json({ success: true, result: id }))
    .catch(next)
})

app.put('/:id', (req : any, res : any, next : NextFunction) => {
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

app.delete('/', body('id').isString(), (req : any, res : any, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', message: errors.array().map((e: any) => e.param + ':' + e.msg).join(', ') });

  connection.execute('DELETE comments WHERE id = ?', [req.body.id])
    .then(() => res.json({ success: true, result: null }))
    .catch(next)
})

/* Error Handler */
app.use((err : Error, req : any, res : any) => res.status(500).json({ success: false, error: err.name, message: err.message }))

mysql.createConnection(MYSQL_URI)
  .then(c => connection = c)
  .then(() => connection.connect())
  .then(() => fs.readFile(path.join(__dirname, 'tables.sql'), 'utf8'))
  .then((sql: string) => connection.execute(sql))
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${ PORT }`)
  }))
