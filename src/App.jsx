import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import TypingTest from './pages/TypingTest';
import Leaderboard from './pages/Leaderboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white transition-all duration-200">
          <Navbar />
          <div className="bg-inherit">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TypingTest />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;