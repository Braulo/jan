import { NextFunction, Request, Response } from 'express';
import { RealmApplication } from '../entities/realmApplication.entity';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '../models/tokenpayload';
import { User } from '../entities/user.entity';
import { RequestSkyHook } from '../models/requestSkyhook';
import { ResponseModel } from '../models/responseModel';

// Checks if the JWT is Valid by decoding it with the Client-Secret if valid: returns the User;
export const checkToken = async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  const authHeader = req.headers.authorization;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });

    if (authHeader) {
      const decodedAccessToken = jwt.verify(authHeader, realmApplication.clientSecret) as AccessTokenPayload;
      const user = await User.findOneOrFail({
        where: { id: decodedAccessToken.id },
        relations: ['realmRoles'],
        select: ['id', 'email', 'username', 'emailConfirmed', 'accessTokenVersion', 'banned'],
      });

      // Checks the token version
      if (decodedAccessToken.accessTokenVersion !== user.accessTokenVersion) {
        const response: ResponseModel<any> = {
          Message: `Wrong Token version`,
          Result: null,
          ResponseId: 'asdfasd',
          ResponseDateTime: new Date(),
        };
        return res.status(500).json(response);
      }

      if (user.banned) {
        const response: ResponseModel<any> = {
          Message: `User has been banned for this Realm`,
          Result: null,
          ResponseId: 'asdfasd',
          ResponseDateTime: new Date(),
        };
        return res.status(500).json(response);
      }

      const response: ResponseModel<User> = {
        Message: `User ${user.username} has a valid token`,
        Result: user,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };

      return res.status(200).json(response);
    }
    const response: ResponseModel<any> = {
      Message: `No auth header`,
      Result: null,
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };
    return res.status(500).json(response);
  } catch (error) {
    const response: ResponseModel<any> = {
      Message: `Something went wrong`,
      Result: null,
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };

    return res.status(500).json(response);
  }
};

// Checks if the JWT is Valid by decoding it with the Client-Secret if valid: calls the NextFunction;
export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.query.clientId as string;
  const authHeader = req.headers.authorization;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });

    if (authHeader) {
      const decodedAccessToken = jwt.verify(authHeader, realmApplication.clientSecret) as AccessTokenPayload;
      const user = await User.findOneOrFail({
        where: { id: decodedAccessToken.id },
        relations: ['realmRoles'],
        select: ['id', 'email', 'username', 'emailConfirmed', 'accessTokenVersion', 'banned'],
      });

      // Checks the token version
      if (decodedAccessToken.accessTokenVersion !== user.accessTokenVersion) {
        return res.status(400).json({ message: 'Wrong token version' });
      }

      if (user.banned) {
        return res.status(400).json({ message: 'User has been banned for this Realm' });
      }

      (req as RequestSkyHook).user = user;

      return next();
    }
    return res.status(400).json({ message: 'No Auth Header/JWT' });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Creates an accessToken for a user (also contains the current access token version)
export const createAccessToken = (user: User) => {
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
      realmRoles: user?.realmRoles?.map((realmRole) => {
        return realmRole.name;
      }),
      id: user.id,
      realmApplication: user.realmApplication.id,
      accessTokenVersion: user.accessTokenVersion,
    },
    user.realmApplication.clientSecret,
    { expiresIn: '2m' },
  );
};

// Creates an refreshToken for a user (also contains the current access token version)
export const createRefreshToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      realmApplicationId: user.realmApplication.id,
      tokenVersion: user.refreshTokenVersion,
    },
    user.realmApplication.clientSecret,
    { expiresIn: '7d' },
  );
};
