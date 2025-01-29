import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { validateEnv } from '@/lib/config/env'

// Validate environment variables during development
if (process.env.NODE_ENV === 'development') {
  validateEnv();
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}