'use client';

import { useUser } from '@clerk/nextjs';

export function CreatePasskeyButton() {
  const { user } = useUser();

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  return <button onClick={createClerkPasskey}>Create a passkey now</button>;
}
