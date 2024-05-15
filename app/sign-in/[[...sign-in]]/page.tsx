'use client';

import * as React from 'react';
import { OAuthStrategy } from '@clerk/types';
import { SignInButton, useSignIn, useSignUp } from '@clerk/nextjs';

export default function OauthSignIn() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  if (!signIn || !signUp) return null;

  async function handleSignIn(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null;

    // If the user has an account in your application, but does not yet
    // have an OAuth account connected to it, you can transfer the OAuth
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

    // If the user has an OAuth account but does not yet have an account in your app, you can create an account for them using the OAuth account.

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
      signInWith(strategy);
    }
  }

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app
  return (
    <div>
      <button onClick={() => handleSignIn('oauth_google')}>
        Sign in with Google
      </button>
      <SignInButton />
    </div>
  );
}
