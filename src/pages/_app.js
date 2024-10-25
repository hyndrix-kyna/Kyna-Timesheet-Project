// src/pages/_app.js

import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Define which routes are considered protected
  const isProtectedRoute = router.pathname.startsWith('/app');

  return (
    <SessionProvider session={session}>
      <div className="flex">
        {/* Conditionally render the Sidebar only on protected routes */}
        {isProtectedRoute && <Sidebar />}

        {/* Adjust main content style based on the presence of the sidebar */}
        <main className={isProtectedRoute ? 'ml-64 flex-grow p-6' : 'w-full'}>
          {/* Show Navbar only on unprotected routes */}
          {!isProtectedRoute && <Navbar />}
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
