import { signIn, signOut } from '@/lib/auth';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button type="submit" className="auth-button">
        Sign in
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit" className="auth-button">
        Sign out
      </button>
    </form>
  );
}

