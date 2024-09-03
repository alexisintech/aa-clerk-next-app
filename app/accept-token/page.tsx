'use client';
import { useUser, useSignIn } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, setActive } = useSignIn();
  const { user } = useUser();

  // Get the token from the query params
  const signInToken = useSearchParams().get('token');

  useEffect(() => {
    if (!signIn || !setActive || !signInToken) {
      return;
    }

    const createSignIn = async () => {
      try {
        // Create the `SignIn` with the token
        const signInAttempt = await signIn.create({
          strategy: 'ticket',
          ticket: signInToken as string,
        });

        // If the sign-in was successful, set the session to active
        if (signInAttempt.status === 'complete') {
          setActive({
            session: signInAttempt.createdSessionId,
            beforeEmit: () => setLoading(true),
          });
        } else {
          // If the sign-in attempt is not complete, check why.
          // User may need to complete further steps.
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error('Error:', JSON.stringify(err, null, 2));
        setLoading(true);
      }
    };

    createSignIn();
  }, [signIn, setActive]);

  if (!signInToken) {
    return <div>No token provided.</div>;
  }

  if (!loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return;
  }

  return <div>Signed in as {user.id}</div>;
}
