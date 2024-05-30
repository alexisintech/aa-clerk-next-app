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
      <h1>Membership requests</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Date requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {membershipRequests?.data?.map((mem) => (
            <tr key={mem.id}>
              <td>{mem.publicUserData.identifier}</td>
              <td>{mem.createdAt.toLocaleDateString()}</td>
              <td>
                <button
                  onClick={async () => {
                    await mem.accept();
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={async () => {
                    await mem.reject();
                  }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          disabled={
            !membershipRequests?.hasPreviousPage ||
            membershipRequests?.isFetching
          }
          onClick={() => membershipRequests?.fetchPrevious?.()}
        >
          Previous
        </button>

        <button
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
