'use client';

import { useOrganizationList } from '@clerk/nextjs';

export const CustomOrganizationSwitcher = () => {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <>
      <h2 className="text-lg font-bold">Custom Organization Switcher</h2>
      <ul>
        {userMemberships.data?.map((mem) => (
          <li key={mem.id}>
            <span>{mem.organization.name}</span>
            <button
              onClick={() => setActive({ organization: mem.organization.id })}
            >
              Select
            </button>
          </li>
        ))}
      </ul>

      <button
        disabled={!userMemberships.hasNextPage}
        onClick={() => userMemberships.fetchNext()}
      >
        Load more organizations
      </button>
    </>
  );
};
