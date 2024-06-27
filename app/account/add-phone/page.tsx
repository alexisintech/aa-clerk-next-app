'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { PhoneNumberResource } from '@clerk/types';

export default function Page() {
  const { isLoaded, user } = useUser();
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [successful, setSuccessful] = React.useState(false);
  const [phoneObj, setPhoneObj] = React.useState<
    PhoneNumberResource | undefined
  >();

  if (!isLoaded) return null;

  if (isLoaded && !user?.id) {
    return <p>You must be logged in to access this page</p>;
  }

  // Handle addition of the phone number
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add phone number to user
      const res = await user.createPhoneNumber({ phoneNumber: phone });
      // Reload user to get updated user info
      await user.reload();

      // Find the phone number that was just added
      const phoneNumber = user.phoneNumbers.find((a) => a.id === res.id);
      setPhoneObj(phoneNumber);

      // Send the user an SMS with the verification code
      phoneNumber?.prepareVerification();

      // Set to true to display second form
      // and capture the OTP code
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
      const phoneVerifyAttempt = await phoneObj?.attemptVerification({ code });

      if (phoneVerifyAttempt?.verification.status === 'verified') {
        setSuccessful(true);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(phoneVerifyAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Display a success message if the phone number was added successfully
  if (successful) {
    return (
      <>
        <h1>Phone added</h1>
      </>
    );
  }

  // Display the verification form to capture the OTP code
  if (isVerifying) {
    return (
      <>
        <h1>Verify phone</h1>
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

  // Display the initial form to capture the phone number
  return (
    <>
      <h1>Add phone</h1>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="phone">Enter phone number</label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
              name="phone"
              type="phone"
              value={phone}
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
