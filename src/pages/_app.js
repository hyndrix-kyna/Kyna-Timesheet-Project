// src/pages/_app.js
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  const isProtectedRoute = router.pathname.startsWith('/app')

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SessionProvider session={session}>
        <div className="flex">
          {isProtectedRoute && <Sidebar />}
          <main className={isProtectedRoute ? 'ml-64 flex-grow p-6' : 'w-full'}>
            {!isProtectedRoute && <Navbar />}
            <Component {...pageProps} />
          </main>
        </div>
      </SessionProvider>
    </ThemeProvider>
  )
}
