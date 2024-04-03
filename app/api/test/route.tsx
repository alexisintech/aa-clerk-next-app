import { clerkClient } from "@clerk/nextjs/server";

// testclerk123 userId: user_2cSSCzV7948rhPJMsY601tXsEU4

export async function GET() {
  const userId = 'user_2V7JJKmoA9HqzHhfMqK5cpgLl56';

  const provider = 'oauth_google';

  const response = await clerkClient.users.getUserOauthAccessToken(userId, provider);

  console.log(response);

  return Response.json({ message: "success" })
}
