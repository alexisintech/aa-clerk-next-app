import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const response = await clerkClient.authenticateRequest(req)

  console.log(response);

  // if ( !isSignedIn ) {
  //   return NextResponse.json({ status: 401 })
  // }
  
  // // Perform protected actions

  // return NextResponse.json({ message: "This is a reply" })
}