'use client';

import React from 'react';
import { useAuth, useUser, useSignIn, useSessionList } from '@clerk/nextjs';
import { UserDataJSON } from '@clerk/types';
import { useRouter } from 'next/navigation';

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

function useImpersonation(
  actorId: string | undefined,
  userId: string | undefined
) {
  const [actor, setActor] = React.useState<Actor>();
  React.useEffect(() => {
    async function generateAndSetToken() {
      if (typeof actorId !== 'string') {
        const res = await fetch('/generateActorToken', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId, // This is the user ID of the use you're going to impersonate
            actor: {
              sub: actorId, // This is the ID of the impersonator
            },
          }),
        });

        const data = await res.json();

        setActor(data);
      }
    }

    generateAndSetToken();
  }, []);

  return actor;
}

function useImpersonatedUser(
  actorSub: string,
  setImpersonator: React.Dispatch<React.SetStateAction<string | UserDataJSON>>
) {
  React.useEffect(() => {
    const getImpersonatedUser = async () => {
      const res = await fetch(`/getImpersonatedUser`, {
        method: 'POST',
        body: JSON.stringify({
          impersonator_id: actorSub,
        }),
      });

      const data = await res.json();

      setImpersonator(data);

      getImpersonatedUser();
    };
  }, [actorSub]);
}

export default function Page() {
  const [impersonator, setImpersonator] = React.useState<UserDataJSON | string>(
    ''
  );
  const { signOut, actor } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const router = useRouter();
  const { sessions } = useSessionList();

  const actorRes = useImpersonation(actor?.sub || undefined, user?.id);
  const actorUserData = useImpersonatedUser(actor?.sub || '', setImpersonator);

  function extractTicketValue(input: string): string | undefined {
    const index = input.indexOf('ticket=');
    if (index !== -1) {
      return input.slice(index + 7);
    }
    return undefined;
  }

  async function impersonateUser() {
    if (!isLoaded) return;

    if (typeof actorRes?.url === 'string') {
      const ticket = extractTicketValue(actorRes.url);

      if (ticket) {
        try {
          const { createdSessionId } = await signIn.create({
            strategy: 'ticket',
            ticket,
          });

          await setActive({ session: createdSessionId });
          await user?.reload();

          router.replace('/dashboard');
        } catch (err) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2));
        }
      }
    }
  }

  const onSignOutPress = async (sessionId: string) => {
    try {
      if (isLoaded && sessions && sessions?.length > 0) {
        const noActiveSessions = sessions.filter(
          (session) => session.user?.id !== user?.id
        );
        await setActive({ session: noActiveSessions[0].id });
      }
      await signOut({
        sessionId,
      });
      router.replace('/account');
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <p>Hello {user?.firstName}</p>

      {sessions?.map((sesh) => (
        <button onClick={() => onSignOutPress(sesh.id)} key={sesh.id}>
          <p>Sign out of {sesh?.user?.primaryEmailAddress?.emailAddress}</p>
        </button>
      ))}

      {actorRes && (
        <button
          title="Impersonate"
          onClick={async () => await impersonateUser()}
        />
      )}
    </>
  );
}
