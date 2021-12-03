import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { RealmApplication } from '../entities/realmApplication.entity';
import { User } from '../entities/user.entity';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../utils/auth.utils';
import { RefreshTokenPayload } from '../models/refreshTokenPayload';
import { createGoogleStrategy } from '../utils/passport-google-strategy.utils';
import passport from 'passport';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { NodeMailerTransporter } from '../app';
import { ResponseModel } from '../models/responseModel';
import { RegisterModel } from '../models/registerModel';

//GET => /api/user/register/:realmApplicationId
const registerUserInRealmApplication = async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  const { email, password, username } = req.body;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });

    const user = User.create({
      email,
      password,
      username,
      realmApplication,
    });

    const errors = await validate(user);

    if (errors.length > 0) {
      const response: ResponseModel<null> = {
        Message: `${errors.map((validationErr) => validationErr.constraints)}`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };

      return res.status(500).json(response);
    }

    user.password = await bcryptjs.hash(password, 12);

    const createdUser = await User.save(user);
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const response: ResponseModel<RegisterModel> = {
      Message: `User (${createdUser.email}) has been successfully registered`,
      Result: { user: createdUser, accessToken, refreshToken },
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };

    return res.status(200).json(response);
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

// POST => /auth/login
const loginUserForRealmApplication = async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  const { email, password } = req.body;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });
    const user = await User.findOne({
      where: { email, realmApplication },
      relations: ['realmApplication', 'realmRoles'],
    });

    if (!user) {
      const response: ResponseModel<null> = {
        Message: `E-Mail not found`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };
      return res.status(500).json(response);
    }

    const doPasswordsMatch = await bcryptjs.compare(password, user.password);

    if (!doPasswordsMatch) {
      const response: ResponseModel<null> = {
        Message: `Wrong Password`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };
      return res.status(500).json(response);
    }

    if (user.banned) {
      const response: ResponseModel<null> = {
        Message: `User has been banned for this Realm`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };
      return res.status(500).json(response);
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const response: ResponseModel<{ accessToken: string; refreshToken: string }> = {
      Message: `User has been banned for this Realm`,
      Result: { accessToken, refreshToken },
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };

    return res.status(200).json(response);
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

// POST => /auth/refreshAccessToken?realmApplicationId=foo
const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const clientId = req.query.clientId as string;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });

    // ToDo set 'supersecret' password to realmApplication column
    const decodedToken = jwt.verify(refreshToken, realmApplication.clientSecret) as RefreshTokenPayload;

    const user = await User.findOneOrFail(decodedToken.userId, {
      relations: ['realmApplication', 'realmRoles'],
    });

    if (decodedToken.tokenVersion !== user.refreshTokenVersion) {
      const response: ResponseModel<any> = {
        Message: `Tokenversion is wrong`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };
      return res.status(500).json(response);
    }

    if (user.banned) {
      const response: ResponseModel<any> = {
        Message: `User is banned for this Realm`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };
      return res.status(500).json(response);
    }

    const accessToken = createAccessToken(user);
    const response: ResponseModel<{ accessToken: string }> = {
      Message: `User ${user.username} has a new Refreshtoken`,
      Result: { accessToken },
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };
    return res.status(200).json(response);
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

// POST => /auth/logout?realmApplicationId=foo
const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const clientId = req.query.clientId as string;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId,
      },
    });
    const decodedToken = jwt.verify(refreshToken, realmApplication.clientSecret) as RefreshTokenPayload;

    const user = await User.findOneOrFail(decodedToken.userId, {
      relations: ['realmApplication'],
    });

    user.refreshTokenVersion++;
    user.accessTokenVersion++;

    await User.save(user);

    const response: ResponseModel<{ LogoutSuccess: boolean }> = {
      Message: `User (${user.email}) has been successfully logged out`,
      Result: { LogoutSuccess: true },
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: ResponseModel<any> = {
      Message: `something went wrong`,
      Result: null,
      ResponseId: 'asdfasd',
      ResponseDateTime: new Date(),
      Error: 'Something went wrong',
    };

    return res.status(500).json(response);
  }
};

// GET => /api/external/google
const loginExternalUser = async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const user = await User.findOneOrFail((req.user as any).user.id, {
        relations: ['realmApplication'],
      });

      if (user.banned) {
        return res.status(400).json({ message: 'User has been banned for this Realm' });
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      return res
        .status(200)
        .redirect(`${(req.user as any).callbackUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      return res.status(400).json({ message: 'User not found' });
    }
  }
  return res.status(400).send('no user');
};

const createGoogleAuthStrategy = async (req: Request, res: Response, next: NextFunction) => {
  // https://medium.com/passportjs/authenticate-using-strategy-instances-49e58d96ec8c
  const { clientId } = req.query;
  const strategy = await createGoogleStrategy(clientId as any);
  passport.authenticate(strategy, { scope: ['profile', 'email'] })(req, res, next);
};

// Sends the forgot password mail
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { clientId } = req.query;
  const { email } = req.body;
  console.log('forgot password test', email, clientId);

  try {
    const user = await User.createQueryBuilder('user')
      .leftJoinAndSelect('user.realmApplication', 'realmApplication')
      .where(`realmApplication.clientId = '${clientId}'`)
      .leftJoinAndSelect('realmApplication.realmApplicationURLs', 'realmApplicationURLs')
      // Todo: Ob du dumm bist?
      .andWhere(`user.email = '${email}'`)
      .getOne();

    if (!user) {
      return res.status(400).json(false);
    }

    const resetPasswordToken = jwt.sign(
      {
        email: user.email,
        username: user.username,
        userId: user.id,
        realmApplication: user.realmApplication.id,
        realmApplicationClientId: user.realmApplication.clientId,
        redirectUrl: user.realmApplication.realmApplicationURLs[0].url,
      },
      user.realmApplication.clientSecret + user.password,
      { expiresIn: '1d' },
    );

    const mailOptions: MailOptions = {
      from: process.env.SkyhookSupportEmail,
      to: user?.email,
      subject: `[${user.realmApplication.clientId}] Reset Password for ${user?.username}`,
      text: 'Click here to reset your password',
      html: `<a href="${process.env.SkyhookUrl}/api/auth/reset-password/${user.id}?resetPasswordToken=${resetPasswordToken}">Click here to reset you password</a> 
      <h1>This link is valid for 24h</h1>`,
    };
    await NodeMailerTransporter.sendMail(mailOptions);
    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getResetPassword = async (req: Request, res: Response) => {
  const { resetPasswordToken } = req.query as any;
  const { userid } = req.params;

  try {
    const user = await User.findOneOrFail(userid, {
      relations: ['realmApplication'],
    });

    const decodedResetPasswordToken = jwt.verify(
      resetPasswordToken,
      user.realmApplication.clientSecret + user.password,
    ) as any;

    return res.redirect(`${decodedResetPasswordToken.redirectUrl}/${userid}?resetPasswordToken=${resetPasswordToken}`);
  } catch (error) {
    return res.status(500).send('unvalid link');
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { resetPasswordToken } = req.query as any;
  const { userid } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOneOrFail(userid, {
      relations: ['realmApplication'],
    });

    jwt.verify(resetPasswordToken, user.realmApplication.clientSecret + user.password) as any;

    user.password = await bcryptjs.hash(password, 12);

    await User.save(user);

    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export {
  registerUserInRealmApplication,
  loginUserForRealmApplication,
  refreshAccessToken,
  logout,
  loginExternalUser,
  createGoogleAuthStrategy,
  forgotPassword,
  getResetPassword,
  resetPassword,
};
