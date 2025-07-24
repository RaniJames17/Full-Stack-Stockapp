export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About StockApp</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive MERN Full-Stack application demonstrating modern web development practices and technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-600 mb-4">
              StockApp is a modern web application built with the MERN stack, showcasing best practices in 
              full-stack development. It features a complete authentication system, responsive design, 
              and production-ready deployment configuration.
            </p>
            <p className="text-gray-600">
              This project demonstrates the integration of various modern technologies to create 
              a seamless user experience with robust security and scalability.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Multi-provider authentication (Email/Password + Google OAuth)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Secure password reset functionality
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Protected routes and session management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Responsive design with modern UI/UX
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Production-ready deployment configuration
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">N</span>
              </div>
              <h3 className="font-semibold text-gray-900">Next.js 15</h3>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">M</span>
              </div>
              <h3 className="font-semibold text-gray-900">MongoDB</h3>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">T</span>
              </div>
              <h3 className="font-semibold text-gray-900">TypeScript</h3>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-cyan-600">T</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-sm text-gray-600">Styling</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready for Production</h2>
          <p className="text-blue-100 mb-6">
            This application is fully configured for deployment on Vercel with all necessary 
            security measures, environment configurations, and optimizations in place.
          </p>
          <div className="flex justify-center gap-4">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm">
              ✓ Production Build
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm">
              ✓ Security Optimized
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm">
              ✓ Deployment Ready
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
