'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { BackupCodeResource, PhoneNumberResource } from '@clerk/types';
import Link from 'next/link';

// Display phone numbers reserved for MFA
const ManageMfaPhoneNumbers = () => {
  const { user } = useUser();

  if (!user) return null;

  // Check if any phone numbers are reserved for MFA
  const mfaPhones = user.phoneNumbers
    .filter((ph) => ph.verification.status === 'verified')
    .filter((ph) => ph.reservedForSecondFactor)
    .sort((ph: PhoneNumberResource) => (ph.defaultSecondFactor ? -1 : 1));

  return (
    <>
      <h2>Phone numbers reserved for MFA</h2>
      {mfaPhones.length === 0 ? (
        <p>No phone numbers reserved for MFA</p>
      ) : (
        <ul>
          {mfaPhones.map((phone) => {
            return (
              <li key={phone.id} style={{ display: 'flex', gap: '10px' }}>
                <p>
                  {phone.phoneNumber} {phone.defaultSecondFactor && '(Default)'}
                </p>
                <div>
                  <button
                    onClick={() =>
                      phone.setReservedForSecondFactor({ reserved: false })
                    }
                  >
                    Disable for MFA
                  </button>
                </div>

                {!phone.defaultSecondFactor && (
                  <div>
                    <button onClick={() => phone.makeDefaultSecondFactor()}>
                      Make default
                    </button>
                  </div>
                )}

                <div>
                  <button onClick={() => phone.destroy()}>
                    Remove from account
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

// Display phone numbers that are not reserved for MFA
const ManageAvailablePhoneNumbers = () => {
  const { user } = useUser();

  if (!user) return null;

  // Check if any phone numbers aren't reserved for MFA
  const availalableForMfaPhones = user.phoneNumbers
    .filter((ph) => ph.verification.status === 'verified')
    .filter((ph) => !ph.reservedForSecondFactor);

  // Reserve a phone number for MFA
  const reservePhoneForMfa = async (phone: PhoneNumberResource) => {
    // Set the phone number as reserved for MFA
    await phone.setReservedForSecondFactor({ reserved: true });
    // Refresh the user information to reflect changes
    await user.reload();
  };

  return (
    <>
      <h2>Phone numbers that are not reserved for MFA</h2>
      {availalableForMfaPhones.length === 0 ? (
        <p>
          None - <Link href="/account/add-phone">Add a new phone number</Link>
        </p>
      ) : (
        <ul>
          {availalableForMfaPhones.map((phone) => {
            return (
              <li key={phone.id} style={{ display: 'flex', gap: '10px' }}>
                <p>{phone.phoneNumber}</p>
                <div>
                  <button onClick={() => reservePhoneForMfa(phone)}>
                    Use for MFA
                  </button>
                </div>
                <div>
                  <button onClick={() => phone.destroy()}>
                    Remove from account
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
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

export default function ManageSmsMFA() {
  const [showBackupCodes, setShowBackupCodes] = React.useState(false);

  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  if (isLoaded && !user) {
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <>
      <h1>User MFA Settings</h1>

      {/* Manage SMS MFA */}
      <ManageMfaPhoneNumbers />
      <ManageAvailablePhoneNumbers />

      {/* Manage backup codes */}
      {user.twoFactorEnabled && (
        <div>
          <p>
            Generate new backup codes? -{' '}
            <button onClick={() => setShowBackupCodes(true)}>Generate</button>
          </p>
        </div>
      )}
      {showBackupCodes && (
        <>
          <GenerateBackupCodes />
          <button onClick={() => setShowBackupCodes(false)}>Done</button>
        </>
      )}
    </>
  );
}
