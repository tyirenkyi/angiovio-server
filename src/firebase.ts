import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import serviceAccount = require('./angiovio.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin;