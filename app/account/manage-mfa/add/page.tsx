'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { PhoneNumberResource } from '@clerk/types';
import Link from 'next/link';

type AddMfaSteps = 'add' | 'verify' | 'success';

const AddPhoneScreen = ({
  setStep,
  setPhoneObj,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddMfaSteps>>;
  setPhoneObj: React.Dispatch<
    React.SetStateAction<PhoneNumberResource | undefined>
  >;
}) => {
  const [phone, setPhone] = React.useState('');

  const { isLoaded, user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirm that Clerk and the user have loaded.
    // This could be handled earlier and include a redirect to /sign-in
    if (!isLoaded || !user) return null;

    try {
      // Add an unverified phone number to the user's account
      const res = await user?.createPhoneNumber({ phoneNumber: phone });
      // Refresh the user so the new number is available
      await user.reload();
      // Select the newly added number from the `phoneNumbers` array
      const phoneNumber = user.phoneNumbers.find((a) => a.id === res.id);
      // Save this to the `phoneObj` state
      setPhoneObj(phoneNumber);
      // Send a code to the new number for verification
      phoneNumber?.prepareVerification();
      // Set the step to `verify` so the verification form is rendered
      setStep('verify');
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="phone">Add Phone</label>
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
};

const VerifyPhoneScreen = ({
  setStep,
  phoneObj,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddMfaSteps>>;
  phoneObj: PhoneNumberResource | undefined;
}) => {
  const [code, setCode] = React.useState('');

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Attempt to verify the code that the user provided
      // If successful, the user's number will be marked as verified
      await phoneObj?.attemptVerification({ code });

      // Display the success component
      setStep('success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => verifyCode(e)}>
        <div>
          <label htmlFor="code">Enter Code</label>
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
  );
};

function SuccessScreen() {
  // This could be modified to show the newly added number and allow it to be selected for 2fa
  // For this custom flow we will keep that logic in the main MFA management route
  return (
    <>
      <h1>Success Screen</h1>
      <p>You successfully added phone number</p>
    </>
  );
}

export default function AddMfaScreen() {
  const [step, setStep] = React.useState<AddMfaSteps>('add');
  const [phoneObj, setPhoneObj] = React.useState<
    PhoneNumberResource | undefined
  >();

  return (
    <>
      {step === 'add' && (
        <AddPhoneScreen setStep={setStep} setPhoneObj={setPhoneObj} />
      )}
      {step === 'verify' && (
        <VerifyPhoneScreen setStep={setStep} phoneObj={phoneObj} />
      )}
      {step === 'success' && <SuccessScreen />}
      <Link href="/custom-flows/account/manage-sms-mfa">Manage MFA</Link>
    </>
  );
}
