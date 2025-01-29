import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { validateEnv } from '@/lib/config/env'

// Only validate environment variables server-side
if (typeof window === 'undefined') {
  validateEnv();
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}