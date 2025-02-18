import Head from 'next/head';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon</title>
        <meta name="description" content="This page is under development. We will be online soon!" />
      </Head>
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
        <div className="max-w-xl text-center">
          <h1 className="text-5xl font-extrabold text-green-800 mb-6">
            Coming Soon
          </h1>
          <p className="text-lg text-green-700">
            This page is not available. It's under development. We will be completed soon!
          </p>
        </div>
      </div>
    </>
  );
}
