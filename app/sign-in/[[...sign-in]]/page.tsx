'use client';

import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [useBackupCode, setUseBackupCode] = React.useState(false);
  const [displayTOTP, setDisplayTOTP] = React.useState(false);
  const router = useRouter();

  // Handle user submitting email and pass and swapping to TOTP form
  const handleFirstStage = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayTOTP(true);
  };

  // Handle the submission of the TOTP of Backup Code submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      await signIn.create({
        identifier: email,
        password,
      });

      // Attempt the TOTP or backup code verification
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: useBackupCode ? 'backup_code' : 'totp',
        code: code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  if (displayTOTP) {
    return (
      <div>
        <h1>Verify your account</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="code">Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              value={code}
            />
          </div>
          <div>
            <label htmlFor="backupcode">This code is a backup code</label>
            <input
              onChange={() => setUseBackupCode((prev) => !prev)}
              id="backupcode"
              name="backupcode"
              type="checkbox"
              checked={useBackupCode}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={(e) => handleFirstStage(e)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Continue</button>
      </form>
    </>
  );
}
