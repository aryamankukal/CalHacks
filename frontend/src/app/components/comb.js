'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For animation

// Hardcoded database of papers
const paperDatabase = [
  "Attention Is All You Need",
  "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
  "Deep Residual Learning for Image Recognition",
  "Generative Adversarial Networks",
  "ImageNet Classification with Deep Convolutional Neural Networks",
  "Long Short-Term Memory",
  "Sequence to Sequence Learning with Neural Networks",
  "Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context",
  "YOLO: Real-Time Object Detection",
  "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models"
];

function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showProgressPage, setShowProgressPage] = useState(false);
  const [progress, setProgress] = useState(30);
  const [answer, setAnswer] = useState('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !selectedPaper) {
      alert('Please select a file to upload or choose a paper from the search.');
      return;
    }
    setShowSpinner(true);
    setIsLoading(true);
    setTimeout(() => {
      setShowSpinner(false);
      setShowProgressPage(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && answer.trim() !== '') {
      setAnsweredCorrectly(true);
      setTimeout(() => {
        setAnsweredCorrectly(false);
        setAnswer('');
      }, 1500);
    }
  }, [answer]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredResults = paperDatabase.filter(paper => 
      paper.toLowerCase().includes(term)
    );
    setSearchResults(filteredResults);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    if (paper === "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding") {
      setFile(new File([], "bert.pdf"));
      setFileUrl("/bert.pdf");
    } else if(paper == "Attention Is All You Need") {
      setFile(new File([], "attention.pdf"));
      setFileUrl("/attention.pdf");
    }
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowQuestion(true);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);

  const SpinnerScreen = () => (
    <div className="bg-blue-950 min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );

  const ProgressPage = () => (
    <div className="bg-blue-950 min-h-screen flex flex-col justify-between text-white">
      <header className="text-left p-6">
        <h1 className="text-4xl font-bold text-teal-300">Attention is All You Need</h1>
      </header>
      <div className="flex justify-between items-center p-6">
        <div className="flex justify-center items-center w-1/2">
          <video
            ref={videoRef}
            src="/NeuralNetworkScene@2024-10-20@06-25-43 (1).mov"
            className="w-full"
            autoPlay
            onError={(e) => console.error("Video error:", e)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-blue-950 p-4 w-3/4 ml-8 rounded-lg border ${
                answeredCorrectly ? 'border-green-400 bg-green-600' : 'border-teal-400'
              }`}
              style={{ height: '150px' }}
            >
              <p className="text-base mt-2">
                If Vector1 had a magnitude of 10 and the second vector had a magnitude of 5, what will the resultant vector's magnitude be on the assumption that Vector1 and Vector2 are at a 0-degree angle?
              </p>
              <input
                type="text"
                value={answer}
                placeholder="Type your answer..."
                className="w-full p-2 mt-4 text-white bg-gray-700 rounded-lg border border-teal-300"
                onChange={handleAnswerChange}
                onKeyDown={handleKeyPress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className="p-6 flex justify-center items-center">
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

  const FileUploadPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 p-6">
      <h1 className="text-6xl font-bold text-white mb-12" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        scholora.ai
      </h1>
      <div className="flex justify-center w-full gap-6">
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

        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Search for Papers</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Type to search..."
            className="w-full p-2 mb-4 text-gray-700 bg-gray-200 rounded-lg border border-gray-300"
          />
          <div className="w-full max-h-60 overflow-y-auto">
            {searchResults.map((paper, index) => (
              <div 
                key={index} 
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePaperSelect(paper)}
              >
                {paper}
              </div>
            ))}
          </div>
        </div>
      </div>

      {(file || selectedPaper) && (
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
