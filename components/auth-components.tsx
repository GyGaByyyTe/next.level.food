'use client';

import { useFormStatus } from 'react-dom';
import { signInAction, signOutAction } from '@/lib/auth-actions';

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-button" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-button" disabled={pending}>
      {pending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

export function SignIn() {
  return (
    <form action={signInAction}>
      <SignInButton />
    </form>
  );
}

export function SignOut() {
  return (
    <form action={signOutAction}>
      <SignOutButton />
    </form>
  );
}



