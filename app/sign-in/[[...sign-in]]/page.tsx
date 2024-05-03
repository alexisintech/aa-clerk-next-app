'use client';

import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [verifying, setVerifying] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signIn) return null;

    try {
      // Start the sign-in process using the phone number method
      const { supportedFirstFactors } = await signIn.create({
        identifier: phone,
      });

      // Filter the returned array to find the 'phone_code' entry
      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === 'phone_code';
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        // Grab the phoneNumberId
        const { phoneNumberId } = phoneCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });

        // Set verifying to true to display second form and capture the OTP code
        setVerifying(true);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signIn) return null;

    try {
      // Use the code provided by the user and attempt verification
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      });

      // This mainly for debugging while developing.
      // Once your instance is setup, this should not be required.
      if (completeSignIn.status !== 'complete') {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });

        router.push('/');
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your phone number</h1>
        <form onSubmit={handleVerification}>
          <label htmlFor="code">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone">Enter phone number</label>
        <input
          value={phone}
          id="phone"
          name="phone"
          type="tel"
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
    </>
  );
}
