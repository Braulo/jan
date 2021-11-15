'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

router.get('/:member/families', (req, res, next) => {
    req.mysql.query('SELECT * FROM familymembers WHERE member = ?', [req.params.member])
        .then(([rows]) => res.json({ status: true, result: rows.map(_ => _.family) }))
        .catch(next)
})

router.get('/:member', (req, res, next) => {
    req.mysql.query('SELECT * FROM shoppinglist WHERE member = ?', [req.params.member])
        .then(([rows]) => res.json({ status: true, result: {
                progress: rows.map(_ => _.status).reduce((prev, cur, i, arr) => prev + cur, 0) / rows.length * 2,
                items: rows
            }
        }))
        .catch(next)
})

module.exports = router