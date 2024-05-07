'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  return (
    <div className="grid items-center flex-grow w-full px-4 bg-gray-50 dark:bg-gray-900 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step
                name="start"
                className="grid w-full h-full place-content-center"
              >
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Sign in to Acme Co</CardTitle>
                    <CardDescription>
                      Welcome back! Please sign in to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-2 gap-x-4">
                      <Clerk.Connection name="github" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:github">
                            {(isLoading) =>
                              isLoading ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-4 animate-spin"
                                >
                                  <path d="M12 2v4" />
                                  <path d="m16.2 7.8 2.9-2.9" />
                                  <path d="M18 12h4" />
                                  <path d="m16.2 16.2 2.9 2.9" />
                                  <path d="M12 18v4" />
                                  <path d="m4.9 19.1 2.9-2.9" />
                                  <path d="M2 12h4" />
                                  <path d="m4.9 4.9 2.9 2.9" />
                                </svg>
                              ) : (
                                <>
                                  <Clerk.Icon className="mr-2 size-4" />
                                  GitHub
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                      <Clerk.Connection name="google" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-4 animate-spin"
                                >
                                  <path d="M12 2v4" />
                                  <path d="m16.2 7.8 2.9-2.9" />
                                  <path d="M18 12h4" />
                                  <path d="m16.2 16.2 2.9 2.9" />
                                  <path d="M12 18v4" />
                                  <path d="m4.9 19.1 2.9-2.9" />
                                  <path d="M2 12h4" />
                                  <path d="m4.9 4.9 2.9 2.9" />
                                </svg>
                              ) : (
                                <>
                                  <Clerk.Icon className="mr-2 size-4" />
                                  Google
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center text-sm before:bg-border after:bg-border text-muted-foreground gap-x-3 before:h-px before:flex-1 after:h-px after:flex-1">
                      or
                    </p>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email</Label>
                      </Clerk.Label>
                      <Clerk.Input asChild>
                        <Input type="email" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          className="min-w-full"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-4 animate-spin"
                                >
                                  <path d="M12 2v4" />
                                  <path d="m16.2 7.8 2.9-2.9" />
                                  <path d="M18 12h4" />
                                  <path d="m16.2 16.2 2.9 2.9" />
                                  <path d="M12 18v4" />
                                  <path d="m4.9 19.1 2.9-2.9" />
                                  <path d="M2 12h4" />
                                  <path d="m4.9 4.9 2.9 2.9" />
                                </svg>
                              ) : (
                                'Continue'
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>

                      <Button variant="link" size="sm" asChild>
                        <a href="#" className="font-medium hover:underline">
                          Don&apos;t have an account? Sign up
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <div className="grid w-full h-full place-content-center">
                  <Card className="w-[350px]">
                    <CardHeader>
                      <CardTitle>Use another method</CardTitle>
                      <CardDescription>
                        Facing issues? You can use any of these methods to sign
                        in.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <SignIn.SupportedStrategy name="email_code" asChild>
                        <Button variant="link" disabled={isGlobalLoading}>
                          Email code
                        </Button>
                      </SignIn.SupportedStrategy>
                      <SignIn.SupportedStrategy name="password" asChild>
                        <Button variant="link" disabled={isGlobalLoading}>
                          Password
                        </Button>
                      </SignIn.SupportedStrategy>
                    </CardContent>
                    <CardFooter>
                      <SignIn.Action navigate="previous" asChild>
                        <Button className="w-full" disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-4 animate-spin"
                                >
                                  <path d="M12 2v4" />
                                  <path d="m16.2 7.8 2.9-2.9" />
                                  <path d="M18 12h4" />
                                  <path d="m16.2 16.2 2.9 2.9" />
                                  <path d="M12 18v4" />
                                  <path d="m4.9 19.1 2.9-2.9" />
                                  <path d="M2 12h4" />
                                  <path d="m4.9 4.9 2.9 2.9" />
                                </svg>
                              ) : (
                                'Go back'
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </CardFooter>
                  </Card>
                </div>
              </SignIn.Step>

              <SignIn.Step
                name="verifications"
                className="grid w-full h-full place-content-center"
              >
                <SignIn.Strategy name="password">
                  <Card className="w-[350px]">
                    <CardHeader>
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Welcome back <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" asChild>
                          <Input type="password" />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button>Continue</Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button size="sm" variant="link">
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <Card className="w-[350px]">
                    <CardHeader>
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Welcome back <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code" className="space-y-2">
                        <Clerk.Label className="sr-only">
                          Verification code
                        </Clerk.Label>
                        <Clerk.Input type="otp" autoSubmit />
                        <SignIn.Action
                          asChild
                          resend
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <p className="text-sm text-muted-foreground">
                              Didn&apos;t recieve a code? Resend (
                              <span className="tabular-nums">
                                {resendableAfter}
                              </span>
                              )
                            </p>
                          )}
                        >
                          <Button variant="link" size="sm">
                            Didn&apos;t recieve a code? Resend
                          </Button>
                        </SignIn.Action>
                        <Clerk.FieldError className="block text-sm text-center text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button>Continue</Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button size="sm" variant="link">
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}
