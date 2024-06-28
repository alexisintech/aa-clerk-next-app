'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { BackupCodeResource, UserResource } from '@clerk/types';

// If TOTP is enabled, provide the option to disable it
const TotpEnabled = () => {
  const { user } = useUser();

  const disableTOTP = async () => {
    await user?.disableTOTP();
  };

  return (
    <div>
      <p>
        TOTP via authenication app enabled -{' '}
        <button onClick={() => disableTOTP()}>Remove</button>
      </p>
    </div>
  );
};

// If TOTP is disabled, provide the option to enable it
const TotpDisabled = () => {
  return (
    <div>
      <p>
        Add TOTP via authentication app -{' '}
        <Link href="/account/manage-mfa/add">
          <button>Add</button>
        </Link>
      </p>
    </div>
  );
};

// Generate and display backup codes
function GenerateBackupCodes() {
  const { user } = useUser();
  const [backupCodes, setBackupCodes] = React.useState<
    BackupCodeResource | undefined
  >(undefined);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (backupCodes) {
      return;
    }

    setLoading(true);
    void user
      ?.createBackupCode()
      .then((backupCode: BackupCodeResource) => {
        setBackupCodes(backupCode);
        setLoading(false);
      })
      .catch((err) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
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
    <ol>
      {backupCodes.codes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ol>
  );
}

export default function ManageMFA() {
  const { isLoaded, user } = useUser();
  const [showNewCodes, setShowNewCodes] = React.useState(false);

  if (!isLoaded) return null;

  if (isLoaded && !user) {
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <>
      <h1>User MFA Settings</h1>

      {/* Manage TOTP MFA */}
      {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}

      {/* Manage backup codes */}
      {user.backupCodeEnabled && (
        <div>
          <p>
            Generate new codes? -{' '}
            <button onClick={() => setShowNewCodes(true)}>Generate</button>
          </p>
        </div>
      )}
      {showNewCodes && (
        <>
          <GenerateBackupCodes />
          <button onClick={() => setShowNewCodes(false)}>Done</button>
        </>
      )}
    </>
  );
}
