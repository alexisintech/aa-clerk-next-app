import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { isSignedIn, token } = await clerkClient.authenticateRequest(req);

  if (!isSignedIn) {
    return NextResponse.json({ status: 401 });
  }

  // Perform protected actions

  return NextResponse.json({ message: token });
}
