'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';

export const UpdateOrganization = () => {
  const [name, setName] = useState('');
  const router = useRouter();
  const { organization } = useOrganization();

  useEffect(() => {
    if (!organization) {
      return;
    }
    setName(organization.name);
  }, [organization]);

  if (!organization) {
    return null;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await organization?.update({ name });
      router.push(`/organizations/${organization?.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Edit organization</h2>
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <br />
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button>Save</button>
      </form>
    </div>
  );
};
