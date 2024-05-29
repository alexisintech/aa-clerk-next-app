'use client';

import { useOrganization, useUser } from '@clerk/nextjs';

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

// List of organization memberships. Administrators can
// change member roles or remove members from the organization.
export const OrganizationMemberships = () => {
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
              <td>{mem.role}</td>
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
