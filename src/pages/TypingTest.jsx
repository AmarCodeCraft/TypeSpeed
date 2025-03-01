import { useState, useEffect, useCallback } from 'react';
import { generateText } from '../utils/TextGenerator';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function TypingTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define levels with increasing difficulty
  const levels = {
    1: { name: "Beginner", wordCount: 10, description: "Simple words and short sentences" },
    2: { name: "Intermediate", wordCount: 20, description: "Medium length sentences with common words" },
    3: { name: "Advanced", wordCount: 30, description: "Longer sentences with varied vocabulary" },
    4: { name: "Expert", wordCount: 40, description: "Complex sentences with advanced vocabulary" },
    5: { name: "Master", wordCount: 50, description: "Challenging text with technical terms" }
  };

  useEffect(() => {
    setText(generateText(levels[level].wordCount));
    
    // Hide navbar when component mounts
    document.body.classList.add('typing-test-mode');
    
    // Show navbar when component unmounts
    return () => {
      document.body.classList.remove('typing-test-mode');
    };
  }, [level]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    
    const correctChars = userInput.split('').filter((char, i) => char === text[i]).length;
    const currentAccuracy = Math.round((correctChars / userInput.length) * 100);
    const currentErrors = userInput.length - correctChars;
    
    setWpm(currentWpm || 0);
    setAccuracy(isNaN(currentAccuracy) ? 100 : currentAccuracy);
    setErrors(currentErrors);
  }, [startTime, userInput, text]);

  const handleInput = (e) => {
    const value = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(value);
    setCurrentIndex(value.length);
    calculateStats();

    if (value.length === text.length) {
      setIsFinished(true);
      setShowSuccess(true);
    }
  };

  const resetTest = () => {
    setText(generateText(levels[level].wordCount));
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    setCurrentIndex(0);
    setShowSuccess(false);
  };

  const changeLevel = (newLevel) => {
    if (newLevel >= 1 && newLevel <= Object.keys(levels).length) {
      setLevel(newLevel);
      resetTest();
    }
  };

  // Keyboard layout
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  // Determine the next character to type
  const nextChar = text[currentIndex] ? text[currentIndex].toLowerCase() : null;

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <motion.div 
        className={`h-full bg-white dark:bg-gray-800 shadow-xl z-20 transition-all duration-300 custom-scrollbar ${sidebarOpen ? 'w-84' : 'w-0'}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Typing Test</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Difficulty Levels
            </h3>
            
            <div className="space-y-2">
              {Object.keys(levels).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => changeLevel(parseInt(lvl))}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center
                    ${parseInt(lvl) === level 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm
                    ${parseInt(lvl) === level 
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    {lvl}
                  </span>
                  {levels[lvl].name}
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Current Stats
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">WPM</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wpm}</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{errors}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link 
                to="/" 
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 h-full overflow-auto custom-scrollbar">
        {/* Toggle sidebar button (visible when sidebar is closed) */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* Success message overlay */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 animate-bounce-in">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Great job!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You completed level {level} with {wpm} WPM and {accuracy}% accuracy.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                    {level < Object.keys(levels).length && (
                      <button
                        onClick={() => {
                          setLevel(level + 1);
                          resetTest();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                      >
                        Next Level
                      </button>
                    )}
                    <button
                      onClick={resetTest}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Level description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Level {level}: {levels[level].name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {levels[level].description}
            </p>
          </div>
          
          {/* Text display - modernized */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-50"></div>
            <div className="relative z-10 font-mono text-lg font-semibold leading-relaxed tracking-wide">
              {text.split('').map((char, i) => (
                <span
                  key={i}
                  className={`transition-all duration-200 rounded px-0.5 ${
                    i < userInput.length
                      ? userInput[i] === char
                        ? 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                      : i === currentIndex
                      ? 'bg-blue-100 dark:bg-blue-800/50 text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 animate-pulse'
                      : 'text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Input area */}
          <textarea
            value={userInput}
            onChange={handleInput}
            disabled={isFinished}
            className="w-full p-4 text-lg font-mono border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 mb-6 resize-none custom-scrollbar"
            rows={3}
            autoFocus
            placeholder="Start typing here..."
          />

          {/* Virtual Keyboard */}
          <div className="keyboard-container bg-white dark:bg-gray-800 rounded-xl p-4 select-none shadow-md mb-6">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className={`flex justify-center ${rowIndex === 1 ? 'ml-2 md:ml-4' : rowIndex === 2 ? 'ml-4 md:ml-8' : ''} mb-2`}>
                {row.map((key) => (
                  <div
                    key={key}
                    className={`key w-10 h-10 m-1 flex items-center justify-center rounded-lg font-medium text-sm uppercase transition-all duration-300
                      ${nextChar === key 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg hover:transform hover:scale-105'}`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-center">
              <div className={`key w-64 h-10 m-1 flex items-center justify-center rounded-lg shadow-md text-sm font-medium transition-all duration-300
                ${nextChar === ' ' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:transform hover:scale-105'}`}
              >
                space
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-center">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingTest;