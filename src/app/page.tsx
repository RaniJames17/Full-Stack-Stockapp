import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">StockApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive MERN Full-Stack application for managing stocks, portfolios, and financial data. 
            Built with Next.js 15, MongoDB, and modern authentication.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16">
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Multi-provider authentication with email/password and Google OAuth integration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Dashboard</h3>
            <p className="text-gray-600">
              Monitor your portfolio and track stock performance with our intuitive dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Tech Stack</h3>
            <p className="text-gray-600">
              Built with Next.js 15, MongoDB, TypeScript, and Tailwind CSS for optimal performance.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Powered by Modern Technologies</h2>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">Next.js 15</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">MongoDB</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">TypeScript</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">Tailwind CSS</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">NextAuth.js</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
