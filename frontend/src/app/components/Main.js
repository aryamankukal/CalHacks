'use client';
import React, { useState } from 'react';

function App() {
  const [progress, setProgress] = useState(30); // Example progress state

  return (
    <div className="bg-blue-900 min-h-screen flex flex-col justify-between text-white">
      {/* Header */}
      <header className="text-left p-6">
        <h1 className="text-4xl font-bold text-teal-300">I am a college student</h1>
        <h2 className="text-2xl font-semibold text-teal-300 mt-2">Teach me about vectors</h2>
      </header>

      {/* Main Content */}
      <div className="flex justify-between items-center p-6">
        {/* Vector Visualization */}
        <div className="flex justify-center items-center w-1/2">
          {/* Placeholder for an SVG or Image */}
          <img src="vectors.svg" alt="Vector Visualization" className="w-1/2" />
        </div>

        {/* Answer Input Box */}
        <div className="bg-gray-800 p-6 w-1/2 ml-8 rounded-lg border border-teal-400">
          <p className="text-base mt-4">
            If Vector1 had a magnitude of 10 and the second vector had a
            magnitude of 5, what will the resultant vector's magnitude be on the
            assumption that Vector1 and Vector2 are at a 0-degree angle?
          </p>
          <input
            type="text"
            placeholder="Type your answer..."
            className="w-full p-3 mt-4 text-white bg-gray-700 rounded-lg border border-teal-300"
          />
        </div>
      </div>

      {/* Footer with Chunked Progress Bar */}
      <footer className="p-6 flex justify-center items-center">
        {/* Chunked Progress Bar */}
        <div className="w-full max-w-4xl flex justify-between">
          {/* Each chunk */}
          {[1, 2, 3, 4, 5].map((chunk, index) => (
            <div
              key={index}
              className={`h-4 w-full bg-teal-400 mx-1 rounded-full transition-all duration-300`}
              style={{
                opacity: progress >= (index + 1) * 20 ? 1 : 0.3,
              }}
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
