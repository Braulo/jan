import { Realm } from '../entities/realm.entity';
import { RealmApplication } from '../entities/realmApplication.entity';
import { RealmRole } from '../entities/realmRole.entity';
import { User } from '../entities/user.entity';
import bcryptjs from 'bcryptjs';
import { RealmApplicationURL } from '../entities/realmApplicationUrl.entity';
import { ExternalProvider } from '../entities/externalProvider.entity';

export const createJan = async () => {
  const janRealm = Realm.create({
    id: '1',
    name: process.env.MasterRealmName,
  });

  const janRealmApplication = RealmApplication.create({
    id: '1',
    clientId: process.env.MasterRealmApplicationClientId,
    clientSecret: process.env.MasterRealmApplicationSecret,
    realm: janRealm,
    displayName: 'Jan Realm app',
  });

  const janAdminRealmRole = RealmRole.create({
    id: '1',
    name: process.env.MasterRealmAdminRole,
    displayName: 'Master Role for Jan',
    realm: janRealm,
  });

  const adminUser = User.create({
    id: '1',
    email: process.env.MasterRealmAdminEmail,
    password: await bcryptjs.hash(process.env.MasterRealmAdminPassword || '', 12),
    realmApplication: janRealmApplication,
    username: process.env.MasterRealmAdminUsername,
    emailConfirmed: true,
    realmRoles: [janAdminRealmRole],
  });

  const realmApplicationURL = RealmApplicationURL.create({
    id: '1',
    url: process.env.RealmApplicationUrl,
    realmApplication: janRealmApplication,
  });

  const externalProvider = ExternalProvider.create({
    id: '1',
    realmApplication: janRealmApplication,
    name: process.env.GoogleAuthProviderName,
    key: process.env.GoogleAuthProviderClientId,
    secret: process.env.GoogleAuthProviderSecret,
  });

  await Realm.save(janRealm);

  await RealmApplication.save(janRealmApplication);

  await RealmRole.save(janAdminRealmRole);

  await User.save(adminUser);

  await RealmApplicationURL.save(realmApplicationURL);

  await ExternalProvider.save(externalProvider);
};

// export const checkRealmApplicationURL = async (req: Request, res: Response, next: NextFunction) => {
//   const clientId = req.query.clientId as string;
//   // This is useless because you can easy manipulate the 'Referer attribute'
//   const requestURL = req.get('Referer');

//   try {
//     const urlsforRealmApplication = await RealmApplicationURL.find({
//       relations: ['realmApplication'],
//       where: {
//         realmApplication: {
//           clientId,
//         },
//       },
//     });

//     const isRealmApplicationUrl = urlsforRealmApplication.find((realmApplicationURL) => {
//       return realmApplicationURL.url === requestURL;
//     });

//     if (!isRealmApplicationUrl) {
//       return res.status(400).json({
//         message: 'Wrong request URL',
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };
