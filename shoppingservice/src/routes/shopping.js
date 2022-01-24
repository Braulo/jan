'use strict';

const { db } = require('../db');
const express = require('express');
const { query, body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

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
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

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
  const id = uuidv4();
  db.execute('INSERT INTO listitem (id, owner, family, status, name, shoppinglist) values (?, ?, ?, ?, ?, ?)', [
    id,
    req.body.owner,
    req.body.family,
    req.body.status,
    req.body.name,
    req.params.list,
  ])
    .then(() =>
      res.json({
        ResponseId: id,
        ResponseDateTime: Date.now(),
        Result: true,
        Message: 'Success',
      }),
    )
    .catch(next);
});

// Delete shoppinglist
router.delete('/:shoppinglist', (req, res, next) => {
  db.query('DELETE FROM shoppinglist WHERE shoppinglist.id = ?', [req.params.shoppinglist])
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

// Update list item
router.put('/:item', (req, res, next) => {
  db.query('UPDATE listitem SET listitem.status = ? WHERE listitem.id = ?', [req.body.status, req.params.item])
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

// Delete list item
router.delete('/item/:item', (req, res, next) => {
  db.query('DELETE FROM listitem WHERE listitem.id = ?', [req.params.item])
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

module.exports = router;
