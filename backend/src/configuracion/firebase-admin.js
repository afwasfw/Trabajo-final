import admin from 'firebase-admin';
import { entorno } from './entorno.js';

try {
  const serviceAccount = JSON.parse(entorno.firebase.serviceAccount);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin SDK inicializado correctamente.');
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin SDK:', error);
  process.exit(1);
}

export default admin;
