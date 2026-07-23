import { ApplicationEntry, Wallet, WalletTransaction, OfflineForm } from '../types';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  onSnapshot,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db, auth } from './firebase';

const DB_NAME = 'GujaratFormAssistantDB';
const DB_VERSION = 1;
const STORE_NAME = 'applications';

// Lightweight in-memory storage fallback
const memoryStore: Record<string, ApplicationEntry> = {};

// Safe storage in-memory fallback caches
const localStorageMemoryCache: Record<string, string> = {};
const sessionStorageMemoryCache: Record<string, string> = {};

// Safe localStorage wrapper
export function safeGetLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? localStorageMemoryCache[key] ?? null;
  } catch (e) {
    return localStorageMemoryCache[key] || null;
  }
}

export function safeSetLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
  localStorageMemoryCache[key] = value;
}

export function safeGetSessionStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? sessionStorageMemoryCache[key] ?? null;
  } catch (e) {
    return sessionStorageMemoryCache[key] || null;
  }
}

export function safeSetSessionStorage(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {}
  sessionStorageMemoryCache[key] = value;
}

export function safeRemoveSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {}
  delete sessionStorageMemoryCache[key];
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        throw new Error('IndexedDB not supported in this browser');
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    } catch (e) {
      reject(e);
    }
  });
}

// Get or generate a persistent guest ID for this browser
export function getGuestId(): string {
  let guestId = safeGetLocalStorage('day_infotech_guest_id');
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 11)}_${Math.random().toString(36).substring(2, 11)}`;
    safeSetLocalStorage('day_infotech_guest_id', guestId);
  }
  return guestId;
}

// Check if user is logged in as owner
export function isOwner(): boolean {
  const user = getLoggedInUser();
  return user?.email === 'bsporiya9@gmail.com' || 
         user?.uid === 'custom_bsporiya9' || 
         user?.uid?.toLowerCase() === 'custom_dayinfotech' || 
         user?.uid?.toLowerCase() === 'custom_admin';
}

// Helper to recursively remove undefined values so Firestore doesn't crash
function sanitizeForFirestore(val: any): any {
  if (val === undefined) {
    return null;
  }
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeForFirestore);
  }
  const res: any = {};
  for (const key of Object.keys(val)) {
    if (val[key] !== undefined) {
      res[key] = sanitizeForFirestore(val[key]);
    }
  }
  return res;
}

export async function saveApplication(entry: ApplicationEntry): Promise<void> {
  const enrichedEntry: ApplicationEntry = {
    ...entry,
    userId: entry.userId || getLoggedInUser()?.uid || getGuestId()
  };

  // 1. Try to save to local IndexedDB (with localStorage/memory fallback)
  try {
    const idb = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = idb.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(enrichedEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB write failed, falling back to memory/localstorage:', e);
    memoryStore[enrichedEntry.id] = enrichedEntry;
    try {
      const existingLocal = JSON.parse(safeGetLocalStorage('applications_fallback') || '{}');
      existingLocal[enrichedEntry.id] = enrichedEntry;
      safeSetLocalStorage('applications_fallback', JSON.stringify(existingLocal));
    } catch (err) {}
  }

  // 2. Sync to cloud Firestore (sanitized to remove any undefined fields)
  const path = `applications/${entry.id}`;
  try {
    const docRef = doc(db, 'applications', entry.id);
    const sanitized = sanitizeForFirestore(enrichedEntry);
    await setDoc(docRef, sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAllApplications(): Promise<ApplicationEntry[]> {
  const currentUserId = getLoggedInUser()?.uid || getGuestId();
  const path = 'applications';

  try {
    const colRef = collection(db, 'applications');
    const q = isOwner() ? query(colRef) : query(colRef, where('userId', '==', currentUserId));
    const snapshot = await getDocs(q);
    const results: ApplicationEntry[] = [];
    snapshot.forEach((doc) => {
      results.push(doc.data() as ApplicationEntry);
    });

    // Sync fetched documents into local storage
    try {
      const idb = await openDatabase();
      await new Promise<void>((resolve, reject) => {
        const transaction = idb.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        for (const entry of results) {
          store.put(entry);
        }
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (e) {
      console.warn('IndexedDB sync failed, using memory/localstorage fallback:', e);
      for (const entry of results) {
        memoryStore[entry.id] = entry;
      }
      try {
        const existingLocal = JSON.parse(safeGetLocalStorage('applications_fallback') || '{}');
        for (const entry of results) {
          existingLocal[entry.id] = entry;
        }
        safeSetLocalStorage('applications_fallback', JSON.stringify(existingLocal));
      } catch (err) {}
    }

    // Sort by updatedAt descending
    results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return results;
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to local storage:', error);
  }

  // Fallback to local storage (IndexedDB -> localStorage -> Memory)
  const results: ApplicationEntry[] = [];

  try {
    const idb = await openDatabase();
    const idbResults = await new Promise<ApplicationEntry[]>((resolve, reject) => {
      const transaction = idb.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as ApplicationEntry[]);
      request.onerror = () => reject(request.error);
    });
    results.push(...idbResults);
  } catch (e) {
    console.warn('IndexedDB read failed, trying localStorage/memory:', e);
    try {
      const existingLocal = JSON.parse(safeGetLocalStorage('applications_fallback') || '{}');
      results.push(...(Object.values(existingLocal) as ApplicationEntry[]));
    } catch (err) {}
    
    for (const key in memoryStore) {
      if (!results.some(r => r.id === key)) {
        results.push(memoryStore[key]);
      }
    }
  }

  // Filter to only show this user's submissions if NOT owner
  const filtered = isOwner() ? results : results.filter(r => r.userId === currentUserId);

  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return filtered;
}

export async function getApplicationById(id: string): Promise<ApplicationEntry | null> {
  // Try fetching from Firestore first
  const path = `applications/${id}`;
  try {
    const docRef = doc(db, 'applications', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as ApplicationEntry;
    }
  } catch (error) {
    console.warn('Firestore fetch failed or disallowed, falling back to local storage:', error);
  }

  // Fallback to local storage
  try {
    const idb = await openDatabase();
    return await new Promise<ApplicationEntry | null>((resolve, reject) => {
      const transaction = idb.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB read failed, trying localStorage/memory:', e);
    try {
      const existingLocal = JSON.parse(safeGetLocalStorage('applications_fallback') || '{}');
      if (existingLocal[id]) return existingLocal[id];
    } catch (err) {}
    return memoryStore[id] || null;
  }
}

export async function deleteApplication(id: string): Promise<void> {
  // 1. Delete from local IndexedDB
  try {
    const idb = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = idb.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB delete failed, trying localStorage/memory:', e);
    delete memoryStore[id];
    try {
      const existingLocal = JSON.parse(safeGetLocalStorage('applications_fallback') || '{}');
      if (existingLocal[id]) {
        delete existingLocal[id];
        safeSetLocalStorage('applications_fallback', JSON.stringify(existingLocal));
      }
    } catch (err) {}
  }

  // 2. Delete from Firestore if permitted (owner only)
  const path = `applications/${id}`;
  try {
    const docRef = doc(db, 'applications', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not delete from Firestore (might be unauthorized):', error);
  }
}

// Custom User authentication and management helpers
export function getLoggedInUser() {
  try {
    const customSession = safeGetSessionStorage('custom_user_session');
    if (customSession) {
      return JSON.parse(customSession);
    }
  } catch (e) {}
  
  if (auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      mobile: auth.currentUser.phoneNumber || '',
      isCustom: false
    };
  }
  return null;
}

export async function getCustomUserByUsername(username: string): Promise<any> {
  const normalizedUsername = username.trim().toLowerCase();
  const docRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
}

export async function checkUsernameLock(username: string): Promise<void> {
  const normalized = username.trim().toLowerCase();
  const lockRef = doc(db, 'used_usernames', normalized);
  const snapshot = await getDoc(lockRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    if (data.releasedAt) {
      const releasedTime = new Date(data.releasedAt).getTime();
      const diffTime = Date.now() - releasedTime;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 90) {
        const remainingDays = 90 - diffDays;
        throw new Error(`આ યુઝરનેમ અગાઉ ઉપયોગમાં લેવાયું હતું અને આગામી ૯૦ દિવસ સુધી ઉપલબ્ધ નથી. કૃપા કરીને ${remainingDays} દિવસ પછી પ્રયત્ન કરો. (This username was previously used and is locked for 90 days. Please try again in ${remainingDays} days.)`);
      }
    }
  }
}

export async function signUpCustomUser(
  name: string, 
  mobile: string, 
  username: string, 
  password: string,
  dob: string,
  gender: string,
  email?: string
): Promise<any> {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedMobile = mobile.trim();
  
  if (!normalizedUsername) {
    throw new Error('યુઝરનેમ ખાલી ન હોઈ શકે. (Username cannot be empty.)');
  }

  // Check 90 days lock first
  await checkUsernameLock(normalizedUsername);
  
  // Check if username already exists
  const docRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(docRef);
  const usernameExists = snapshot.exists();

  // Check if mobile number already exists
  const mobileQuery = query(collection(db, 'users'), where('mobile', '==', normalizedMobile));
  const mobileSnapshot = await getDocs(mobileQuery);
  const mobileExists = !mobileSnapshot.empty;

  if (usernameExists && mobileExists) {
    throw new Error('આ યુઝરનેમ અને મોબાઇલ નંબર બંને પહેલેથી ઉપયોગમાં છે! (This username and mobile number are both already in use!)');
  } else if (usernameExists) {
    throw new Error('આ યુઝરનેમ પહેલેથી કોઈએ લીધેલ છે. કૃપા કરીને બીજું યુઝરનેમ પસંદ કરો. (This username is already taken.)');
  } else if (mobileExists) {
    throw new Error('આ મોબાઇલ નંબર પહેલેથી ઉપયોગમાં છે! કૃપા કરીને બીજો નંબર વાપરો. (This mobile number is already in use!)');
  }

  const userData = {
    username: normalizedUsername,
    name: name.trim(),
    mobile: normalizedMobile,
    password: password.trim(),
    dob: dob.trim(),
    gender: gender.trim(),
    email: email?.trim() || '',
    createdAt: new Date().toISOString()
  };

  await setDoc(docRef, userData);

  // Return the session object
  const session = {
    uid: `custom_${normalizedUsername}`,
    email: email?.trim() || `${normalizedUsername}@dayinfotech.com`,
    displayName: userData.name,
    mobile: userData.mobile,
    dob: userData.dob,
    gender: userData.gender,
    isCustom: true
  };

  safeSetSessionStorage('custom_user_session', JSON.stringify(session));
  return session;
}

export async function loginCustomUser(username: string, password: string, isAdminLogin: boolean = false): Promise<any> {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    throw new Error('યુઝરનેમ ખાલી ન હોઈ શકે. (Username cannot be empty.)');
  }

  // Admin / Owner login bypass
  if (normalizedUsername === 'dayinfotech') {
    if (!isAdminLogin) {
      throw new Error('યુઝરનેમ મળ્યું નથી. કૃપા કરીને સાચું યુઝરનેમ લખો અથવા નવું એકાઉન્ટ બનાવો. (Username not found. Please try again or sign up.)');
    }

    let adminPassword = 'BHAVESH@1873';
    try {
      const docRef = doc(db, 'users', 'dayinfotech');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        adminPassword = snapshot.data().password || 'BHAVESH@1873';
      }
    } catch (e) {
      console.error('Error fetching admin password:', e);
    }

    if (password.trim() === adminPassword) {
      const session = {
        uid: 'custom_dayinfotech',
        email: 'bsporiya9@gmail.com',
        displayName: 'DAY INFOTECH Admin',
        mobile: '7600361873',
        dob: '1996-04-09',
        gender: 'MALE',
        isCustom: true
      };
      safeSetSessionStorage('custom_user_session', JSON.stringify(session));
      return session;
    } else {
      throw new Error('પાસવર્ડ ખોટો છે. કૃપા કરીને ફરી પ્રયાસ કરો. (Incorrect password. Please try again.)');
    }
  }

  if (isAdminLogin) {
    throw new Error('આ એડમિન યુઝરનેમ નથી. કૃપા કરીને સામાન્ય લૉગિન ટૅબમાંથી લૉગ ઇન કરો. (This is not an Admin username. Please log in from the User tab.)');
  }

  const docRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error('યુઝરનેમ મળ્યું નથી. કૃપા કરીને સાચું યુઝરનેમ લખો અથવા નવું એકાઉન્ટ બનાવો. (Username not found. Please try again or sign up.)');
  }

  const userData = snapshot.data();
  if (userData.isBlocked) {
    throw new Error('તમારું એકાઉન્ટ એડમિન દ્વારા કામચલાઉ ધોરણે બ્લોક કરવામાં આવ્યું છે. કૃપા કરીને એડમિનનો સંપર્ક કરો. (Your account has been temporarily blocked by Admin. Please contact admin.)');
  }

  if (userData.password !== password.trim()) {
    throw new Error('પાસવર્ડ ખોટો છે. કૃપા કરીને ફરી પ્રયાસ કરો. (Incorrect password. Please try again.)');
  }

  const session = {
    uid: `custom_${normalizedUsername}`,
    email: userData.email || `${normalizedUsername}@dayinfotech.com`,
    displayName: userData.name,
    mobile: userData.mobile,
    dob: userData.dob || '',
    gender: userData.gender || '',
    profilePic: userData.profilePic || '',
    birthPlace: userData.birthPlace || '',
    bio: userData.bio || '',
    location: userData.location || '',
    education: userData.education || '',
    occupation: userData.occupation || '',
    facebookUrl: userData.facebookUrl || '',
    instagramUrl: userData.instagramUrl || '',
    isCustom: true
  };

  safeSetSessionStorage('custom_user_session', JSON.stringify(session));
  return session;
}

export function logoutCustomUser() {
  safeRemoveSessionStorage('custom_user_session');
}

export async function changeCustomUsername(oldUsername: string, newUsername: string): Promise<any> {
  const normalizedOld = oldUsername.trim().toLowerCase();
  const normalizedNew = newUsername.trim().toLowerCase();

  if (!normalizedNew) {
    throw new Error('નવું યુઝરનેમ ખાલી ન હોઈ શકે. (New username cannot be empty.)');
  }

  if (normalizedOld === normalizedNew) {
    throw new Error('નવું યુઝરનેમ જૂના યુઝરનેમ જેવું જ છે. (New username is same as old username.)');
  }

  // Admin username cannot be changed normally
  if (normalizedOld === 'dayinfotech' || normalizedNew === 'dayinfotech') {
    throw new Error('એડમિન યુઝરનેમ બદલી શકાતું નથી. (Admin username cannot be changed.)');
  }

  const oldDocRef = doc(db, 'users', normalizedOld);
  const oldSnapshot = await getDoc(oldDocRef);
  if (!oldSnapshot.exists()) {
    throw new Error('જૂનું એકાઉન્ટ મળ્યું નથી. (Old account not found.)');
  }

  const userData = oldSnapshot.data();

  // Check 90 days cooldown on username changes
  if (userData.usernameLastChangedAt) {
    const lastChanged = new Date(userData.usernameLastChangedAt).getTime();
    const diffTime = Date.now() - lastChanged;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 90) {
      const remainingDays = 90 - diffDays;
      throw new Error(`તમે ફક્ત 90 દિવસમાં એક વાર જ યુઝરનેમ બદલી શકો છો. કૃપા કરીને ${remainingDays} દિવસ પછી પ્રયત્ન કરો. (You can only change username once in 90 days. Please try again in ${remainingDays} days.)`);
    }
  }

  // Verify new username is not already taken
  const newDocRef = doc(db, 'users', normalizedNew);
  const newSnapshot = await getDoc(newDocRef);
  if (newSnapshot.exists()) {
    throw new Error('આ યુઝરનેમ પહેલેથી કોઈએ લીધેલ છે. કૃપા કરીને બીજું યુઝરનેમ પસંદ કરો. (This username is already taken.)');
  }

  // Check 90 days lock for the new username
  await checkUsernameLock(normalizedNew);

  const updatedUserData = {
    ...userData,
    username: normalizedNew,
    usernameLastChangedAt: new Date().toISOString()
  };

  // Create new document with new username
  await setDoc(newDocRef, updatedUserData);

  // Delete old document
  await deleteDoc(oldDocRef);

  // Save old username to used_usernames lock collection for 90 days
  const lockRef = doc(db, 'used_usernames', normalizedOld);
  await setDoc(lockRef, {
    username: normalizedOld,
    releasedAt: new Date().toISOString()
  });

  // Update session
  const customSession = safeGetSessionStorage('custom_user_session');
  if (customSession) {
    const session = JSON.parse(customSession);
    const updatedSession = {
      ...session,
      uid: `custom_${normalizedNew}`,
      email: session.email?.replace(normalizedOld, normalizedNew) || `${normalizedNew}@dayinfotech.com`,
      username: normalizedNew,
      displayName: userData.name
    };
    safeSetSessionStorage('custom_user_session', JSON.stringify(updatedSession));
    return updatedSession;
  }

  return null;
}

export async function changeCustomPassword(username: string, currentPassword: string, newPassword: string): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  const docRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error('એકાઉન્ટ મળ્યું નથી. (Account not found.)');
  }

  const userData = snapshot.data();
  if (userData.password !== currentPassword.trim()) {
    throw new Error('હાલનો પાસવર્ડ ખોટો છે. (Current password is incorrect.)');
  }

  await setDoc(docRef, {
    ...userData,
    password: newPassword.trim(),
    passwordLastChangedAt: new Date().toISOString()
  });
}

export async function getAccountsByMobile(mobile: string): Promise<any[]> {
  const normalizedMobile = mobile.trim();
  const usersCol = collection(db, 'users');
  const q = query(usersCol, where('mobile', '==', normalizedMobile));
  const snapshot = await getDocs(q);
  const accounts: any[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    accounts.push({
      username: data.username,
      name: data.name,
      password: data.password,
      mobile: data.mobile,
      dob: data.dob || '',
      gender: data.gender || '',
      email: data.email || ''
    });
  });
  return accounts;
}

export async function getAccountsByMobileAndDob(mobile: string, dob: string): Promise<any[]> {
  const normalizedMobile = mobile.trim();
  const normalizedDob = dob.trim();
  const usersCol = collection(db, 'users');
  const q = query(usersCol, where('mobile', '==', normalizedMobile), where('dob', '==', normalizedDob));
  const snapshot = await getDocs(q);
  const accounts: any[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    accounts.push({
      username: data.username,
      name: data.name,
      password: data.password,
      mobile: data.mobile,
      dob: data.dob || '',
      gender: data.gender || '',
      email: data.email || ''
    });
  });
  return accounts;
}

// Fetch all registered custom users
export async function getAllCustomUsers(): Promise<any[]> {
  try {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    const userMap: Record<string, any> = {};

    snapshot.forEach(doc => {
      const id = doc.id.toLowerCase();
      if (id === 'dayinfotech') return;

      const data = doc.data();
      const isCustomPrefix = id.startsWith('custom_');
      const rootUsername = isCustomPrefix ? id.substring(7) : id;

      if (!userMap[rootUsername]) {
        userMap[rootUsername] = {
          username: rootUsername,
          id: rootUsername
        };
      }

      if (!isCustomPrefix) {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          ...data,
          username: data.username || rootUsername,
          registered: true
        };
      } else {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          isOnline: data.isOnline ?? userMap[rootUsername].isOnline,
          lastActive: data.lastActive ?? userMap[rootUsername].lastActive,
          loginType: data.loginType ?? userMap[rootUsername].loginType,
          uid: data.uid ?? userMap[rootUsername].uid,
          enhancerUsage: data.enhancerUsage ?? userMap[rootUsername].enhancerUsage,
          enhancerLimit: data.enhancerLimit ?? userMap[rootUsername].enhancerLimit,
          enhancerRequestStatus: data.enhancerRequestStatus ?? userMap[rootUsername].enhancerRequestStatus,
        };
      }
    });

    const usersList: any[] = [];
    Object.keys(userMap).forEach(key => {
      const u = userMap[key];
      if (u.mobile || u.password || u.registered) {
        usersList.push(u);
      }
    });

    return usersList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (e) {
    console.error('Error fetching custom users:', e);
    return [];
  }
}

// Subscribe to all registered custom users in real-time
export function subscribeToAllCustomUsers(callback: (users: any[]) => void) {
  const colRef = collection(db, 'users');
  return onSnapshot(colRef, (snapshot) => {
    const userMap: Record<string, any> = {};

    snapshot.forEach(doc => {
      const id = doc.id.toLowerCase();
      if (id === 'dayinfotech') return;

      const data = doc.data();
      const isCustomPrefix = id.startsWith('custom_');
      const rootUsername = isCustomPrefix ? id.substring(7) : id;

      if (!userMap[rootUsername]) {
        userMap[rootUsername] = {
          username: rootUsername,
          id: rootUsername
        };
      }

      if (!isCustomPrefix) {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          ...data,
          username: data.username || rootUsername,
          registered: true
        };
      } else {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          isOnline: data.isOnline ?? userMap[rootUsername].isOnline,
          lastActive: data.lastActive ?? userMap[rootUsername].lastActive,
          loginType: data.loginType ?? userMap[rootUsername].loginType,
          uid: data.uid ?? userMap[rootUsername].uid,
          enhancerUsage: data.enhancerUsage ?? userMap[rootUsername].enhancerUsage,
          enhancerLimit: data.enhancerLimit ?? userMap[rootUsername].enhancerLimit,
          enhancerRequestStatus: data.enhancerRequestStatus ?? userMap[rootUsername].enhancerRequestStatus,
        };
      }
    });

    const usersList: any[] = [];
    Object.keys(userMap).forEach(key => {
      const u = userMap[key];
      if (u.mobile || u.password || u.registered) {
        usersList.push(u);
      }
    });

    const sorted = usersList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    callback(sorted);
  }, (error) => {
    console.error('Error subscribing to custom users:', error);
  });
}

// Fetch all forgot password requests
export async function getForgotPasswordRequests(): Promise<any[]> {
  try {
    const colRef = collection(db, 'password_requests');
    const snapshot = await getDocs(colRef);
    const reqs: any[] = [];
    snapshot.forEach(doc => {
      reqs.push(doc.data());
    });
    return reqs.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (e) {
    console.error('Error fetching password requests:', e);
    return [];
  }
}

// Subscribe to all forgot password requests in real-time
export function subscribeToForgotPasswordRequests(callback: (requests: any[]) => void) {
  const colRef = collection(db, 'password_requests');
  return onSnapshot(colRef, (snapshot) => {
    const reqs: any[] = [];
    snapshot.forEach(doc => {
      reqs.push(doc.data());
    });
    const sorted = reqs.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    callback(sorted);
  }, (error) => {
    console.error('Error subscribing to password requests:', error);
  });
}

// Create a forgot password request
export async function createForgotPasswordRequest(mobile: string): Promise<any> {
  const normalizedMobile = mobile.trim();
  if (!normalizedMobile) {
    throw new Error('મોબાઇલ નંબર ખાલી ન હોઈ શકે. (Mobile number cannot be empty.)');
  }

  // Find users with this mobile number
  let userMatches: any[] = [];
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('mobile', '==', normalizedMobile));
    const userSnapshot = await getDocs(q);
    userSnapshot.forEach(doc => {
      const data = doc.data();
      userMatches.push({
        username: data.username,
        name: data.name,
        password: data.password,
        mobile: data.mobile
      });
    });
  } catch (err) {
    console.error('Error querying matching users:', err);
  }

  const requestId = `req_${Date.now()}`;
  const requestDocRef = doc(db, 'password_requests', requestId);
  const requestData = {
    id: requestId,
    mobile: normalizedMobile,
    status: 'pending',
    createdAt: new Date().toISOString(),
    userMatches
  };

  await setDoc(requestDocRef, requestData);
  return requestData;
}

// Update forgot password request status
export async function updateForgotPasswordRequestStatus(requestId: string, status: string): Promise<void> {
  try {
    const docRef = doc(db, 'password_requests', requestId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      await setDoc(docRef, { ...data, status, resolvedAt: new Date().toISOString() });
    }
  } catch (e) {
    console.error('Error updating password request:', e);
  }
}

// Delete a forgot password request
export async function deleteForgotPasswordRequest(requestId: string): Promise<void> {
  try {
    const docRef = doc(db, 'password_requests', requestId);
    await deleteDoc(docRef);
  } catch (e) {
    console.error('Error deleting password request:', e);
  }
}

// Fetch all service statuses (ON/OFF)
export async function getServiceStatuses(): Promise<Record<string, boolean>> {
  const defaultStatuses: Record<string, boolean> = {
    PAN_CARD: true,
    VOTER_ID: true,
    E_SHRAM: true,
    FARMER_SUBSIDY: true,
    CAST_CERTIFICATE: true,
    INCOME_CERTIFICATE: true,
    AYUSHYMAN_CARD: true,
    AABHA_CARD: true,
    UDHYAM_AADHAR: true,
    MANAV_KALYAN: true,
    KUVAR_BAI_MAMERU: true,
    OTHER_SERVICE: true,
    RATION_CARD_ADD_NAME: true,
    RATION_CARD_REMOVE_NAME: true,
    RATION_CARD_CORRECTION: true,
    PASSPORT: true,
  };

  try {
    const docRef = doc(db, 'settings', 'services');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.statuses) {
        const merged = { ...defaultStatuses, ...data.statuses };
        // Save to localStorage as quick fallback
        safeSetLocalStorage('service_statuses_fallback', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch service statuses from Firestore:', e);
  }

  // Local fallback
  try {
    const fallback = safeGetLocalStorage('service_statuses_fallback');
    if (fallback) {
      return { ...defaultStatuses, ...JSON.parse(fallback) };
    }
  } catch (e) {}

  return defaultStatuses;
}

// Update all service statuses
export async function saveServiceStatuses(statuses: Record<string, boolean>): Promise<void> {
  // Save locally first
  safeSetLocalStorage('service_statuses_fallback', JSON.stringify(statuses));

  // Save to Firestore
  try {
    const docRef = doc(db, 'settings', 'services');
    await setDoc(docRef, { id: 'services', statuses, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/services');
  }
}

// Fetch all service prices from Firestore
export async function getServicePrices(): Promise<Record<string, number>> {
  const defaultPrices: Record<string, number> = {
    PAN_CARD: 270,
    PAN_CARD_CORRECTION: 300,
    MINOR_PAN_CARD: 300,
    VOTER_ID: 100,
    VOTER_ID_CORRECTION: 200,
    E_SHRAM: 100,
    AYUSHYMAN_CARD: 80,
    AABHA_CARD: 80,
    FARMER_SUBSIDY: 100,
    INCOME_CERTIFICATE: 150,
    CAST_CERTIFICATE: 150,
    UDHYAM_AADHAR: 300,
    MANAV_KALYAN: 80,
    KUVAR_BAI_MAMERU: 100,
    NEW_BIRTH_CERTIFICATE: 150,
    BIRTH_CERTIFICATE_CORRECTION: 150,
    DEATH_CERTIFICATE: 180,
    OTHER_SERVICE: 0,
    RATION_CARD_ADD_NAME: 500,
    RATION_CARD_REMOVE_NAME: 400,
    RATION_CARD_CORRECTION: 0,
    PASSPORT: 1500,
  };

  try {
    const docRef = doc(db, 'settings', 'prices');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.prices) {
        const merged = { ...defaultPrices };
        for (const [key, value] of Object.entries(data.prices)) {
          merged[key] = Number(value);
        }
        safeSetLocalStorage('service_prices_fallback', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch service prices from Firestore:', e);
  }

  try {
    const fallback = safeGetLocalStorage('service_prices_fallback');
    if (fallback) {
      const parsed = JSON.parse(fallback);
      const merged = { ...defaultPrices };
      for (const [key, value] of Object.entries(parsed)) {
        merged[key] = Number(value);
      }
      return merged;
    }
  } catch (e) {}

  return defaultPrices;
}

// Update all service prices in Firestore
export async function saveServicePrices(prices: Record<string, number>): Promise<void> {
  safeSetLocalStorage('service_prices_fallback', JSON.stringify(prices));

  try {
    const docRef = doc(db, 'settings', 'prices');
    await setDoc(docRef, { id: 'prices', prices, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/prices');
  }
}

export interface ServiceDiscounts {
  walletDiscount: number;
  upiDiscount: number;
}

// Fetch all service discounts from Firestore (with local fallback)
export async function getServiceDiscounts(): Promise<ServiceDiscounts> {
  const defaultDiscounts: ServiceDiscounts = {
    walletDiscount: 10,
    upiDiscount: 0,
  };

  try {
    const docRef = doc(db, 'settings', 'discounts');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data) {
        const walletDiscount = typeof data.walletDiscount === 'number' ? data.walletDiscount : defaultDiscounts.walletDiscount;
        const upiDiscount = typeof data.upiDiscount === 'number' ? data.upiDiscount : defaultDiscounts.upiDiscount;
        const merged = { walletDiscount, upiDiscount };
        safeSetLocalStorage('service_discounts_fallback', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch service discounts from Firestore:', e);
  }

  try {
    const fallback = safeGetLocalStorage('service_discounts_fallback');
    if (fallback) {
      const parsed = JSON.parse(fallback);
      return {
        walletDiscount: typeof parsed.walletDiscount === 'number' ? parsed.walletDiscount : defaultDiscounts.walletDiscount,
        upiDiscount: typeof parsed.upiDiscount === 'number' ? parsed.upiDiscount : defaultDiscounts.upiDiscount,
      };
    }
  } catch (e) {}

  return defaultDiscounts;
}

// Update service discounts in Firestore
export async function saveServiceDiscounts(discounts: ServiceDiscounts): Promise<void> {
  safeSetLocalStorage('service_discounts_fallback', JSON.stringify(discounts));

  try {
    const docRef = doc(db, 'settings', 'discounts');
    await setDoc(docRef, { 
      id: 'discounts', 
      walletDiscount: discounts.walletDiscount, 
      upiDiscount: discounts.upiDiscount, 
      updatedAt: new Date().toISOString() 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/discounts');
  }
}

// Subscribe to service discounts with periodic polling
export function subscribeToServiceDiscounts(callback: (discounts: ServiceDiscounts) => void): () => void {
  const defaultDiscounts: ServiceDiscounts = {
    walletDiscount: 10,
    upiDiscount: 0,
  };

  let active = true;

  const fetchDiscounts = async () => {
    try {
      const discounts = await getServiceDiscounts();
      if (active) {
        callback(discounts);
      }
    } catch (e) {
      if (active) {
        callback(defaultDiscounts);
      }
    }
  };

  fetchDiscounts();

  const intervalId = setInterval(fetchDiscounts, 5000);

  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

// Subscribe to service prices with periodic polling
export function subscribeToServicePrices(callback: (prices: Record<string, number>) => void): () => void {
  const defaultPrices: Record<string, number> = {
    PAN_CARD: 270,
    PAN_CARD_CORRECTION: 300,
    MINOR_PAN_CARD: 300,
    VOTER_ID: 100,
    VOTER_ID_CORRECTION: 200,
    E_SHRAM: 100,
    AYUSHYMAN_CARD: 80,
    AABHA_CARD: 80,
    FARMER_SUBSIDY: 100,
    INCOME_CERTIFICATE: 150,
    CAST_CERTIFICATE: 150,
    UDHYAM_AADHAR: 300,
    MANAV_KALYAN: 80,
    KUVAR_BAI_MAMERU: 100,
    NEW_BIRTH_CERTIFICATE: 150,
    BIRTH_CERTIFICATE_CORRECTION: 150,
    DEATH_CERTIFICATE: 180,
    OTHER_SERVICE: 0,
    RATION_CARD_ADD_NAME: 500,
    RATION_CARD_REMOVE_NAME: 400,
    RATION_CARD_CORRECTION: 0,
  };

  let active = true;

  const fetchPrices = async () => {
    try {
      const prices = await getServicePrices();
      if (active) {
        callback(prices);
      }
    } catch (e) {
      if (active) {
        callback(defaultPrices);
      }
    }
  };

  fetchPrices();

  const intervalId = setInterval(fetchPrices, 5000);

  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

// Fetch maintenance mode status
export async function getMaintenanceStatus(): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'maintenance');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && typeof data.isUnderMaintenance === 'boolean') {
        safeSetLocalStorage('maintenance_mode_fallback', String(data.isUnderMaintenance));
        return data.isUnderMaintenance;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch maintenance status from Firestore:', e);
  }

  // Local fallback
  try {
    const fallback = safeGetLocalStorage('maintenance_mode_fallback');
    if (fallback) {
      return fallback === 'true';
    }
  } catch (e) {}

  return false; // Default: Not in maintenance mode
}

// Update maintenance mode status
export async function saveMaintenanceStatus(isUnderMaintenance: boolean): Promise<void> {
  // Save locally first
  safeSetLocalStorage('maintenance_mode_fallback', String(isUnderMaintenance));

  // Save to Firestore
  try {
    const docRef = doc(db, 'settings', 'maintenance');
    await setDoc(docRef, { id: 'maintenance', isUnderMaintenance, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/maintenance');
  }
}

// Subscribe to maintenance status with periodic polling
export function subscribeToMaintenanceStatus(callback: (isUnderMaintenance: boolean) => void): () => void {
  let active = true;

  const fetchStatus = async () => {
    try {
      const status = await getMaintenanceStatus();
      if (active) {
        callback(status);
      }
    } catch (e) {
      if (active) {
        callback(false);
      }
    }
  };

  // Initial fetch
  fetchStatus();

  // Poll every 5 seconds to get updates
  const intervalId = setInterval(fetchStatus, 5000);

  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

// Subscribe to service statuses with periodic polling
export function subscribeToServiceStatuses(callback: (statuses: Record<string, boolean>) => void): () => void {
  const defaultStatuses: Record<string, boolean> = {
    PAN_CARD: true,
    VOTER_ID: true,
    E_SHRAM: true,
    FARMER_SUBSIDY: true,
    CAST_CERTIFICATE: true,
    INCOME_CERTIFICATE: true,
    AYUSHYMAN_CARD: true,
    AABHA_CARD: true,
    UDHYAM_AADHAR: true,
    MANAV_KALYAN: true,
    KUVAR_BAI_MAMERU: true,
    OTHER_SERVICE: true,
    RATION_CARD_ADD_NAME: true,
    RATION_CARD_REMOVE_NAME: true,
    RATION_CARD_CORRECTION: true,
  };

  let active = true;

  const fetchStatus = async () => {
    try {
      const statuses = await getServiceStatuses();
      if (active) {
        callback(statuses);
      }
    } catch (e) {
      if (active) {
        callback(defaultStatuses);
      }
    }
  };

  // Initial fetch
  fetchStatus();

  // Poll every 5 seconds to get updates
  const intervalId = setInterval(fetchStatus, 5000);

  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

// Fetch owner message from Firestore
export async function getOwnerMessage(): Promise<string> {
  try {
    const docRef = doc(db, 'settings', 'announcement');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.message !== undefined) {
        safeSetLocalStorage('owner_message_fallback', data.message);
        return data.message;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch owner message from Firestore:', e);
  }

  // Local fallback
  return safeGetLocalStorage('owner_message_fallback') || '';
}

// Save owner message to Firestore
export async function saveOwnerMessage(message: string): Promise<void> {
  safeSetLocalStorage('owner_message_fallback', message);

  try {
    const docRef = doc(db, 'settings', 'announcement');
    await setDoc(docRef, { id: 'announcement', message, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to save owner message:', error);
  }
}

export interface OwnerAnnouncement {
  message: string;
  photo?: string;
}

// Fetch owner announcement (message + photo) from Firestore
export async function getOwnerAnnouncement(): Promise<OwnerAnnouncement> {
  try {
    const docRef = doc(db, 'settings', 'announcement');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data) {
        const announcement = {
          message: data.message || '',
          photo: data.photo || undefined
        };
        safeSetLocalStorage('owner_announcement_fallback', JSON.stringify(announcement));
        return announcement;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch owner announcement from Firestore:', e);
  }

  // Fallback to local storage
  try {
    const cached = safeGetLocalStorage('owner_announcement_fallback');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}
  
  // Backward compatibility fallback
  const oldMessage = safeGetLocalStorage('owner_message_fallback') || '';
  return { message: oldMessage };
}

// Save owner announcement (message + photo) to Firestore
export async function saveOwnerAnnouncement(message: string, photo?: string): Promise<void> {
  const dataToSave: OwnerAnnouncement = { message, photo };
  safeSetLocalStorage('owner_announcement_fallback', JSON.stringify(dataToSave));
  safeSetLocalStorage('owner_message_fallback', message);

  try {
    const docRef = doc(db, 'settings', 'announcement');
    await setDoc(docRef, { 
      id: 'announcement', 
      message, 
      photo: photo || null, 
      updatedAt: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Failed to save owner announcement:', error);
  }
}

export interface GreetingsMessage {
  message: string;
  active: boolean;
}

// Fetch greetings message from Firestore
export async function getGreetingsMessage(): Promise<GreetingsMessage> {
  try {
    const docRef = doc(db, 'settings', 'greetings');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data) {
        const greetings = {
          message: data.message || '',
          active: typeof data.active === 'boolean' ? data.active : true
        };
        safeSetLocalStorage('greetings_message_fallback', JSON.stringify(greetings));
        return greetings;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch greetings message from Firestore:', e);
  }

  // Fallback to local storage
  try {
    const cached = safeGetLocalStorage('greetings_message_fallback');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return { message: '', active: false };
}

// Save greetings message to Firestore
export async function saveGreetingsMessage(message: string, active: boolean): Promise<void> {
  const dataToSave: GreetingsMessage = { message, active };
  safeSetLocalStorage('greetings_message_fallback', JSON.stringify(dataToSave));

  try {
    const docRef = doc(db, 'settings', 'greetings');
    await setDoc(docRef, {
      id: 'greetings',
      message,
      active,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to save greetings message:', error);
  }
}

// ==========================================
// WALLET MANAGEMENT SYSTEM HELPERS
// ==========================================

export async function getWallet(userId: string): Promise<Wallet> {
  const path = `wallets/${userId}`;
  try {
    const docRef = doc(db, 'wallets', userId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as Wallet;
      safeSetLocalStorage(`wallet_fallback_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch wallet from Firestore, trying fallback:', e);
  }

  // Fallback to local storage or create new
  try {
    const fallbackStr = safeGetLocalStorage(`wallet_fallback_${userId}`);
    if (fallbackStr) {
      return JSON.parse(fallbackStr);
    }
  } catch (e) {}

  const newWallet: Wallet = {
    id: userId,
    userId,
    balance: 0,
    updatedAt: new Date().toISOString()
  };
  
  try {
    const docRef = doc(db, 'wallets', userId);
    await setDoc(docRef, sanitizeForFirestore(newWallet));
    safeSetLocalStorage(`wallet_fallback_${userId}`, JSON.stringify(newWallet));
  } catch (e) {
    console.error('Failed to write new wallet to Firestore:', e);
  }

  return newWallet;
}

export async function updateWalletBalance(userId: string, change: number): Promise<void> {
  const wallet = await getWallet(userId);
  const newBalance = Math.max(0, wallet.balance + change);
  const updatedWallet: Wallet = {
    ...wallet,
    balance: newBalance,
    updatedAt: new Date().toISOString()
  };

  safeSetLocalStorage(`wallet_fallback_${userId}`, JSON.stringify(updatedWallet));

  try {
    const docRef = doc(db, 'wallets', userId);
    await setDoc(docRef, sanitizeForFirestore(updatedWallet));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `wallets/${userId}`);
  }
}

export async function createWalletTransaction(txData: Omit<WalletTransaction, 'id' | 'createdAt'>): Promise<WalletTransaction> {
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const transaction: WalletTransaction = {
    ...txData,
    id: txId,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'wallet_transactions', txId);
    await setDoc(docRef, sanitizeForFirestore(transaction));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `wallet_transactions/${txId}`);
  }

  return transaction;
}

export async function getWalletTransactions(userId?: string): Promise<WalletTransaction[]> {
  try {
    const colRef = collection(db, 'wallet_transactions');
    let q = query(colRef);
    if (userId) {
      q = query(colRef, where('userId', '==', userId));
    }
    const snapshot = await getDocs(q);
    const txs: WalletTransaction[] = [];
    snapshot.forEach(doc => {
      txs.push(doc.data() as WalletTransaction);
    });

    // Sort by createdAt descending
    return txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error('Error fetching wallet transactions:', e);
    return [];
  }
}

export async function approveWalletDeposit(txId: string): Promise<void> {
  try {
    const docRef = doc(db, 'wallet_transactions', txId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const tx = snapshot.data() as WalletTransaction;
      if (tx.status === 'PENDING') {
        const updatedTx: WalletTransaction = {
          ...tx,
          status: 'COMPLETED',
          approvedAt: new Date().toISOString()
        };
        await setDoc(docRef, sanitizeForFirestore(updatedTx));
        // Credit the balance
        await updateWalletBalance(tx.userId, tx.amount);
      }
    }
  } catch (e) {
    console.error('Error approving deposit:', e);
    throw e;
  }
}

export async function rejectWalletDeposit(txId: string, notes?: string): Promise<void> {
  try {
    const docRef = doc(db, 'wallet_transactions', txId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const tx = snapshot.data() as WalletTransaction;
      if (tx.status === 'PENDING') {
        const updatedTx: WalletTransaction = {
          ...tx,
          status: 'REJECTED',
          approvedAt: new Date().toISOString(),
          notes: notes || 'જમા કરવાની વિનંતી નામંજૂર કરવામાં આવી છે. (Deposit request rejected by admin.)'
        };
        await setDoc(docRef, sanitizeForFirestore(updatedTx));
      }
    }
  } catch (e) {
    console.error('Error rejecting deposit:', e);
    throw e;
  }
}

export async function requestWalletRefund(
  userId: string, 
  amount: number, 
  name: string, 
  mobile: string,
  refundMethod: 'CASH' | 'UPI',
  upiId?: string
): Promise<void> {
  const wallet = await getWallet(userId);
  if (wallet.balance < amount) {
    throw new Error('રિફંડ માટે અપૂરતું બેલેન્સ છે. (Insufficient balance for refund.)');
  }

  // 1. Deduct balance immediately to hold it pending
  await updateWalletBalance(userId, -amount);

  // 2. Create pending refund request transaction
  await createWalletTransaction({
    userId,
    userName: name,
    userMobile: mobile,
    amount,
    type: 'REFUND_REQUEST',
    status: 'PENDING',
    paymentMethod: 'REFUND',
    refundMethod,
    upiId: refundMethod === 'UPI' ? upiId?.trim() : undefined,
    notes: refundMethod === 'UPI' 
      ? `ઓનલાઈન UPI રીફંડ વિનંતી (UPI ID: ${upiId})` 
      : 'રોકડ (Cash) રીફંડ વિનંતી - ૩ કલાકમાં લઈ જવા'
  });
}

export async function approveWalletRefund(txId: string): Promise<void> {
  try {
    const docRef = doc(db, 'wallet_transactions', txId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const tx = snapshot.data() as WalletTransaction;
      if (tx.status === 'PENDING') {
        const updatedTx: WalletTransaction = {
          ...tx,
          status: 'COMPLETED',
          approvedAt: new Date().toISOString(),
          notes: 'રિફંડ મંજૂર કરી દીધું છે. (Refund approved and completed by admin.)'
        };
        await setDoc(docRef, sanitizeForFirestore(updatedTx));
        // Note: Balance is already deducted on request time, so no need to deduct again!
      }
    }
  } catch (e) {
    console.error('Error approving refund:', e);
    throw e;
  }
}

export async function rejectWalletRefund(txId: string, notes?: string): Promise<void> {
  try {
    const docRef = doc(db, 'wallet_transactions', txId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const tx = snapshot.data() as WalletTransaction;
      if (tx.status === 'PENDING') {
        const updatedTx: WalletTransaction = {
          ...tx,
          status: 'REJECTED',
          approvedAt: new Date().toISOString(),
          notes: notes || 'રિફંડ વિનંતી નામંજૂર થઈ છે અને રકમ વોલેટમાં પરત કરવામાં આવી છે. (Refund rejected. Amount returned to wallet.)'
        };
        await setDoc(docRef, sanitizeForFirestore(updatedTx));
        // Return back the deducted amount to user's wallet
        await updateWalletBalance(tx.userId, tx.amount);
      }
    }
  } catch (e) {
    console.error('Error rejecting refund:', e);
    throw e;
  }
}

export async function getAllWallets(): Promise<Wallet[]> {
  try {
    const colRef = collection(db, 'wallets');
    const snapshot = await getDocs(colRef);
    const wallets: Wallet[] = [];
    snapshot.forEach(doc => {
      wallets.push(doc.data() as Wallet);
    });
    return wallets;
  } catch (e) {
    console.error('Error fetching all wallets:', e);
    return [];
  }
}





// --- Chat Functions ---
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  userId: string;
  userName: string;
  userMobile: string;
  messages: ChatMessage[];
  ownerUnread: number;
  userUnread: number;
  lastUpdated: string;
}

export async function sendMessage(userId: string, userName: string, userMobile: string, senderId: string, senderName: string, text: string) {
  const docRef = doc(db, 'chats', userId);
  const snapshot = await getDoc(docRef);
  
  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    senderId,
    senderName,
    text,
    timestamp: new Date().toISOString()
  };

  const isOwnerSender = isOwner();

  if (snapshot.exists()) {
    const data = snapshot.data() as ChatThread;
    const messages = [...(data.messages || []), newMessage];
    const updateData = {
      messages,
      lastUpdated: new Date().toISOString(),
      ownerUnread: isOwnerSender ? 0 : (data.ownerUnread || 0) + 1,
      userUnread: isOwnerSender ? (data.userUnread || 0) + 1 : 0
    };
    await
  updateDoc(docRef, updateData);
  } else {
    const newData: ChatThread = {
      userId,
      userName,
      userMobile,
      messages: [newMessage],
      lastUpdated: new Date().toISOString(),
      ownerUnread: isOwnerSender ? 0 : 1,
      userUnread: isOwnerSender ? 1 : 0
    };
    await setDoc(docRef, newData);
  }
}

export async function markChatRead(userId: string, isOwnerReader: boolean) {
  const docRef = doc(db, 'chats', userId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    if (isOwnerReader) {
      await
  updateDoc(docRef, { ownerUnread: 0 });
    } else {
      await
  updateDoc(docRef, { userUnread: 0 });
    }
  }
}

export function subscribeToChat(userId: string, callback: (chat: ChatThread | null) => void) {
  const docRef = doc(db, 'chats', userId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as ChatThread);
    } else {
      callback(null);
    }
  });
}

export function subscribeToAllChats(callback: (chats: ChatThread[]) => void) {
  const colRef = collection(db, 'chats');
  return onSnapshot(colRef, (snapshot) => {
    const chats: ChatThread[] = [];
    snapshot.forEach(doc => chats.push(doc.data() as ChatThread));
    chats.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    callback(chats);
  });
}

// --- Analytics & Presence ---

export async function incrementVisitorCount() {
  try {
    const docRef = doc(db, 'site_stats', 'visitors');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, { count: 1 });
    } else {
      await updateDoc(docRef, { count: increment(1) });
    }
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
  }
}

export function subscribeToVisitorCount(callback: (count: number) => void) {
  const docRef = doc(db, 'site_stats', 'visitors');
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().count || 0);
    } else {
      callback(0);
    }
  });
}

export async function updateUserOnlineStatus(currentUser: any) {
  if (!currentUser) return;
  const uid = currentUser.uid || currentUser.username;
  const username = currentUser.displayName || currentUser.name || currentUser.username || currentUser.email;
  const loginType = currentUser.email ? 'gmail' : 'username';
  const email = currentUser.email || '';
  
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    await setDoc(docRef, {
      uid,
      username,
      loginType,
      email,
      isOnline: true,
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating online status:", error);
  }
}

export async function setUserOffline(currentUser: any) {
  if (!currentUser) return;
  const uid = currentUser.uid || currentUser.username;
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    await updateDoc(docRef, { isOnline: false });
  } catch (error) {
    console.error("Error setting offline status:", error);
  }
}

export function subscribeToOnlineUsers(callback: (users: any[]) => void) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('isOnline', '==', true));
  return onSnapshot(q, (snapshot) => {
    const onlineUsers: any[] = [];
    snapshot.forEach(doc => {
      onlineUsers.push(doc.data());
    });
    callback(onlineUsers);
  });
}

export function subscribeToAllUsers(callback: (users: any[]) => void) {
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, (snapshot) => {
    const userMap: Record<string, any> = {};

    snapshot.forEach(doc => {
      const id = doc.id.toLowerCase();
      if (id === 'dayinfotech') return;

      const data = doc.data();
      const isCustomPrefix = id.startsWith('custom_');
      const rootUsername = isCustomPrefix ? id.substring(7) : id;

      if (!userMap[rootUsername]) {
        userMap[rootUsername] = {
          username: rootUsername,
          id: rootUsername
        };
      }

      if (!isCustomPrefix) {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          ...data,
          username: data.username || rootUsername,
          registered: true
        };
      } else {
        userMap[rootUsername] = {
          ...userMap[rootUsername],
          isOnline: data.isOnline ?? userMap[rootUsername].isOnline,
          lastActive: data.lastActive ?? userMap[rootUsername].lastActive,
          loginType: data.loginType ?? userMap[rootUsername].loginType,
          uid: data.uid ?? userMap[rootUsername].uid,
          password: data.password ?? userMap[rootUsername].password,
          mobile: data.mobile ?? userMap[rootUsername].mobile,
          email: data.email ?? userMap[rootUsername].email,
          dob: data.dob ?? userMap[rootUsername].dob
        };
      }
    });

    const usersList: any[] = [];
    Object.keys(userMap).forEach(key => {
      const u = userMap[key];
      if (u.mobile || u.password || u.registered || u.email) {
        usersList.push(u);
      }
    });

    callback(usersList);
  });
}

export async function resetAdminPassword(newPassword: string): Promise<void> {
  const docRef = doc(db, 'users', 'dayinfotech');
  await setDoc(docRef, {
    username: 'dayinfotech',
    password: newPassword.trim(),
    name: 'DAY INFOTECH Admin',
    mobile: '7600361873',
    dob: '1996-04-09',
    gender: 'MALE',
    email: 'bsporiya9@gmail.com',
    isCustom: true,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export function subscribeToOfflineForms(callback: (forms: OfflineForm[]) => void) {
  const formsRef = collection(db, 'offline_forms');
  const q = query(formsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const forms: OfflineForm[] = [];
    snapshot.forEach(doc => {
      forms.push({ id: doc.id, ...doc.data() } as OfflineForm);
    });
    callback(forms);
  }, (error) => {
    console.error("Error subscribing to offline forms:", error);
  });
}

export async function saveOfflineForm(form: Partial<OfflineForm> & { id?: string }): Promise<void> {
  const id = form.id || doc(collection(db, 'offline_forms')).id;
  const docRef = doc(db, 'offline_forms', id);
  await setDoc(docRef, {
    id,
    title: form.title || '',
    description: form.description || '',
    price: Number(form.price) || 0,
    pdfName: form.pdfName || '',
    pdfDataUrl: form.pdfDataUrl || '',
    downloadCount: form.downloadCount || 0,
    createdAt: form.createdAt || new Date().toISOString()
  }, { merge: true });
}

export async function deleteOfflineForm(formId: string): Promise<void> {
  const docRef = doc(db, 'offline_forms', formId);
  await deleteDoc(docRef);
}

export async function incrementOfflineFormDownloads(formId: string): Promise<void> {
  const docRef = doc(db, 'offline_forms', formId);
  await updateDoc(docRef, {
    downloadCount: increment(1)
  });
}

// ==========================================
// IMAGE ENHANCER & DOCUMENT FIXER HELPERS
// ==========================================

export interface EnhancerStats {
  usage: number;
  limit: number;
  requestStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

// Fetch enhancer stats for a user. If document doesn't exist yet, we create/merge it.
export async function getUserEnhancerStats(uid: string): Promise<EnhancerStats> {
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        usage: typeof data.enhancerUsage === 'number' ? data.enhancerUsage : 0,
        limit: typeof data.enhancerLimit === 'number' ? data.enhancerLimit : 10,
        requestStatus: data.enhancerRequestStatus || 'none'
      };
    }
  } catch (e) {
    console.warn('Error fetching enhancer stats:', e);
  }
  return { usage: 0, limit: 10, requestStatus: 'none' };
}

// Increment enhancer usage
export async function incrementUserEnhancerUsage(uid: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    const stats = await getUserEnhancerStats(uid);
    await updateDoc(docRef, {
      enhancerUsage: stats.usage + 1
    });
  } catch (e) {
    console.error('Error incrementing enhancer usage:', e);
  }
}

// Request limit increase
export async function requestUserEnhancerLimitIncrease(uid: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    await updateDoc(docRef, {
      enhancerRequestStatus: 'pending',
      enhancerRequestDate: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error requesting limit increase:', e);
  }
}

// Admin approve limit increase (+10 limit, resets request status so they can request again if they run out again)
export async function approveUserEnhancerLimitIncrease(uid: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    const stats = await getUserEnhancerStats(uid);
    await updateDoc(docRef, {
      enhancerLimit: stats.limit + 10,
      enhancerRequestStatus: 'none',
      enhancerRequestApprovedDate: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error approving limit increase:', e);
  }
}

// Admin reject limit increase
export async function rejectUserEnhancerLimitIncrease(uid: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid.toLowerCase());
    await updateDoc(docRef, {
      enhancerRequestStatus: 'rejected',
      enhancerRequestRejectedDate: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error rejecting limit increase:', e);
  }
}

// Update customizable profile details for custom users
export async function updateUserProfile(
  username: string,
  profileData: {
    profilePic?: string;
    birthPlace?: string;
    bio?: string;
    location?: string;
    education?: string;
    occupation?: string;
    facebookUrl?: string;
    instagramUrl?: string;
  }
): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  const docRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error('યુઝર મળ્યો નથી. (User not found.)');
  }
  const userData = snapshot.data();
  await setDoc(docRef, {
    ...userData,
    profilePic: profileData.profilePic ?? userData.profilePic ?? '',
    birthPlace: profileData.birthPlace ?? userData.birthPlace ?? '',
    bio: profileData.bio ?? userData.bio ?? '',
    location: profileData.location ?? userData.location ?? '',
    education: profileData.education ?? userData.education ?? '',
    occupation: profileData.occupation ?? userData.occupation ?? '',
    facebookUrl: profileData.facebookUrl ?? userData.facebookUrl ?? '',
    instagramUrl: profileData.instagramUrl ?? userData.instagramUrl ?? '',
  });

  // Also update session storage if the currently logged-in user updated their profile
  const customSession = safeGetSessionStorage('custom_user_session');
  if (customSession) {
    const session = JSON.parse(customSession);
    if (session.uid === `custom_${normalizedUsername}`) {
      const updatedSession = {
        ...session,
        profilePic: profileData.profilePic ?? session.profilePic ?? '',
        birthPlace: profileData.birthPlace ?? session.birthPlace ?? '',
        bio: profileData.bio ?? session.bio ?? '',
        location: profileData.location ?? session.location ?? '',
        education: profileData.education ?? session.education ?? '',
        occupation: profileData.occupation ?? session.occupation ?? '',
        facebookUrl: profileData.facebookUrl ?? session.facebookUrl ?? '',
        instagramUrl: profileData.instagramUrl ?? session.instagramUrl ?? '',
      };
      safeSetSessionStorage('custom_user_session', JSON.stringify(updatedSession));
    }
  }
}

// Admin toggle block status for a custom user
export async function toggleBlockUser(username: string, isBlocked: boolean): Promise<void> {
  if (!username) {
    throw new Error('અમાન્ય યુઝરનેમ. (Invalid username.)');
  }
  const normalizedUsername = username.trim().toLowerCase();
  const docRef = doc(db, 'users', normalizedUsername);
  
  try {
    await updateDoc(docRef, { isBlocked });
  } catch (err) {
    // Fallback if updateDoc fails or document doesn't have isBlocked field yet
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error('યુઝર મળ્યો નથી. (User not found.)');
    }
    await setDoc(docRef, {
      ...snapshot.data(),
      isBlocked
    }, { merge: true });
  }
}

// Admin delete custom user permanently & release the locked username
export async function deleteCustomUser(username: string): Promise<void> {
  if (!username) {
    throw new Error('અમાન્ય યુઝરનેમ. (Invalid username.)');
  }
  const normalizedUsername = username.trim().toLowerCase();
  
  // Fetch user details first before deleting
  const userDocRef = doc(db, 'users', normalizedUsername);
  const snapshot = await getDoc(userDocRef);
  let mobile = '';
  if (snapshot.exists()) {
    mobile = snapshot.data().mobile || '';
  }

  // 1. Delete user document
  await deleteDoc(userDocRef);

  // 1.1 Delete user's custom duplicate document (created by online status updates)
  try {
    const duplicateDocRef = doc(db, 'users', `custom_${normalizedUsername}`);
    await deleteDoc(duplicateDocRef);
  } catch (e) {
    console.error('Error clearing duplicate user doc during user deletion:', e);
  }

  // 2. Clear used_usernames lock so the username can be re-registered immediately
  const lockDocRef = doc(db, 'used_usernames', normalizedUsername);
  await deleteDoc(lockDocRef);

  // 3. Clear any forgot password requests associated with this mobile
  if (mobile) {
    try {
      const qPassReq = query(collection(db, 'password_requests'), where('mobile', '==', mobile));
      const passReqSnapshot = await getDocs(qPassReq);
      for (const reqDoc of passReqSnapshot.docs) {
        await deleteDoc(reqDoc.ref);
      }
    } catch (e) {
      console.error('Error clearing password requests during user deletion:', e);
    }
  }

  // 4. Delete user's applications
  try {
    const qApps = query(collection(db, 'applications'), where('userId', '==', `custom_${normalizedUsername}`));
    const appSnapshot = await getDocs(qApps);
    for (const appDoc of appSnapshot.docs) {
      await deleteDoc(appDoc.ref);
    }
  } catch (e) {
    console.error('Error clearing applications during user deletion:', e);
  }

  // 5. Delete user's wallet
  try {
    const walletDocRef = doc(db, 'wallets', `custom_${normalizedUsername}`);
    await deleteDoc(walletDocRef);
  } catch (e) {
    console.error('Error clearing wallet during user deletion:', e);
  }

  // 6. Delete user's wallet transactions
  try {
    const qTx = query(collection(db, 'wallet_transactions'), where('userId', '==', `custom_${normalizedUsername}`));
    const txSnapshot = await getDocs(qTx);
    for (const txDoc of txSnapshot.docs) {
      await deleteDoc(txDoc.ref);
    }
  } catch (e) {
    console.error('Error clearing wallet transactions during user deletion:', e);
  }

  // 7. Delete user's chats
  try {
    const chatDocRef = doc(db, 'chats', `custom_${normalizedUsername}`);
    await deleteDoc(chatDocRef);
  } catch (e) {
    console.error('Error clearing chat threads during user deletion:', e);
  }
}

// Fetch APK update settings from Firestore
export async function getApkConfig(): Promise<{ version: string; downloadUrl: string; fileName?: string; showUpdateAlert?: boolean; updatedAt: string } | null> {
  try {
    const docRef = doc(db, 'settings', 'apk_update');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data) {
        const config = {
          version: data.version || '1.0.0',
          downloadUrl: data.downloadUrl || '',
          fileName: data.fileName || '',
          showUpdateAlert: data.showUpdateAlert !== false,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
        safeSetLocalStorage('apk_update_config_fallback', JSON.stringify(config));
        return config;
      }
    }
  } catch (error) {
    console.error('Failed to fetch APK config:', error);
  }
  
  try {
    const cached = safeGetLocalStorage('apk_update_config_fallback');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}
  
  return null;
}

// Subscribe to APK update settings in real-time
export function subscribeToApkConfig(callback: (config: { version: string; downloadUrl: string; fileName?: string; showUpdateAlert?: boolean; updatedAt?: string } | null) => void) {
  const docRef = doc(db, 'settings', 'apk_update');
  return onSnapshot(docRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          const config = {
            version: data.version || '1.0.0',
            downloadUrl: data.downloadUrl || '',
            fileName: data.fileName || '',
            showUpdateAlert: data.showUpdateAlert !== false,
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          safeSetLocalStorage('apk_update_config_fallback', JSON.stringify(config));
          callback(config);
          return;
        }
      }
    } catch (e) {
      console.error('Error in APK update listener:', e);
    }
    
    // Fallback if document doesn't exist
    try {
      const cached = safeGetLocalStorage('apk_update_config_fallback');
      if (cached) {
        callback(JSON.parse(cached));
        return;
      }
    } catch (e) {}
    callback(null);
  }, (error) => {
    console.error('Failed to subscribe to APK config:', error);
  });
}

// Save APK update settings to Firestore
export async function saveApkConfig(config: { version: string; downloadUrl: string; fileName?: string; showUpdateAlert?: boolean }): Promise<void> {
  const data = {
    ...config,
    updatedAt: new Date().toISOString()
  };
  safeSetLocalStorage('apk_update_config_fallback', JSON.stringify(data));
  try {
    const docRef = doc(db, 'settings', 'apk_update');
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Failed to save APK config:', error);
    throw error;
  }
}





