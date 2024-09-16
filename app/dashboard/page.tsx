import { auth, clerkClient } from '@clerk/nextjs/server';
import { OrgDetails, SessionDetails, UserDetails } from './details';
import Link from 'next/link';
import { JoinedOrganizations } from '../components/UserMemberships';
import UserInvitationsList from '../components/UserInvitationsList';
import { CustomOrganizationSwitcher } from '../components/CustomOrgSwitcher';
import { InvitationsList } from '../components/InvitationsList';
import { ManageRoles } from '../components/ManageRoles';
import { UpdateOrganization } from '../components/UpdateOrg';
import { OrgMembershipRequests } from '../components/MembershipRequests';
import { CreatePasskeyButton } from '../components/CustomCreatePasskeysButton';
import { RenamePasskeyUI } from '../components/RenamePasskey';
import { DeletePasskeyUI } from '../components/DeletePasskeyUI';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    auth().protect();
  }

  const user = await clerkClient.users.getUser(userId!);

  console.log(user);

  return (
    <>
      <div className="px-8 py-12 sm:py-16 md:px-20">
        {user && (
          <>
            <h1 className="text-3xl font-semibold text-black">
              👋 Hi, {user.firstName || `Stranger`}
            </h1>
            <div className="grid gap-4 mt-8 lg:grid-cols-3">
              <UserDetails />
              <SessionDetails />
              <OrgDetails />
            </div>
            <h2 className="mt-16 mb-4 text-3xl font-semibold text-black">
              What's next?
            </h2>
            Read the{' '}
            <Link
              className="font-medium text-primary-600 hover:underline"
              href="https://clerk.com/docs?utm_source=vercel-template&utm_medium=template_repos&utm_campaign=nextjs_template"
              target="_blank"
            >
              Clerk Docs -&gt;
            </Link>
            <div className="mt-5 space-y-5 flex-column">
              <UserInvitationsList />
              <InvitationsList />
              <JoinedOrganizations />
              <CustomOrganizationSwitcher />
              <ManageRoles />
              <UpdateOrganization />
              <OrgMembershipRequests />
              <CreatePasskeyButton />
              <RenamePasskeyUI />
              <DeletePasskeyUI />
            </div>
          </>
        )}
      </div>
    </>
  );
}
