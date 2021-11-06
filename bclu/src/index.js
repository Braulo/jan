'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const process = require( 'process' )
const barcodelookup = require('barcodelookup')
const morgan = require( 'morgan' )

const PORT = process.env.PORT || 80
const API_KEY = process.env.API_KEY

const app = express()

app.use(morgan('dev'))

app.get('/', query('barcode').isString().isLength({ max: 20 }), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'ValidationError', errors: errors.array() });

  barcodelookup.lookup({ barcode: req.query.barcode, key: API_KEY })
})

/* Error Handler */
app.use((err, req, res, next) => res.status(500).json({ success: false, error: err.name, message: err.message }))

app.listen(PORT, () => {
    console.log('Server is running at http://localhost:' + PORT)
})
