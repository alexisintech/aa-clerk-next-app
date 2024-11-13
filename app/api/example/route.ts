import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clerkClient();

  const response = await client.users.getOrganizationMembershipList({
    userId,
  });

  console.log(response);
  console.log(response.data[0].organization);

  return Response.json({ response });
}
