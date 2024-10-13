import React from 'react'

function Home() {
    const handleAuthorizeClick = async () => {
        // Redirect to backend's authorization URL
        window.location.href = 'http://localhost:4000/api/authorize';
    };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Fitbit OAuth 2.0 Integration</h1>
        <p className="text-gray-600 mb-4">Authorize your Fitbit account to start tracking your activity.</p>
        <button
          onClick={handleAuthorizeClick}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
        >
          Authorize Fitbit
        </button>
      </div>
    </div>
  )
}

export default Home