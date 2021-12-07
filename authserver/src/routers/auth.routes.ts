import express from 'express';
import {
  registerUserInRealmApplication,
  loginUserForRealmApplication,
  refreshAccessToken,
  logout,
  loginExternalUser,
  createGoogleAuthStrategy,
  forgotPassword,
  getResetPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { checkToken } from '../utils/auth.utils';
import { checkEmailInRealmApplication, checkUsernameInRealmApplication } from '../utils/user.utils';

export const authRouter = express.Router();

/**
 * @swagger
 *  /api/auth/logout:
 *    post:
 *      summary: Logout User (destroy tokens)
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                    type: string
 *      parameters:
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Logout was successfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      LogoutSuccess:
 *                        type: boolean
 *                  Message:
 *                    type: string
 *        400:
 *          description: Logout unsuccessfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                  Message:
 *                    type: string
 *                  Error:
 *                    type: string
 */
authRouter.post('/logout', logout);

/**
 * @swagger
 *  /api/auth/refreshaccesstoken:
 *    post:
 *      summary: Refresh the accesstoken
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                    type: string
 *      parameters:
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Refresh was successfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      accessToken:
 *                        type: string
 *                  Message:
 *                    type: string
 *        500:
 *          description: Refresh unsuccessfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                  Message:
 *                    type: string
 *                  Error:
 *                    type: string
 */
authRouter.post('/refreshaccesstoken', refreshAccessToken);

/**
 * @swagger
 *  /api/auth/login:
 *    post:
 *      summary: Login User with username / password
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *      parameters:
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Login was successfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      accessToken:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 *                  Message:
 *                    type: string
 *        500:
 *          description: Wrong password or Email not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                  Message:
 *                    type: string
 *                  Error:
 *                    type: string
 */
authRouter.post('/login', loginUserForRealmApplication);

/**
 * @swagger
 *  /api/auth/register:
 *    post:
 *      summary: Register user with username/ email/ password
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *      parameters:
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Register was successfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      user:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                          username:
 *                            type: string
 *                          email:
 *                            type: string
 *                      accessToken:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 *                  Message:
 *                    type: string
 *        500:
 *          description: Register unsuccessfull(Username/ Email already taken)
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      LogoutSuccess:
 *                        type: boolean
 *                  Message:
 *                    type: string
 *                  Error:
 *                    type: string
 */
authRouter.post(
  '/register',
  checkUsernameInRealmApplication,
  checkEmailInRealmApplication,
  registerUserInRealmApplication,
);

authRouter.post('/forgot-password', forgotPassword);

authRouter.get('/reset-password/:id', getResetPassword);

authRouter.post('/reset-password/:id', resetPassword);

/**
 * @swagger
 *  /api/auth/checktoken:
 *    get:
 *      summary: Checks if the accesstoken is valid
 *      parameters:
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *      BearerAuth:
 *        type: http
 *        scheme: bearer
 *      responses:
 *        200:
 *          description: Check token was successfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                    properties:
 *                      user:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                          username:
 *                            type: string
 *                          email:
 *                            type: string
 *                  Message:
 *                    type: string
 *        500:
 *          description: Check token unsuccessfull
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ResponseId:
 *                    type: string
 *                  ResponseDateTime:
 *                    type: Date
 *                  Result:
 *                    type: object
 *                  Message:
 *                    type: string
 *                  Error:
 *                    type: string
 */
authRouter.get('/checktoken', checkToken);

// External Auth
authRouter.get('/external/google', createGoogleAuthStrategy, loginExternalUser);
