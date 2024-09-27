import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const response = await clerkClient.users.getUserList();

  return Response.json({ response });
}
