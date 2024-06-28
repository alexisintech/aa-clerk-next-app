'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { EmailAddressResource } from '@clerk/types';

export default function Page() {
  const { isLoaded, user } = useUser();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [successful, setSuccessful] = React.useState(false);
  const [emailObj, setEmailObj] = React.useState<
    EmailAddressResource | undefined
  >();

  if (!isLoaded) return null;

  if (isLoaded && !user?.id) {
    return <p>You must be logged in to access this page</p>;
  }

  // Handle addition of the email address
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add email address to user
      const res = await user.createEmailAddress({ email });
      // Reload user to get updated user info
      await user.reload();

      // Find the email address that was just added
      const emailAddress = user.emailAddresses.find((a) => a.id === res.id);
      setEmailObj(emailAddress);

      // Send the user an email with the verification code
      emailAddress?.prepareVerification({ strategy: 'email_code' });

      // Set to true to display second form
      // for capturing the OTP code
      setIsVerifying(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle the submission of the verification form
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the code the user provided to attempt verification
      const emailVerifyAttempt = await emailObj?.attemptVerification({ code });

      if (emailVerifyAttempt?.verification.status === 'verified') {
        setSuccessful(true);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(emailVerifyAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Display a success message if the email was added successfully
  if (successful) {
    return (
      <>
        <h1>Email added!</h1>
      </>
    );
  }

  // Display the verification form to capture the OTP code
  if (isVerifying) {
    return (
      <>
        <h1>Verify email</h1>
        <div>
          <form onSubmit={(e) => verifyCode(e)}>
            <div>
              <label htmlFor="code">Enter code</label>
              <input
                onChange={(e) => setCode(e.target.value)}
                id="code"
                name="code"
                type="text"
                value={code}
              />
            </div>
            <div>
              <button type="submit">Verify</button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Display the initial form to capture the email address
  return (
    <>
      <h1>Add Email</h1>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="email">Enter email address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              value={email}
            />
          </div>
          <div>
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    </>
  );
}
