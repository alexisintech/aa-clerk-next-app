"use client"

import { useOrganization } from "@clerk/nextjs";
 
export default function MemberList() {
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });
 
  if (!memberships) {
    // loading state
    return null;
  }
 
  return (
    <div>
      <h2 className="text-lg font-bold">Organization members</h2>
      <ul>
        {memberships.data?.map((membership) => (
          <li key={membership.id}>
            {membership.publicUserData.firstName} {membership.publicUserData.lastName} {membership.id} &lt;
            {membership.publicUserData.identifier}&gt; :: {membership.role}
          </li>
        ))}
      </ul>
 
      <button
        disabled={!memberships.hasNextPage}
        onClick={memberships.fetchNext}
        className="italic text-neutral-600"
      >
        Load more
      </button>
    </div>
  );
}