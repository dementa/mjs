import React from 'react';

export default function UnderConstruction ()  {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md scale-80">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Under Construction</h1>
        <p className="text-gray-600 mb-4">
          This page is currently being built. Check back soon for updates!
        </p>
        <a
          href="/"
          className="inline-block bg-rose-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
