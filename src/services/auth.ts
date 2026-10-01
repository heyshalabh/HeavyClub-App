import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

export async function signUp(
  email: string,
  password: string,
  name: string,
  username: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await sendEmailVerification(user);

  const profile: Omit<UserProfile, 'uid'> & { uid: string } = {
    uid: user.uid,
    name,
    username: username.toLowerCase().replace(/\s+/g, ''),
    email,
    photoURL: null,
    visibility: 'private',
    clubId: null,
    joinedAt: Date.now(),
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    prCount: 0,
    lastWorkoutAt: null,
  };

  await setDoc(doc(db, 'users', user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
  });

  // Public username lookup
  await setDoc(doc(db, 'usernames', profile.username), {
    uid: user.uid,
  });

  return user;
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const username =
      user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      `user${Date.now().toString(36)}`;
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || 'Athlete',
      username,
      email: user.email,
      photoURL: user.photoURL,
      visibility: 'private',
      clubId: null,
      joinedAt: Date.now(),
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      prCount: 0,
      lastWorkoutAt: null,
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'usernames', username), { uid: user.uid });
  }
  return user;
}

export async function logOut() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as UserProfile;
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
