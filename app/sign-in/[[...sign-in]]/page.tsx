'use client';

import * as React from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';

export default function OauthSignIn() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  if (!signIn || !signUp) return null;

  async function handleSignIn(e: React.FormEvent) {
    if (!signIn || !signUp) return null;

    // If the user has an account in your application, but does not yet
    // have a SAML account connected to it, you can transfer the SAML
    // account to the existing user account.
    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code ===
        'external_account_exists';

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    }

    // If the user has a SAML account but does not yet
    // have an account in your app, you can create an account
    // for them using the SAML information.
    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      // If the user has an account in your application
      // and has an SAML account connected to it, you can sign them in.
      signInWith(e);
    }
  }

  const signInWith = (e: React.FormEvent) => {
    e.preventDefault();

    const email = (e.target as HTMLFormElement).email.value;

    signIn
      .authenticateWithRedirect({
        identifier: email,
        strategy: 'saml',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app
  return (
    <form onSubmit={(e) => handleSignIn(e)}>
      <input type="email" name="email" placeholder="Enter email address" />
      <button>Sign in with SAML</button>
    </form>
  );
}
