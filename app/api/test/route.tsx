import { clerkClient } from "@clerk/nextjs/server";

// testclerk123 userId: user_2bxfCJOe0Ocd8DNe9hFN3EXvfOu

export async function GET() {
  const response = await clerkClient.users.verifyPassword({
    userId: "user_2bxfCJOe0Ocd8DNe9hFN3EXvfOu",
    password: "testclerk1234"
  })
  
  console.log(response);

  return Response.json({ message: "success" })
}