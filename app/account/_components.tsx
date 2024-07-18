'use client';

import React from 'react';
import { useUser, useSignIn } from '@clerk/nextjs';
import { generateActorToken } from './_actions';
import { useRouter } from 'next/navigation';

type ParsedUser = {
  id: string;
  email: string | undefined;
};
export type Actor = {
  object: string;
  id: string;
  status: 'pending' | 'accepted' | 'revoked';
  user_id: string;
  actor: object;
  token: string | null;
  url: string | null;
  created_at: Number;
  updated_at: Number;
};

async function createActorToken(actorId: string, userId: string) {
  const res = await generateActorToken(actorId, userId);

  if (!res.ok) {
    console.log('Error', res.message);
  }

  return res.token;
}

export default function ImpersonateUsers({ users }: { users: ParsedUser[] }) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const { user } = useUser();

  if (!user?.id) return null;

  // Handle "Impersonate" button click
  async function impersonateUser(actorId: string, userId: string) {
    if (!isLoaded) return;

    const actorToken = await createActorToken(actorId, userId);

    // Sign in as the impersonated user
    if (actorToken) {
      try {
        const { createdSessionId } = await signIn.create({
          strategy: 'ticket',
          ticket: actorToken,
        });

        await setActive({ session: createdSessionId });

        router.push('/');
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  return (
    <>
      <p>Hello {user?.primaryEmailAddress?.emailAddress}</p>

      <h1>Users</h1>
      <ul>
        {users?.map((userFromUserList) => {
          return (
            <li
              key={userFromUserList.id}
              style={{ display: 'flex', gap: '4px' }}
            >
              <p>
                {userFromUserList?.email
                  ? userFromUserList.email
                  : userFromUserList.id}
              </p>
              <button
                onClick={async () =>
                  await impersonateUser(user.id, userFromUserList.id)
                }
              >
                Impersonate
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
