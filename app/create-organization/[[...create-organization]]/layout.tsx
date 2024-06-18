import type { PropsWithChildren } from 'react';
import { Protect } from '@clerk/nextjs';

export default function SettingsLayout(props: PropsWithChildren) {
  return (
    <Protect
      condition={(has) =>
        has({ role: 'org:admin' }) || has({ role: 'org:billing_manager' })
      }
      fallback={<h1>Yeet</h1>}
    >
      {props.children}
    </Protect>
  );
}
