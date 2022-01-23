import express from 'express';
import {
  banUserById,
  getAllUsersByRealmId,
  getUserById,
  getUsersByUsername,
  logoutUserById,
  unbanUserById,
  updateUser,
} from '../controllers/user.controller';
import { checkIfUserIsMasterRealmAdmin } from '../utils/realmRoles.utils';

export const userRouter = express.Router();

userRouter.get('/getUsersByUsername/:username', getUsersByUsername);

userRouter.get('/getUserById/:userId', getUserById);

userRouter.get('/getallusersinrealm/:realmId', checkIfUserIsMasterRealmAdmin, getAllUsersByRealmId);

userRouter.get('/logout/:id', checkIfUserIsMasterRealmAdmin, logoutUserById);

userRouter.get('/ban/:id', checkIfUserIsMasterRealmAdmin, banUserById);

userRouter.get('/unban/:id', checkIfUserIsMasterRealmAdmin, unbanUserById);

userRouter.put('', checkIfUserIsMasterRealmAdmin, updateUser);
