'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For animation
import axios from 'axios'; // Import axios for making API calls

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

const Header = () => (
  <header className="text-center p-6">
    <h1 className="text-5xl font-bold text-teal-300 mb-2">Attention is All You Need</h1>
    <h2 className="text-2xl font-semibold text-teal-100">Vaswani et al.</h2>
  </header>
);

const Footer = ({ progress }) => (
  <footer className="p-6 flex justify-center items-center">
    <div className="w-full max-w-4xl flex justify-between">
      {['Prerequisites', 'Knowledge Map', 'Attention', 'FNNs', 'Embeddings'].map((label, index) => (
        <div
          key={index}
          className={`h-8 w-full bg-teal-400 mx-1 rounded-full transition-all duration-300 flex items-center justify-center`}
          style={{
            opacity: progress >= (index + 1) * 20 ? 1 : 0.3,
          }}
        >
          <span className="text-white text-sm font-semibold px-2">{label}</span>
        </div>
      ))}
    </div>
  </footer>
);

function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showProgressPage, setShowProgressPage] = useState(false);
  const [progress, setProgress] = useState(20);
  const [answer, setAnswer] = useState('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState("/NeuralNetworkScene@2024-10-20@06-25-43 (1).mov");
  const [currentQuestion, setCurrentQuestion] = useState("What is the key innovation introduced in the \"Attention is All You Need\" paper that allows the model to process input sequences in parallel?");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [showWaveAnimation, setShowWaveAnimation] = useState(false);
  const videoRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('fileUpload'); // Track current page

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
      setShowProgressPage(false); // Ensure this is set to false
      setCurrentPage('prereqPage'); // Set to PrereqPage after upload
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (progress >= 20 && progress < 40) {
        setCurrentPage('knowledgeMap'); // Move to Knowledge Map page
        setProgress(40);
      } else if (progress >= 40 && progress < 60) {
        setCurrentPage('attention'); // Move to Attention page
        setProgress(60);
      } else if (progress >= 60 && progress < 80) {
        setCurrentPage('fnn'); // Move to FNN page
        setProgress(80);
      } else if (progress >= 80) {
        setCurrentPage('embedding'); // Move to Embedding page
        setProgress(100);
      }
    }
  };

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

  useEffect(() => {
    if (showProgressPage) {
      setTimeout(() => {
        setShowVideo(true);
      }, 5000);
    }
  }, [showProgressPage]);

  const SpinnerScreen = () => (
    <div className="bg-blue-950 min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );

  const LoadingAnimation = () => (
    <div className="flex justify-center items-center w-1/2 h-64">
      {[...Array(10)].map((_, index) => (
        <motion.div
          key={index}
          className="w-1 h-16 bg-teal-300 mx-1"
          animate={{
            height: [64, 16, 64],
            transition: {
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
            },
          }}
        />
      ))}
    </div>
  );

  const PrereqPage = () => (
    <div 
        className="bg-blue-950 min-h-screen flex flex-col justify-between text-white"
        tabIndex={0} // Make the div focusable to capture key events
        onKeyDown={handleKeyPress} // Attach the key press handler
    >
        <header className="text-center p-6">
            <h1 className="text-5xl font-bold text-teal-300 mb-2">Attention is All You Need</h1>
            <h2 className="text-2xl font-semibold text-teal-100">Vaswani et al.</h2>
        </header>
        <div className="flex justify-between items-center p-6">
            {/* Commenting out the video and question sections for now */}
            {/* {showVideo && (
                <div className="flex justify-center items-center w-1/2">
                    <video
                        ref={videoRef}
                        src={currentVideoSrc}
                        className="w-full rounded-lg shadow-xl"
                        autoPlay
                        onEnded={handleVideoEnd}
                        onError={(e) => console.error("Video error:", e)}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
            {!showVideo && <LoadingAnimation />}
            <AnimatePresence>
                {showQuestion && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-blue-950 p-4 w-1/2 ml-8 rounded-lg border ${
                            showWaveAnimation ? 'border-green-400 bg-green-600' : 'border-teal-400'
                        }`}
                    >
                        <p className="text-base mt-2">
                            {currentQuestion}
                        </p>
                        <motion.div
                            animate={showWaveAnimation ? {
                                background: ['linear-gradient(90deg, #4ade80 0%, #4ade80 100%)', 'linear-gradient(90deg, #4ade80 0%, #4ade80 0%)'],
                            } : {}}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <input
                                type="text"
                                value={answer}
                                placeholder="Type your answer..."
                                className="w-full p-2 mt-4 text-white bg-gray-700 rounded-lg border border-teal-300"
                                onChange={handleAnswerChange}
                                onKeyDown={handleKeyPress}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */}
        </div>
        <footer className="p-6 flex justify-center items-center">
            <div className="w-full max-w-4xl flex justify-between">
                {['Prerequisites', 'Knowledge Map', 'Attention', 'FNNs', 'Embeddings'].map((label, index) => (
                    <div
                        key={index}
                        className={`h-8 w-full bg-teal-400 mx-1 rounded-full transition-all duration-300 flex items-center justify-center`}
                        style={{
                            opacity: progress >= (index + 1) * 20 ? 1 : 0.3,
                        }}
                    >
                        <span className="text-white text-sm font-semibold px-2">{label}</span>
                    </div>
                ))}
            </div>
        </footer>
    </div>
  );

  const KnowledgeMap = () => (
    <div className="flex flex-col justify-between min-h-screen bg-blue-950"
    tabIndex={0} // Make the div focusable to capture key events
        onKeyDown={handleKeyPress} // Attach the key press handler
    >
        <header className="text-center p-6">
            <h1 className="text-5xl font-bold text-teal-300 mb-2">Attention is All You Need</h1>
            <h2 className="text-2xl font-semibold text-teal-100">Vaswani et al.</h2>
        </header>
        <div className="flex justify-center items-center flex-grow"> {/* Use flex-grow to center the iframe */}
            <iframe style={{ border: 'none' }} width="800" height="450" src="https://whimsical.com/embed/hNiv6Kf72QGC69RSkgitz"></iframe>
        </div>
        <footer className="p-6 flex justify-center items-center">
            <div className="w-full max-w-4xl flex justify-between">
                {['Prerequisites', 'Knowledge Map', 'Attention', 'FNNs', 'Embeddings'].map((label, index) => (
                    <div
                        key={index}
                        className={`h-8 w-full bg-teal-400 mx-1 rounded-full transition-all duration-300 flex items-center justify-center`}
                        style={{
                            opacity: progress >= (index + 1) * 20 ? 1 : 0.3,
                        }}
                    >
                        <span className="text-white text-sm font-semibold px-2">{label}</span>
                    </div>
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

  const AttentionPage = () => (
    <div className="flex flex-col justify-between min-h-screen bg-blue-950"
    tabIndex={0} // Make the div focusable to capture key events
        onKeyDown={handleKeyPress} // Attach the key press handler
    >
        <Header />
        <div className="flex justify-center items-center flex-grow flex-col">
            <p className="text-white mb-4">This page explains the attention mechanism in neural networks.</p>
            <div className="flex">
                <button onClick={startVoicebot} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4">
                    Start Voicebot
                </button>
            </div>
        </div>
        <Footer progress={progress} />
    </div>
  );

  const FNNPage = () => {
    return ( // Added return statement
      <div className="flex flex-col justify-between min-h-screen bg-blue-950"
      tabIndex={0} // Make the div focusable to capture key events
        onKeyDown={handleKeyPress} // Attach the key press handler
      >
        <Header />
        <div className="flex justify-center items-center flex-grow flex-col">
          <p className="text-white mb-4">This page explains feedforward neural networks.</p>
        </div>
        <Footer progress={progress} />
      </div>
    ); // End of return statement
  };

  const EmbeddingPage = () => {
    return ( // Added return statement
      <div className="flex flex-col justify-between min-h-screen bg-blue-950" 
      tabIndex={0} // Make the div focusable to capture key events
        onKeyDown={handleKeyPress} // Attach the key press handler
      >
        <Header />
        <div className="flex justify-center items-center flex-grow flex-col">
          <p className="text-white mb-4">This page explains embeddings in machine learning.</p>
          <div className="flex">
            <button onClick={stopVoicebot} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
              Stop Voicebot
            </button>
          </div>
        </div>
        <Footer progress={progress} />
      </div>
    ); // End of return statement
  };

  // Function to start the voicebot
  const startVoicebot = async () => {
    try {
        await axios.post('http://localhost:5001/api/start-voicebot'); // Updated to use localhost
    } catch (error) {
        console.error('Error starting voicebot:', error);
    }
};

  // Function to stop the voicebot
  const stopVoicebot = async () => {
    try {
        await axios.post('http://localhost:5001/api/stop-voicebot'); // Updated to use localhost
    } catch (error) {
        console.error('Error stopping voicebot:', error);
    }
};

  // Automatically focus on the PrereqPage when it mounts
  useEffect(() => {
    const prereqPage = document.querySelector('.bg-blue-950');
    if (prereqPage) {
        prereqPage.focus();
    }
  }, []);

  return (
    <>
      {showSpinner ? (
        <SpinnerScreen />
      ) : currentPage === 'prereqPage' ? (
        <PrereqPage />
      ) : currentPage === 'knowledgeMap' ? (
        <KnowledgeMap />
      ) : currentPage === 'attention' ? (
        <AttentionPage/>
      ) : currentPage === 'fnn' ? (
        <FNNPage/>
      ) : currentPage === 'embedding' ? (
        <EmbeddingPage/>
      ) : (
        <FileUploadPage />
      )}
    </>
  );
}

export default App;
