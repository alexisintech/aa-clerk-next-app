'use client';

import { UserButton } from '@clerk/nextjs';

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const CustomPage = () => {
  return (
    <div>
      <h1>Custom Profile Page</h1>
      <p>This is the custom profile page</p>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <UserButton
        userProfileProps={{
          additionalOAuthScopes: {
            google: ['foo', 'bar'],
            github: ['qux'],
          },
        }}
      >
        {/* You can pass the content as a component */}
        <UserButton.UserProfilePage
          label="Custom Page"
          url="custom"
          labelIcon={<DotIcon />}
        >
          <CustomPage />
        </UserButton.UserProfilePage>
      </UserButton>
    </header>
  );
};

export default Header;
