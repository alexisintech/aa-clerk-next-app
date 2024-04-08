// Renders a list of invitations for the user to join organizations.

'use client'

import { useOrganizationList } from "@clerk/clerk-react";
import React from "react";

const UserInvitationsList = () => {
  const { isLoaded, userInvitations } = useOrganizationList({
    userInvitations: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  if (!isLoaded || userInvitations.isLoading) {
    return <>Loading</>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Org name</th>
          </tr>
        </thead>

        <tbody>
          {userInvitations.data?.map((inv) => (
            <tr key={inv.id}>
              <th>{inv.emailAddress}</th>
              <th>{inv.publicOrganizationData.name}</th>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        disabled={!userInvitations.hasPreviousPage}
        onClick={userInvitations.fetchPrevious}
      >
        Prev
      </button>
      <button
        disabled={!userInvitations.hasNextPage}
        onClick={userInvitations.fetchNext}
      >
        Next
      </button>
    </>
  );
};

export default UserInvitationsList;
