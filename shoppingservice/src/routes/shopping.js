'use strict'

const db = require('../db')
const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

/**
 * @swagger
 * /shopping/{listId}:
 *   get:
 *     summary: Returns all list items
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of List
 *     responses:
 *       200:
 *         description: successfully got all shopping items from listid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ResponseId:
 *                   type: string
 *                 ResponseDateTime:
 *                   type: integer
 *                 Result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       owner:
 *                         type: string
 *                         format: uuid
 *                       family:
 *                         type: string
 *                         format: uuid
 *                       shoppinglist:
 *                         type: string
 *                         format: uuid
 *                 Message:
 *                   type: string
 */
router.get('/:list', (req, res, next) => {
    db.query('SELECT * FROM listitem WHERE shoppinglist = ?', [req.params.list])
        .then(([rows]) => res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: "Success" }))
        .catch(next)
})

/**
 * @swagger
 * /shopping/{listId}:
 *   post:
 *     summary: add item to list
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of List
 *       - in: body
 *         name: owner
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Owner
 *       - in: body
 *         name: family
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Family
 *     responses:
 *       200:
 *         description: successfully added to family
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ResponseId:
 *                   type: string
 *                 ResponseDateTime:
 *                   type: integer
 *                 Result:
 *                   type: boolean
 *                 Message:
 *                   type: string
 */
router.post('/:list', (req, res, next) => {
    const id = uuidv4()
    db.execute('INSERT INTO listitem (id, owner, family, count, shoppinglist) values (?, ?, ?, ?, ?)', [id, req.body.owner, req.body.family, req.body.count, req.params.list])
        .then(() => res.json({
            ResponseId: id,
            ResponseDateTime: Date.now(),
            Result: true,
            Message: "Success"
        }))
        .catch(next)
})

router.put('/:list', (req, res, next) => {
    db.execute('UPDATE shoppinglist SET owner = ?, family = ?, thumbnail = ?, title = ?, status = ? WHERE id = ?', [
        req.body.owner,
        req.body.family,
        req.body.thumbnail,
        req.body.title,
        parseInt(req.body.status),
        req.params.list
    ]).then(() => res.json({
        ResponseId: null,
        ResponseDateTime: Date.now(),
        Result: true,
        Message: "Success"
    })).catch(next)
})

router.delete('/:list', (req, res, next) => {
    db.execute('DELETE shoppinglist WHERE id = ?', [req.params.list]).then(() => res.json({
        ResponseId: null,
        ResponseDateTime: Date.now(),
        Result: true,
        Message: "Success"
    })).catch(next)
})

router.delete('/:list/:product', (req, res, next) => {
    db.execute('DELETE shoppinglist WHERE family = ? AND id = ?', [req.params.list, req.params.product]).then(() => res.json({
        ResponseId: null,
        ResponseDateTime: Date.now(),
        Result: true,
        Message: "Success"
    })).catch(next)
})

module.exports = router