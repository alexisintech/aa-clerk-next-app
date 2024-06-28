'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  BackupCodeResource,
  PhoneNumberResource,
  UserResource,
} from '@clerk/types';

// Display phone numbers reserved for MFA
const ManageMfaPhoneNumbers = ({ user }: { user: UserResource }) => {
  // Check if any phone numbers are reserved for MFA
  const mfaPhones = user.phoneNumbers
    .filter((ph) => ph.verification.status === 'verified')
    .filter((ph) => ph.reservedForSecondFactor)
    .sort((ph: PhoneNumberResource) => (ph.defaultSecondFactor ? -1 : 1));

  return (
    <>
      <h2>Phone numbers reserved for MFA</h2>
      {mfaPhones.length === 0 && <p>No phone numbers reserved for MFA</p>}
      <table>
        <tr>
          <th>Phone number</th>
          <th>Actions</th>
        </tr>
        {mfaPhones.map((phone) => {
          return (
            <tr key={phone.id}>
              <td>
                {phone.phoneNumber} {phone.defaultSecondFactor && '(Default)'}
              </td>
              <td>
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
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

// Display phone numbers that are not reserved for MFA
const ManageAvailablePhoneNumbers = ({ user }: { user: UserResource }) => {
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
        <table>
          <tr>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
          {availalableForMfaPhones.map((phone) => {
            return (
              <tr key={phone.id}>
                <td>{phone.phoneNumber}</td>
                <td>
                  <button onClick={() => reservePhoneForMfa(phone)}>
                    Use for MFA
                  </button>
                  <button onClick={() => phone.destroy()}>
                    Remove from account
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </>
  );
};

// If TOTP is enabled, provide the option to disable it
const TotpEnabled = ({ user }: { user: UserResource }) => {
  const disableTOTP = async () => {
    await user.disableTOTP();
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
        <Link href="/account/manage-mfa/add-totp">
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
      {!loading &&
        backupCodes.codes.map((code, index) => <li key={index}>{code}</li>)}
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

      {/* Manage SMS MFA */}
      <ManageMfaPhoneNumbers user={user} />
      <ManageAvailablePhoneNumbers user={user} />

      {/* Manage TOTP MFA */}
      {user.totpEnabled ? <TotpEnabled user={user} /> : <TotpDisabled />}

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
