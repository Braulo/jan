'use strict'

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
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                 Message:
 *                   type: string
 */
router.get('/:list', (req, res, next) => {
    req.mysql.query('SELECT * FROM listitem WHERE shoppinglist = ?', [req.params.list])
        .then(([rows]) => res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: "Success" }))
        .catch(next)
})

module.exports = router