import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { realmRouter } from './routers/realm.routes';
import { realmApplicationsRouter } from './routers/realmApplication.routes';
import { authRouter } from './routers/auth.routes';
import { realmRolesRouter } from './routers/realmRole.routes';
import { isAuth } from './utils/auth.utils';
import { checkIfUserIsMasterRealmAdmin } from './utils/realmRoles.utils';
import { createJan } from './utils/skyhook.utils';
import { Realm } from './entities/realm.entity';
import { userRouter } from './routers/user.routes';
import { realmApplicationURLRouter } from './routers/realmApplicationURL.routes';
import passport from 'passport';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { realmApplicationExternalProviderRouter } from './routers/externalProvider.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jan',
      version: '1.0',
      description: 'AuthServer Jan api doc',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routers/*.ts'],
};

const app = express();

const specs = swaggerJSDoc(options);

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// User Auth (For All Skyhook Clients)
app.use('/api/auth', authRouter);

// Get user stuff
app.use('/api/user', userRouter);

// Crud Realm (For RealmAdmins Only)
app.use('/api/realm', isAuth, checkIfUserIsMasterRealmAdmin, realmRouter);

// CRUD Realm Applications (For RealmAdmins Only)
app.use('/api/realmapplication', isAuth, checkIfUserIsMasterRealmAdmin, realmApplicationsRouter);

// CRUD Realm Roles (For RealmAdmins Only)
app.use('/api/realmrole', isAuth, checkIfUserIsMasterRealmAdmin, realmRolesRouter);

// CRUD RealmApplicationURL (For RealmAdminsOnly)
app.use('/api/realmapplicationurl', isAuth, checkIfUserIsMasterRealmAdmin, realmApplicationURLRouter);

// CRUD ExternalProvider (For RealmAdminsOnly)
app.use('/api/externalprovider', isAuth, checkIfUserIsMasterRealmAdmin, realmApplicationExternalProviderRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 404
app.use((_, res) => {
  res.status(404).send('Not Found :(');
});

// Nodemailer setup
export const NodeMailerTransporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.SkyhookSupportEmail,
    pass: process.env.SkyhookSupportPassword,
  },
});

const main = async () => {
  try {
    await createConnection();

    const masterRealm = await Realm.findOne('1');
    if (!masterRealm) {
      createJan();
    }
    app.listen(process.env.PORT, () => {
      console.log(`Server Started at: http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

main();
