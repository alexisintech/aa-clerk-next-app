'use client';

import * as React from 'react';
import { useOrganization, useSignIn, useSignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { organization } = useOrganization();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Get the token and account status from the query params
  const token = useSearchParams().get('__clerk_ticket');
  const accountStatus = useSearchParams().get('__clerk_status');

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return <p>No invitation token found.</p>;
  }

  // Handle sign-in
  React.useEffect(() => {
    if (
      !signIn ||
      !setActiveSignIn ||
      !token ||
      organization ||
      accountStatus !== 'sign_in'
    ) {
      return;
    }

    const createSignIn = async () => {
      try {
        // Create a new `SignIn` with the supplied invitation token.
        // Make sure you're also passing the ticket strategy.
        const signInAttempt = await signIn.create({
          strategy: 'ticket',
          ticket: token as string,
        });

        // If the sign-in was successful, set the session to active
        if (signInAttempt.status === 'complete') {
          await setActiveSignIn({
            session: signInAttempt.createdSessionId,
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
      }
    };

    createSignIn();
  }, [signIn]);

  // Handle submission of the sign-up form
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Create a new sign-up with the supplied invitation token.
      // Make sure you're also passing the ticket strategy.
      // After the below call, the user's email address will be
      // automatically verified because of the invitation token.
      const signUpAttempt = await signUp.create({
        strategy: 'ticket',
        ticket: token,
        firstName,
        lastName,
        password,
      });

      // If the sign-up was successful, set the session to active
      if (signUpAttempt.status === 'complete') {
        await setActiveSignUp({ session: signUpAttempt.createdSessionId });
      } else {
        // If the sign-in attempt is not complete, check why.
        // User may need to complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (accountStatus === 'sign_in' && !organization) {
    return <div>Signing you in...</div>;
  }

  if (accountStatus === 'sign_up' && !organization) {
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
            <button type="submit">Next</button>
          </div>
        </form>
      </>
    );
  }

  return <div>Organization invitation accepted!</div>;
}
