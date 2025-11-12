import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Vibe Checker</title>
        <meta name="description" content="The page you're looking for could not be found." />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    </>
  );
}
