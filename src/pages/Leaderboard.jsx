import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  // Example leaderboard data - replace with actual data later
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, username: "SpeedTyper", wpm: 120, accuracy: 98.5, tests: 42, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, username: "TypeMaster", wpm: 115, accuracy: 97.8, tests: 38, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, username: "SwiftKeys", wpm: 110, accuracy: 96.5, tests: 35, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, username: "KeyboardNinja", wpm: 105, accuracy: 95.2, tests: 30, avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, username: "WordRacer", wpm: 102, accuracy: 94.8, tests: 28, avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, username: "TypingWizard", wpm: 98, accuracy: 93.5, tests: 25, avatar: "https://i.pravatar.cc/150?img=6" },
    { id: 7, username: "FastFingers", wpm: 95, accuracy: 92.7, tests: 22, avatar: "https://i.pravatar.cc/150?img=7" },
    { id: 8, username: "KeyStroker", wpm: 92, accuracy: 91.9, tests: 20, avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 9, username: "WordSmith", wpm: 90, accuracy: 91.2, tests: 18, avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 10, username: "TypeHero", wpm: 88, accuracy: 90.5, tests: 15, avatar: "https://i.pravatar.cc/150?img=10" },
  ]);

  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('wpm');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTimeFilterChange = (filter) => {
    setIsLoading(true);
    setTimeFilter(filter);
    
    // Simulate loading new data
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    
    // Sort the data based on the selected sort type
    const sortedData = [...leaderboardData].sort((a, b) => {
      if (sortType === 'wpm') return b.wpm - a.wpm;
      if (sortType === 'accuracy') return b.accuracy - a.accuracy;
      if (sortType === 'tests') return b.tests - a.tests;
      return 0;
    });
    
    setLeaderboardData(sortedData);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div 
        className="container mx-auto max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Leaderboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            See how you stack up against the fastest typists in our community
          </motion.p>
        </div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 md:mb-0">
              <button 
                onClick={() => handleTimeFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Time
              </button>
              <button 
                onClick={() => handleTimeFilterChange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                This Month
              </button>
              <button 
                onClick={() => handleTimeFilterChange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                This Week
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-600 dark:text-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="wpm">WPM</option>
                <option value="accuracy">Accuracy</option>
                <option value="tests">Tests Completed</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* Top 3 users with special styling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                {leaderboardData.slice(0, 3).map((user, index) => (
                  <motion.div
                    key={user.id}
                    variants={item}
                    className={`relative rounded-xl overflow-hidden shadow-lg p-6 flex flex-col items-center ${
                      index === 0 
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700/30 transform scale-105 z-10' 
                        : index === 1 
                          ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 border border-gray-200 dark:border-gray-700/30' 
                          : 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/30'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 ${
                      index === 0 
                        ? 'bg-yellow-400' 
                        : index === 1 
                          ? 'bg-gray-400' 
                          : 'bg-amber-600'
                    } transform rotate-45 translate-x-8 -translate-y-8`}></div>
                    
                    <div className="relative">
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 
                          ? 'bg-yellow-500' 
                          : index === 1 
                            ? 'bg-gray-500' 
                            : 'bg-amber-700'
                      }`}>
                        {index + 1}
                      </div>
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                      />
                    </div>
                    
                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{user.username}</h3>
                    
                    <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.wpm}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{user.accuracy}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.tests}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tests</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Rest of the leaderboard */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        WPM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tests
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboardData.slice(3).map((entry, index) => (
                      <motion.tr 
                        key={entry.id} 
                        variants={item}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                              {index + 4}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={entry.avatar} 
                              alt={entry.username} 
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {entry.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {entry.wpm}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {entry.accuracy}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {entry.tests}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Want to join the leaderboard?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Complete typing tests to see your name among the fastest typists!
          </p>
          <a 
            href="/test" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            Take a Typing Test
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
