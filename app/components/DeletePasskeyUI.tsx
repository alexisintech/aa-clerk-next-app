'use client';

import { useUser } from '@clerk/nextjs';
import { useRef, useState } from 'react';

export function DeletePasskeyUI() {
  const { user } = useUser();
  const passkeyToDeleteId = useRef<HTMLInputElement>(null);
  const { passkeys } = user;
  const [success, setSuccess] = useState(false);

  const deletePasskey = async () => {
    const passkeyToDelete = passkeys?.find(
      (pk: any) => pk.id === passkeyToDeleteId.current?.value
    );
    try {
      const response = await passkeyToDelete?.delete();
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
        {passkeys?.map((pk: any) => {
          return (
            <li key={pk.id}>
              Name: {pk.name} | ID: {pk.id}
            </li>
          );
        })}
      </ul>
      <input
        ref={passkeyToDeleteId}
        type="text"
        placeholder="ID of passkey to delete"
      />
      <button onClick={deletePasskey}>Delete passkey</button>
      <p>Passkey deleted: {success ? 'Yes' : 'No'}</p>
    </>
  );
}
