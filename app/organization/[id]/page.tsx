'use client';

import { useState, useEffect, ChangeEventHandler, useRef } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import type { OrganizationCustomRoleKey } from '@clerk/types';

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
};
export const OrgMembershipRequestsParams = {
  membershipRequests: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

// View and manage active organization members,
// along with any pending invitations.
// Invite new members.
export default function Organization() {
  const { organization: currentOrganization, isLoaded } = useOrganization();

  if (!isLoaded || !currentOrganization) {
    return null;
  }

  return (
    <>
      <h1>Organization: {currentOrganization.name}</h1>
      <h2 className="mt-12 mb-6">Custom List Invitations</h2>
      <OrgInvitations />
      <h2 className="mt-12 mb-6">Custom List Membership Requests</h2>
      <OrgMembershipRequests />
      <h2 className="mt-12 mb-6">Custom List Memberships</h2>
      <OrgMembers />
      <h2 className="mt-12 mb-6">Custom Invite Form</h2>
      <OrgInviteMemberForm />
    </>
  );
}

// List of organization memberships. Administrators can
// change member roles or remove members from the organization.
export const OrgMembers = () => {
  const { user } = useUser();
  const { isLoaded, memberships } = useOrganization(OrgMembersParams);

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Joined</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships?.data?.map((mem) => (
            <tr key={mem.id}>
              <td>
                {mem.publicUserData.identifier}{' '}
                {mem.publicUserData.userId === user?.id && '(You)'}
              </td>
              <td>{mem.createdAt.toLocaleDateString()}</td>
              <td>
                <SelectRole
                  defaultRole={mem.role}
                  onChange={async (e) => {
                    await mem.update({
                      role: e.target.value as OrganizationCustomRoleKey,
                    });
                    await memberships?.revalidate();
                  }}
                />
              </td>
              <td>
                <button
                  onClick={async () => {
                    await mem.destroy();
                    await memberships?.revalidate();
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <button
          className="inline-block"
          disabled={!memberships?.hasPreviousPage || memberships?.isFetching}
          onClick={() => memberships?.fetchPrevious?.()}
        >
          Previous
        </button>

        <button
          className="inline-block"
          disabled={!memberships?.hasNextPage || memberships?.isFetching}
          onClick={() => memberships?.fetchNext?.()}
        >
          Next
        </button>
      </div>
    </>
  );
};

// List of pending invitations to an organization.
// You can invite new organization members and
// revoke already sent invitations.
export const OrgInvitations = () => {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
    ...OrgMembersParams,
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Invited</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invitations?.data?.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.emailAddress}</td>
              <td>{inv.createdAt.toLocaleDateString()}</td>
              <td>{inv.role}</td>
              <td>
                <button
                  onClick={async () => {
                    await inv.revoke();
                    await Promise.all([
                      memberships?.revalidate,
                      invitations?.revalidate,
                    ]);
                  }}
                >
                  Revoke
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <button
          className="inline-block"
          disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
          onClick={() => invitations?.fetchPrevious?.()}
        >
          Previous
        </button>

        <button
          className="inline-block"
          disabled={!invitations?.hasNextPage || invitations?.isFetching}
          onClick={() => invitations?.fetchNext?.()}
        >
          Next
        </button>
      </div>
    </>
  );
};

export const OrgMembershipRequests = () => {
  const { isLoaded, membershipRequests } = useOrganization(
    OrgMembershipRequestsParams
  );

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Requested Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {membershipRequests?.data?.map((mem) => (
            <tr key={mem.id}>
              <td>{mem.publicUserData.identifier}</td>
              <td>{mem.createdAt.toLocaleDateString()}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <button
          className="inline-block"
          disabled={
            !membershipRequests?.hasPreviousPage ||
            membershipRequests?.isFetching
          }
          onClick={() => membershipRequests?.fetchPrevious?.()}
        >
          Previous
        </button>

        <button
          className="inline-block"
          disabled={
            !membershipRequests?.hasNextPage || membershipRequests?.isFetching
          }
          onClick={() => membershipRequests?.fetchNext?.()}
        >
          Next
        </button>
      </div>
    </>
  );
};

export const OrgInviteMemberForm = () => {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams);
  const [emailAddress, setEmailAddress] = useState('');
  const [disabled, setDisabled] = useState(false);

  if (!isLoaded || !organization) {
    return <>Loading</>;
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const submittedData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as {
      email: string | undefined;
      role: OrganizationCustomRoleKey | undefined;
    };

    if (!submittedData.email || !submittedData.role) {
      return;
    }

    setDisabled(true);
    await organization.inviteMember({
      emailAddress: submittedData.email,
      role: submittedData.role,
    });
    await invitations?.revalidate?.();
    setEmailAddress('');
    setDisabled(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        type="text"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      <label>Role</label>
      <SelectRole fieldName={'role'} />
      <button type="submit" disabled={disabled}>
        Invite
      </button>
    </form>
  );
};

type SelectRoleProps = {
  fieldName?: string;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  defaultRole?: string;
};

const SelectRole = (props: SelectRoleProps) => {
  const { fieldName, isDisabled = false, onChange, defaultRole } = props;
  const { organization } = useOrganization();
  const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true;
        setRoles(
          res.data.map((roles) => roles.key as OrganizationCustomRoleKey)
        );
      });
  }, [organization?.id]);

  if (fetchedRoles.length === 0) return null;

  return (
    <select
      name={fieldName}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onChange={onChange}
      defaultValue={defaultRole}
    >
      {fetchedRoles?.map((roleKey) => (
        <option key={roleKey} value={roleKey}>
          {roleKey}
        </option>
      ))}
    </select>
  );
};
