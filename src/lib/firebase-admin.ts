import * as admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'env-share-655a8-firebase-adminsdk-fbsvc-9f950a920f.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: 'env-share-655a8',
  });
}

const adminDb = admin.firestore();

export { adminDb };
