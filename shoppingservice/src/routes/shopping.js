'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

router.get('/:family', (req, res, next) => {
    req.mysql.query('SELECT * FROM familymembers WHERE family = ?', [req.params.family])
        .then(([rows]) => res.json({ status: true, result: rows.map(_ => _.member) }))
        .catch(next)
})

module.exports = router