import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { validateEnv } from '@/lib/config/env'
import Head from 'next/head'

// Only validate environment variables server-side
if (typeof window === 'undefined') {
  validateEnv();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}