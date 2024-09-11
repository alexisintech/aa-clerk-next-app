'use client';

import * as React from 'react';
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Page() {
  const { isLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [signInComplete, setSignInComplete] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get the token and account status from the query params
  const token = useSearchParams().get('__clerk_ticket');
  const accountStatus = useSearchParams().get('__clerk_status');

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return <p>No invitation token found.</p>;
  }

  console.log(signIn?.status);
  console.log(signIn);

  React.useEffect(() => {
    console.log(signIn?.status);
    console.log(signIn);
    if (
      !signIn ||
      !setActiveSignIn ||
      !token ||
      accountStatus !== 'sign_in' ||
      signInComplete
    ) {
      return;
    }

    const createSignIn = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create the `SignIn` with the token
        const signInAttempt = await signIn.create({
          strategy: 'ticket',
          ticket: token as string,
        });

        // If the sign-in was successful, set the session to active
        if (signInAttempt.status === 'complete') {
          await setActiveSignIn({
            session: signInAttempt.createdSessionId,
          });
          setSignInComplete(true);
        } else {
          // If the sign-in attempt is not complete, check why.
          // User may need to complete further steps.
          setError('Sign-in attempt incomplete. Please try again.');
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (err) {
        setError('An error occurred during sign-in. Please try again.');
        console.error('Error:', JSON.stringify(err, null, 2));
      } finally {
        setLoading(false);
      }
    };

    if (!error) {
      createSignIn();
    }
  }, [signIn, setActiveSignIn, token, accountStatus, signInComplete, error]);

  // Handle submission of the sign-up form
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No invitation token found.');
        return;
      }

      const signUpAttempt = await signUp.create({
        strategy: 'ticket',
        ticket: token,
        firstName,
        lastName,
        password,
      });

      if (signUpAttempt.status === 'complete') {
        await setActiveSignUp({ session: signUpAttempt.createdSessionId });
      } else {
        setError('Sign-up attempt incomplete. Please try again.');
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      setError('An error occurred during sign-up. Please try again.');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (accountStatus === 'sign_in') {
    return <div>Signing you in...</div>;
  }

  if (accountStatus === 'sign_up') {
    return (
      <>
        <h1>Sign up</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <label htmlFor="firstName">Enter first name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Enter last name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Enter password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Next'}
            </button>
          </div>
        </form>
      </>
    );
  }

  return <div>Organization invitation accepted!</div>;
}
