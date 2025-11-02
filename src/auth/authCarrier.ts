import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  updatePassword, 
  sendEmailVerification,
  UserCredential
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account', 
  });
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};

export const doPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`
  });
};