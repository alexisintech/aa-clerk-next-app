'use server';

import { auth } from '@clerk/nextjs/server';

export async function generateActorToken(actorId: string, userId: string) {
  // Check if the user has the permission to impersonate
  if (!auth().has({ permission: 'org:admin:impersonate' })) {
    return {
      ok: false,
      message: 'You do not have permission to access this page.',
    };
  }

  const params = JSON.stringify({
    user_id: userId,
    actor: {
      sub: actorId,
    },
  });

  // Create an actor token
  const res = await fetch('https://api.clerk.com/v1/actor_tokens', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-type': 'application/json',
    },
    body: params,
  });

  if (!res.ok) {
    return { ok: false, message: 'Failed to generate actor token' };
  }
  const data = await res.json();

  return { ok: true, token: data.token };
}
