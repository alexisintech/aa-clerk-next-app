import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const userId = 'user_3';

  const response = await clerkClient.users.getUser(userId);

  console.log(response);

  return Response.json({ response });
}
