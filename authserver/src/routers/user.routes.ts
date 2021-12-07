import express from 'express';
import {
  banUserById,
  getAllUsersByRealmId,
  logoutUserById,
  unbanUserById,
  updateUser,
} from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.get('/getallusersinrealm/:realmId', getAllUsersByRealmId);

userRouter.get('/logout/:id', logoutUserById);

userRouter.get('/ban/:id', banUserById);

userRouter.get('/unban/:id', unbanUserById);

userRouter.put('', updateUser);
