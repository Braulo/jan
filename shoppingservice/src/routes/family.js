'use strict';

const { db } = require('../db');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /family/{familyId}/members:
 *   get:
 *     summary: Returns all family members
 *     parameters:
 *       - in: path
 *         name: familyId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of List
 *     responses:
 *       200:
 *         description: successfully got all members of family
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
 *                     type: string
 *                     format: uuid
 *                 Message:
 *                   type: string
 */
router.get('/:family/members', (req, res, next) => {
  db.query('SELECT * FROM familymembers WHERE family = ?', [req.params.family])
    .then(([rows]) =>
      res.json({
        ResponseId: uuidv4(),
        ResponseDateTime: Date.now(),
        Result: rows.map((_) => _.member),
        Message: 'Success',
      }),
    )
    .catch(next);
});

/**
 * @swagger
 * /family/{familyId}/{memberId}:
 *   post:
 *     summary: add member to family
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Member
 *       - in: path
 *         name: familyId
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
router.post('/:family/:member', (req, res, next) => {
  db.execute('INSERT INTO familymembers (family, member) values (?, ?)', [req.params.family, req.params.member])
    .then(() =>
      res.json({
        ResponseId: uuidv4(),
        ResponseDateTime: Date.now(),
        Result: true,
        Message: 'Success',
      }),
    )
    .catch(next);
});

/**
 * @swagger
 * /family/{familyId}:
 *   get:
 *     summary: Returns all shopping lists from family
 *     parameters:
 *       - in: path
 *         name: familyId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of List
 *     responses:
 *       200:
 *         description: successfully got all members of family
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
 *                 Message:
 *                   type: string
 */
router.get('/:family', (req, res, next) => {
  db.query('SELECT * FROM shoppinglist WHERE family = ?', [req.params.family])
    .then(([rows]) =>
      res.json({
        ResponseId: uuidv4(),
        ResponseDateTime: Date.now(),
        Result: {
          progress: (rows.map((_) => _.status).reduce((prev, cur, i, arr) => prev + cur, 0) / rows.length) * 2,
          items: rows,
        },
        Message: 'Success',
      }),
    )
    .catch(next);
});

/**
 * @swagger
 * /family/{familyId}:
 *   post:
 *     summary: add shoppinglist to family
 *     parameters:
 *       - in: path
 *         name: familyId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Family
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
 *       - in: body
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Title of Shoppinglist
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
router.post('/:family', (req, res, next) => {
  const id = uuidv4();
  db.execute('INSERT INTO shoppinglist (id, family, owner, thumbnail, title) values (?, ?, ?, ?, ?)', [
    id,
    req.params.family,
    req.body.owner,
    req.body.thumbnail,
    req.body.title,
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

router.get('/', (req, res, next) => {
  db.query('SELECT * FROM family')
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

// Delete family by id
router.delete('/:family', (req, res, next) => {
  db.query('DELETE FROM family where family.id  = ?', req.params.family)
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

// Delete family member from family
router.delete('/:family/:user', (req, res, next) => {
  db.query('DELETE FROM familymembers where familymembers.family = ? AND familymembers.member = ? ', [
    req.params.family,
    req.params.user,
  ])
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

router.get('/getmyfamilies/:user', (req, res, next) => {
  db.query(
    'SELECT * FROM family INNER JOIN familymembers ON family.id=familymembers.family where familymembers.member = ?',
    [req.params.user],
  )
    .then(([rows]) =>
      res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: 'Success' }),
    )
    .catch(next);
});

router.post('/', (req, res, next) => {
  const id = uuidv4();
  db.execute('INSERT INTO family (id, title, image) values (?, ?, ?)', [id, req.body.title, req.body.image])
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

module.exports = router;
