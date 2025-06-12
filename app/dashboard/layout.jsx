// In your layout.jsx
'use client';

import { UserDetailProvider } from '../_context/UserDetailContext';

export default function Layout({ children }) {
  return (
    <UserDetailProvider>
      {children}
    </UserDetailProvider>
  );
}