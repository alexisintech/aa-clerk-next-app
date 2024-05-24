import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const response = await clerkClient.users.getUserList({ limit: 2 });

  console.log(response);

  return Response.json({ response });
}
