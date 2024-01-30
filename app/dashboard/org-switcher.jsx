"use client"

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Select from 'react-select';

function createOrganizationOptions(userMemberships) {
  console.log(`User Memberships: ${JSON.stringify(userMemberships)}`);

  return userMemberships.data.map(({ organization }) => ({
    value: organization.id,
    label: organization.name
  }));
}

export default function CustomOrganizationSwitcher() {
  const { setActive, userMemberships, isLoaded } = useOrganizationList();
  const { organization } = useOrganization();

  console.log(userMemberships);

  if (!isLoaded) {
    return null;
  }

  const handleOrgChange = e => {
    setActive({ organization: e.value });
  };

  if (!organization) {
    return null;
  }

  return (
    <>
      <h2 className="text-lg font-bold">Custom Organization Switcher</h2>
      <Select
        options={createOrganizationOptions(userMemberships)}
        onChange={handleOrgChange}
        value={{ value: organization.id, label: organization.name }}
      />
    </>
  );
}