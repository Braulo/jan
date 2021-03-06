'use strict';

const { db } = require('../db');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /member/{memberId}/families:
 *   get:
 *     summary: Returns all Families the Member is part of
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Member
 *     responses:
 *       200:
 *         description: successfully got all families, member is in
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
router.get('/:member/families', (req, res, next) => {
  db.query('SELECT * FROM familymembers WHERE member = ?', [req.params.member])
    .then(([rows]) =>
      res.json({
        ResponseId: uuidv4(),
        ResponseDateTime: Date.now(),
        Result: rows.map((_) => _.family),
        Message: 'Success',
      }),
    )
    .catch(next);
});

/**
 * @swagger
 * /member/{memberId}/{familyId}:
 *   post:
 *     summary: Add Member to Family
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
router.post('/:member/:family', (req, res, next) => {
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
 * /member/{memberId}:
 *   get:
 *     summary: Returns all Shoppinglists from the member
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of Member
 *     responses:
 *       200:
 *         description: successfully got all shopping lists from ownerid
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
router.get('/:member', (req, res, next) => {
  db.query('SELECT * FROM shoppinglist WHERE member = ?', [req.params.member])
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

module.exports = router;
