'use strict';

const express = require('express');
const { query, body, validationResult } = require('express-validator');
const process = require('process');
const morgan = require('morgan');
const { loadDbConnection } = require('./db');
// David du Opfer
// const db, { createConnection } = require( './db' )
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const MYSQL_URI = process.env.MYSQL_URI;
const PORT = process.env.PORT || 80;

var connection;

loadDbConnection(MYSQL_URI)
  .then(() => {
    const { db } = require('./db');
    connection = db;
  })
  .then(() => require('./tables'))
  .then((sqls) => sqls.map((sql) => connection.execute(sql)))
  .finally(() => {
    const app = express();
    app.use(morgan('dev'));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
      res.setHeader('Access-Control-Allow-Headers', '*');
      if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });

    app.use('/family', require('./routes/family'));
    app.use('/member', require('./routes/member'));
    app.use('/shopping', require('./routes/shopping'));

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Shopping API',
          version: '1.0.0',
          description: 'A simple Express Shopping API',
        },
        servers: [
          {
            url: 'http://localhost:3204/',
          },
        ],
      },
      apis: ['./src/routes/*.js'],
    };

    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

    /* Error Handler */
    app.use((err, req, res, next) =>
      res
        .status(500)
        .json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: err.message, Message: err.name }),
    );
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  });
