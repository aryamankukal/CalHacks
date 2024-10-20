'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // For animation

function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false); // Shows the spinner screen
  const [showProgressPage, setShowProgressPage] = useState(false); // Controls the page view
  const [progress, setProgress] = useState(30); // Example progress state
  const [currentQuestion, setCurrentQuestion] = useState(1); // Tracks the current question
  const [answer, setAnswer] = useState(''); // Tracks the answer entered by the user
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false); // For animation after pressing Enter

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle file upload and transition to the spinner screen and then progress page
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    // Show the spinner screen for 2 seconds
    setShowSpinner(true);
    setIsLoading(true);

    setTimeout(() => {
      setShowSpinner(false); // Hide spinner screen
      setShowProgressPage(true); // Move to progress page
      setIsLoading(false); // Stop the loading spinner
    }, 2000); // 2 seconds delay
  };

  // Handle the Enter key press in the input field
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && answer.trim() !== '') {
      setAnsweredCorrectly(true); // Start animation

      setTimeout(() => {
        setAnsweredCorrectly(false); // Reset animation
        // Move to the next question
        if (currentQuestion === 1) {
          setCurrentQuestion(2); // Show the second question
        } else if (currentQuestion === 2) {
          // Both questions answered, hide the box
          setTimeout(() => setCurrentQuestion(0), 3000); // Wait 3 seconds before removing
        }
        setAnswer(''); // Clear the input field
      }, 1500); // Delay before moving to the next question
    }
  }, [answer, currentQuestion]);

  // Spinner Screen Component
  const SpinnerScreen = () => (
    <div className="bg-blue-950 min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );

  // Progress Page Component
  const ProgressPage = () => (
    <div className="bg-blue-950 min-h-screen flex flex-col justify-between text-white">
      {/* Header */}
      <header className="text-left p-6">
        <h1 className="text-4xl font-bold text-teal-300">Attention is All You Need</h1>
        {/* <h2 className="text-2xl font-semibold text-teal-300 mt-2">Teach me about vectors</h2> */}
      </header>

      {/* Main Content */}
      <div className="flex justify-between items-center p-6">
        {/* Vector Visualization */}
        <div className="flex justify-center items-center w-1/2">
          {/* Placeholder for an SVG or Image */}
          <img src="vectors.svg" alt="Vector Visualization" className="w-1/2" />
        </div>

        {/* Conditional Question Box */}
        {currentQuestion > 0 && (
          <motion.div
            className={`bg-blue-950 p-4 w-3/4 ml-8 rounded-lg border ${
              answeredCorrectly ? 'border-green-400 bg-green-600' : 'border-teal-400'
            }`}
            animate={answeredCorrectly ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1 }}
            style={{ height: '150px' }} // Shorter height for the question box
          >
            {currentQuestion === 1 ? (
              <>
                <p className="text-base mt-2">
                  If Vector1 had a magnitude of 10 and the second vector had a magnitude of 5, what will the resultant vector's magnitude be on the assumption that Vector1 and Vector2 are at a 0-degree angle?
                </p>
                <input
                  type="text"
                  value={answer}
                  placeholder="Type your answer..."
                  className="w-full p-2 mt-4 text-white bg-gray-700 rounded-lg border border-teal-300"
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyPress} // Fix for key down
                />
              </>
            ) : currentQuestion === 2 ? (
              <>
                <p className="text-base mt-2">How are you?</p>
                <input
                  type="text"
                  value={answer}
                  placeholder="Type your answer..."
                  className="w-full p-2 mt-4 text-white bg-blue-950 rounded-lg border border-teal-300"
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyPress} // Fix for key down
                />
              </>
            ) : null}
          </motion.div>
        )}
      </div>

      {/* Footer with Chunked Progress Bar */}
      <footer className="p-6 flex justify-center items-center">
        {/* Chunked Progress Bar */}
        <div className="w-full max-w-4xl flex justify-between">
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

  // File Upload Page
  const FileUploadPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full flex flex-col items-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Upload PDF File</h1>
        <label
          htmlFor="file-upload"
          className="cursor-pointer mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
        >
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg mt-4 w-full shadow-lg flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div>
          ) : (
            'Upload'
          )}
        </button>
      </form>

      {file && (
        <div className="mt-10 bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">File Preview:</h2>
          {fileUrl && (
            <embed
              src={fileUrl}
              type="application/pdf"
              width="100%"
              height="500px"
              className="border border-gray-300 rounded-lg shadow-lg"
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {showSpinner ? (
        <SpinnerScreen />
      ) : showProgressPage ? (
        <ProgressPage />
      ) : (
        <FileUploadPage />
      )}
    </>
  );
}

export default App;
