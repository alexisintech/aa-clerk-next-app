'use client';

import { useUser } from '@clerk/nextjs';
import { PasskeyResource } from '@clerk/types';
import { useRef, useState } from 'react';

export function RenamePasskeyUI() {
  const { user } = useUser();
  const passkeyToUpdateId = useRef<HTMLInputElement>(null);
  const newPasskeyName = useRef<HTMLInputElement>(null);
  const { passkeys } = user;
  const [success, setSuccess] = useState(false);

  const renamePasskey = async () => {
    try {
      const passkeyToUpdate = passkeys?.find(
        (pk: PasskeyResource) => pk.id === passkeyToUpdateId.current?.value
      );
      const response = await passkeyToUpdate?.update({
        name: newPasskeyName.current?.value,
      });
      console.log(response);
      setSuccess(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
      setSuccess(false);
    }
  };

  return (
    <>
      <p>Passkeys:</p>
      <ul>
        {passkeys?.map((pk: PasskeyResource) => {
          return (
            <li key={pk.id}>
              Name: {pk.name} | ID: {pk.id}
            </li>
          );
        })}
      </ul>
      <input
        ref={passkeyToUpdateId}
        type="text"
        placeholder="ID of passkey to update"
      />
      <input type="text" placeholder="New name" ref={newPasskeyName} />
      <button onClick={renamePasskey}>Rename your passkey</button>
      <p>Passkey updated: {success ? 'Yes' : 'No'}</p>
    </>
  );
}
