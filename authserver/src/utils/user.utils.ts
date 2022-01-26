import { Request, Response, NextFunction } from 'express';
import { RealmApplication } from '../entities/realmApplication.entity';
import { User } from '../entities/user.entity';
import { ResponseModel } from '../models/responseModel';

// Checks if the username is already taken in RealmApplication
export const checkUsernameInRealmApplication = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.query.clientId as string;
  const { username } = req.body;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId: clientId,
      },
    });

    const user = await User.findOne({
      where: { username },
      relations: ['realmApplication'],
    });

    if (user && user.realmApplication.id === realmApplication.id) {
      const response: ResponseModel<any> = {
        Message: `Username (${username}) already taken!`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };

      return res.status(400).json(response);
    }

    next();
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

// Checks if the email is already taken in RealmApplication
export const checkEmailInRealmApplication = async (req: Request, res: Response, next: NextFunction) => {
  const realmApplicationId = req.query.clientId as string;
  const { email } = req.body;

  try {
    const realmApplication = await RealmApplication.findOneOrFail({
      where: {
        clientId: realmApplicationId,
      },
    });

    const user = await User.findOne({
      where: { email },
      relations: ['realmApplication'],
    });

    if (user && user.realmApplication.id === realmApplication.id) {
      const response: ResponseModel<any> = {
        Message: `E-Mail (${email}) already taken`,
        Result: null,
        ResponseId: 'asdfasd',
        ResponseDateTime: new Date(),
      };

      return res.status(400).json(response);
    }
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};
