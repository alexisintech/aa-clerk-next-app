import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'No authenticated user found. Please sign in.' }, { status: 401 })
  }

  const user = await clerkClient.users.getUser(userId);

  // List out the user's email addresses
  console.log(user.emailAddresses);

  // Set the user's primary email address ID to be the ID that you chose. For this example, we'll use the second in the list.
  const primaryEmailAddressID = user.emailAddresses[0].id;

  // Update the user's primary email address
  const response = await clerkClient.users.updateUser(userId, { primaryEmailAddressID });

return Response.json({ response })
}
