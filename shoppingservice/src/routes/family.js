'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

router.get('/:family/members', (req, res, next) => {
    req.mysql.query('SELECT * FROM familymembers WHERE family = ?', [req.params.family])
        .then(([rows]) => res.json({ status: true, result: rows.map(_ => _.member) }))
        .catch(next)
})

router.get('/:family', (req, res, next) => {
    req.mysql.query('SELECT * FROM shoppinglist WHERE family = ?', [req.params.family])
        .then(([rows]) => res.json({ status: true, result: {
                progress: rows.map(_ => _.status).reduce((prev, cur, i, arr) => prev + cur, 0) / rows.length * 2,
                items: rows
            }
        }))
        .catch(next)
})

router.get('/', (req, res, next) => {
    req.mysql.query('SELECT * FROM family')
        .then(([rows]) => res.json({ status: true, result: rows }))
        .catch(next)
})

module.exports = router