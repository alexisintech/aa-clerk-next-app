'use client';

import { useUser } from '@clerk/nextjs';
import { BackupCodeResource, TOTPResource, UserResource } from '@clerk/types';
import Link from 'next/link';
import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';

type AddTotpSteps = 'add' | 'verify' | 'backupcodes' | 'success';

type DisplayFormat = 'qr' | 'uri';

function AddTotpScreen({
  setStep,
  user,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
  user: UserResource;
}) {
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined);
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat>('qr');

  React.useEffect(() => {
    void user
      .createTOTP()
      .then((totp: TOTPResource) => {
        setTOTP(totp);
      })
      .catch((err) =>
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      );
  }, []);

  return (
    <>
      <h1>Add TOTP MFA</h1>

      {totp && displayFormat === 'qr' && (
        <>
          <div>
            <QRCodeSVG value={totp?.uri || ''} size={200} />
          </div>
          <button onClick={() => setDisplayFormat('uri')}>
            Use URI instead
          </button>
        </>
      )}
      {totp && displayFormat === 'uri' && (
        <>
          <div>
            <p>{totp.uri}</p>
          </div>
          <button onClick={() => setDisplayFormat('qr')}>
            Use QR Code instead
          </button>
        </>
      )}
      <button onClick={() => setStep('add')}>Reset</button>

      <p>Once you have set up your authentication app, verify your code</p>
      <button onClick={() => setStep('verify')}>Verify</button>
    </>
  );
}

function VerifyTotpScreen({
  setStep,
  user,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
  user: UserResource;
}) {
  const [code, setCode] = React.useState('');

  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user.verifyTOTP({ code });
      setStep('backupcodes');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <h1>Verify TOTP</h1>
      <form onSubmit={(e) => verifyTotp(e)}>
        <label htmlFor="totp-code">
          Enter the code from your authentication app
        </label>
        <input
          type="text"
          id="totp-code"
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <button type="submit">Verify code</button>
        <button onClick={() => setStep('add')}>Reset</button>
      </form>
    </>
  );
}

// Generate and display backup codes
function GenerateBackupCodes({
  setStep,
  user,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
  user: UserResource;
}) {
  const [backupCodes, setBackupCodes] = React.useState<
    BackupCodeResource | undefined
  >(undefined);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (backupCodes) return;

    setLoading(true);

    void user
      .createBackupCode()
      .then((backupCode: BackupCodeResource) => {
        setBackupCodes(backupCode);
        setLoading(false);
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!backupCodes) {
    return <p>There was a problem generating backup codes</p>;
  }

  return (
    <>
      <h1>Backup codes</h1>
      <div>
        <p>
          Save this list of backup codes somewhere safe in case you need to
          access your account in an emergency
        </p>
        <ol>
          {!loading &&
            backupCodes.codes.map((code, index) => <li key={index}>{code}</li>)}
        </ol>
        <button onClick={() => setStep('success')}>Finish</button>
      </div>
    </>
  );
}

function SuccessScreen() {
  return (
    <>
      <h1>Success!</h1>
      <p>
        You have successfully added TOTP MFA via an authentication application.
      </p>
    </>
  );
}

export default function AddTOTP() {
  const [step, setStep] = React.useState<AddTotpSteps>('add');
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  if (isLoaded && !user?.id) {
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <>
      {step === 'add' && <AddTotpScreen user={user} setStep={setStep} />}
      {step === 'verify' && <VerifyTotpScreen user={user} setStep={setStep} />}
      {step === 'backupcodes' && (
        <GenerateBackupCodes user={user} setStep={setStep} />
      )}
      {step === 'success' && <SuccessScreen />}
      <Link href="/account/manage-mfa">Manage MFA</Link>
    </>
  );
}
