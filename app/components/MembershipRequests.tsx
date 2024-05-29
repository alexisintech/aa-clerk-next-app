'use client';

import { useOrganization } from '@clerk/nextjs';

export const OrgMembershipRequestsParams = {
  membershipRequests: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

// List of organization membership requests.
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
