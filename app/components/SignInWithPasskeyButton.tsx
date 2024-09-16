'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function SignInWithPasskeyButton() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const signInWithPasskey = async () => {
    // 'discoverable' lets the user choose a passkey
    // without autofilling any of the options
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: 'discoverable',
      });

      if (signInAttempt?.status === 'complete') {
        router.push('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  return <button onClick={signInWithPasskey}>Sign in with a passkey</button>;
}
