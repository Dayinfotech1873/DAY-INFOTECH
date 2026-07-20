import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const usersSnap = await getDocs(collection(db, 'users'));
  usersSnap.forEach(doc => {
    if (doc.data().username === 'DAY Infotech') {
      console.log(doc.data());
    }
  });
  process.exit(0);
}
check();
