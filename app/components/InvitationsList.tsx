// Renders a form for inviting a new member to an organization.
// Renders a list of pending invitations for an organization.

"use client"

import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';

function InviteMember() {
  const { organization, isLoaded } = useOrganization();
  const [emailAddress, setEmailAddress] = useState('');
  const [role, setRole] = useState<'org:member' | 'admin'>('org:member');
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!organization || !isLoaded) return null;

    e.preventDefault();
    setDisabled(true);
    try {
    await organization.inviteMember({ emailAddress, role });
    setEmailAddress('');
    setRole('org:member');
    setDisabled(false);
    } catch (error) {
      // Handle error if one if returned
      console.log('Error:', error)
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Email address"
        value={emailAddress}
        onChange={e => setEmailAddress(e.target.value)}
      />
      <label>
        <input
          type="radio"
          checked={role === 'admin'}
          onChange={() => {
            setRole('admin');
          }}
        />{' '}
        Admin
      </label>
      <label>
        <input
          type="radio"
          checked={role === 'org:member'}
          onChange={() => {
            setRole('org:member');
          }}
        />{' '}
        Member
      </label>{' '}
      <button type="submit" disabled={disabled}>
        Invite
      </button>
    </form>
  );
}

export default function InvitationList() {
  const { invitations, isLoaded } = useOrganization({ invitations: {} });

  if (!invitations || !isLoaded) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Invite member</h2>
      <InviteMember />

      <h2 className="text-lg font-bold">Pending invitations</h2>

        {invitations.data && invitations.data.length ? invitations.data?.map(i => (
          <ul>
          <li key={i.id}>
            {i.emailAddress} <button onClick={() => i.revoke()}>Revoke</button>
          </li>
          </ul>
        )) : (
          <p>No pending invitations</p>
        )}
    </div>
  );
}
