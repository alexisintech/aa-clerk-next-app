import { auth, clerkClient } from '@clerk/nextjs/server';
import ImpersonateUsers from './_components';

export default async function AccountPage() {
  const { has } = auth();

  // Protect the page
  if (!has({ permission: 'org:admin:impersonate' })) {
    return <p>You do not have permission to access this page.</p>;
  }

  // Fetch list of application's users
  const users = await clerkClient.users.getUserList();

  // This needs to be a server component to use clerkClient.users.getUserList()
  // You must pass the list of users to the client for the rest of the logic
  // But you cannot pass the entire User object to the client,
  // because its too complex. So grab the data you need
  const parsedUsers = [];
  for (const user of users.data) {
    parsedUsers.push({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
    });
  }

  return <ImpersonateUsers users={parsedUsers} />;
}
