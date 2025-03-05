import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

function TypingTest() {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("default");
  const [isZenMode, setIsZenMode] = useState(false);
  const [testDuration, setTestDuration] = useState(60); // in seconds
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [testStatus, setTestStatus] = useState("waiting"); // 'waiting', 'running', 'finished'

  // Define levels with increasing difficulty
  const levels = {
    1: {
      name: "Beginner",
      wordCount: 10,
      description: "Simple words and short sentences",
    },
    2: {
      name: "Intermediate",
      wordCount: 20,
      description: "Medium length sentences with common words",
    },
    3: {
      name: "Advanced",
      wordCount: 30,
      description: "Longer sentences with varied vocabulary",
    },
    4: {
      name: "Expert",
      wordCount: 40,
      description: "Complex sentences with advanced vocabulary",
    },
    5: {
      name: "Master",
      wordCount: 50,
      description: "Challenging text with technical terms",
    },
  };

  // Add theme options
  const themes = {
    default: {
      bg: "bg-slate-900",
      text: "text-slate-300",
      accent: "text-blue-400",
      cursor: "border-blue-400",
    },
    sepia: {
      bg: "bg-amber-900",
      text: "text-amber-300",
      accent: "text-amber-400",
      cursor: "border-amber-400",
    },
    matrix: {
      bg: "bg-black",
      text: "text-green-400",
      accent: "text-green-500",
      cursor: "border-green-500",
    },
  };

  // Add test duration options
  const durations = [15, 30, 60, 120];

  // Add textarea ref for better focus management
  const textareaRef = useRef(null);

  // Add finger mapping constant
  const fingerMap = {
    "`": "l-pinky",
    1: "l-pinky",
    2: "l-ring",
    3: "l-middle",
    4: "l-index",
    5: "l-index",
    6: "r-index",
    7: "r-index",
    8: "r-middle",
    9: "r-ring",
    0: "r-pinky",
    "-": "r-pinky",
    q: "l-pinky",
    w: "l-ring",
    e: "l-middle",
    r: "l-index",
    t: "l-index",
    y: "r-index",
    u: "r-index",
    i: "r-middle",
    o: "r-ring",
    p: "r-pinky",
    a: "l-pinky",
    s: "l-ring",
    d: "l-middle",
    f: "l-index",
    g: "l-index",
    h: "r-index",
    j: "r-index",
    k: "r-middle",
    l: "r-ring",
    ";": "r-pinky",
    z: "l-pinky",
    x: "l-ring",
    c: "l-middle",
    v: "l-index",
    b: "l-index",
    n: "r-index",
    m: "r-index",
    ",": "r-middle",
    ".": "r-ring",
    "/": "r-pinky",
    " ": "r-thumb",
  };

  // Update finger colors for a more modern look
  const fingerColors = {
    "l-pinky": "from-rose-500/30",
    "l-ring": "from-violet-500/30",
    "l-middle": "from-blue-500/30",
    "l-index": "from-emerald-500/30",
    "r-index": "from-emerald-500/30",
    "r-middle": "from-blue-500/30",
    "r-ring": "from-violet-500/30",
    "r-pinky": "from-rose-500/30",
    "r-thumb": "from-amber-500/30",
  };

  // Add hand visualization constants
  const handVisualization = {
    left: {
      pinky: { x: 0, y: 0, color: "rose" },
      ring: { x: 40, y: -10, color: "violet" },
      middle: { x: 80, y: -20, color: "blue" },
      index: { x: 120, y: -10, color: "emerald" },
    },
    right: {
      index: { x: 160, y: -10, color: "emerald" },
      middle: { x: 200, y: -20, color: "blue" },
      ring: { x: 240, y: -10, color: "violet" },
      pinky: { x: 280, y: 0, color: "rose" },
    },
  };

  useEffect(() => {
    setText(generateText(levels[level].wordCount));

    // Hide navbar when component mounts
    document.body.classList.add("typing-test-mode");

    // Show navbar when component unmounts
    return () => {
      document.body.classList.remove("typing-test-mode");
    };
  }, [level]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    // Calculate WPM based on all typed characters
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const charCount = userInput.length;
    const wordCount = charCount / 5; // Standard: 5 characters = 1 word
    const grossWpm = Math.round(wordCount / timeElapsed);

    // Calculate accuracy
    let correctChars = 0;
    let totalErrors = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      } else {
        totalErrors++;
      }
    }

    const currentAccuracy =
      userInput.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 100;

    // Calculate net WPM considering errors
    const netWpm = Math.max(0, Math.round(grossWpm * (currentAccuracy / 100)));

    setWpm(netWpm);
    setAccuracy(currentAccuracy);
    setErrors(totalErrors);
  }, [startTime, userInput, text]);

  // Update handleInput function to prevent backspace on correct characters
  const handleInput = (e) => {
    const value = e.target.value;

    // Start the timer and test on first input
    if (testStatus === "waiting" && value.length > 0) {
      setTestStatus("running");
      setStartTime(Date.now());
    }

    if (testStatus === "running" && !isFinished) {
      // Check if backspace is pressed on correct characters
      if (e.nativeEvent.inputType === "deleteContentBackward") {
        const lastCharCorrect =
          value.length < userInput.length &&
          userInput[value.length] === text[value.length];
        if (lastCharCorrect) {
          e.preventDefault();
          return;
        }
      }

      setUserInput(value);
      setCurrentIndex(value.length);
      calculateStats();

      // Generate new text when current text is completed but time remains
      if (value.length === text.length && timeLeft > 0) {
        const newText = generateText(levels[level].wordCount);
        setText((prevText) => prevText + " " + newText);
      }

      // Only end the test when time runs out
      if (timeLeft === 0) {
        setTestStatus("finished");
        setIsFinished(true);
      }
    }
  };

  // Update generateText to create longer text
  const generateText = (wordCount) => {
    const commonWords = [
      "the",
      "be",
      "to",
      "of",
      "and",
      "a",
      "in",
      "that",
      "have",
      "I",
      "it",
      "for",
      "not",
      "on",
      "with",
      "he",
      "as",
      "you",
      "do",
      "at",
      "this",
      "but",
      "his",
      "by",
      "from",
      "they",
      "we",
      "say",
      "her",
      "she",
      "or",
      "an",
      "will",
      "my",
      "one",
      "all",
      "would",
      "there",
      "their",
      "what",
      "so",
      "up",
      "out",
      "if",
      "about",
      "who",
      "get",
      "which",
      "go",
      "me",
      "when",
      "make",
      "can",
      "like",
      "time",
      "just",
      "him",
      "know",
      "take",
      "people",
      "into",
      "year",
      "your",
      "good",
      "some",
      "could",
      "them",
      "see",
      "other",
      "than",
    ];

    // Generate more words initially
    let result = [];
    for (let i = 0; i < wordCount * 2; i++) {
      const randomIndex = Math.floor(Math.random() * commonWords.length);
      result.push(commonWords[randomIndex]);
    }

    return result.join(" ");
  };

  // Update useEffect for timer to handle test completion
  useEffect(() => {
    let timerInterval;

    if (testStatus === "running" && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTestStatus("finished");
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [testStatus, timeLeft]);

  // Update resetTest function
  const resetTest = () => {
    const newText = generateText(levels[level].wordCount);
    setText(newText);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    setCurrentIndex(0);
    setTestStatus("waiting");
    setTimeLeft(testDuration);

    // Ensure textarea is focused after reset
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const changeLevel = (newLevel) => {
    if (newLevel >= 1 && newLevel <= Object.keys(levels).length) {
      setLevel(newLevel);
      resetTest();
    }
  };

  // Keyboard layout
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  // Determine the next character to type
  const nextChar = text[currentIndex] ? text[currentIndex].toLowerCase() : null;

  // Add keydown handler for Enter key restart
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for Tab and Enter keys
      if (e.key === "Tab") {
        e.preventDefault();
      }

      // Handle Enter key for reset
      if (
        e.key === "Enter" &&
        (testStatus === "finished" || testStatus === "waiting")
      ) {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [testStatus]);

  // Add formatTime helper function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Add function to get the current character state
  const getCharacterState = (char, index) => {
    if (index >= userInput.length) {
      return index === currentIndex ? "current" : "upcoming";
    }

    return userInput[index] === char ? "correct" : "incorrect";
  };

  // Add useEffect for initial focus
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Add useEffect for maintaining focus
  useEffect(() => {
    const handleClick = () => {
      textareaRef.current?.focus();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full ${themes[theme].bg} flex transition-colors duration-300`}
    >
      {/* Add navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </Link>
            </div>

            {/* Modern Timer Design */}
            <div className="flex items-center gap-3">
              <div
                className={`
                px-4 py-2 rounded-lg 
                ${
                  testStatus === "running" ? "bg-blue-500/20" : "bg-gray-700/30"
                }
                backdrop-blur-sm border border-gray-700/50
                transition-all duration-300
              `}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      testStatus === "running"
                        ? "text-blue-400 animate-pulse"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    className={`
                    font-mono text-xl font-medium
                    ${
                      testStatus === "running"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }
                    transition-colors duration-300
                  `}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Test Status Indicator */}
              <div
                className={`
                px-3 py-1 rounded-full text-sm
                ${
                  testStatus === "waiting"
                    ? "bg-gray-700/30 text-gray-400"
                    : testStatus === "running"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-amber-500/20 text-amber-400"
                }
                transition-all duration-300
              `}
              >
                {testStatus === "waiting"
                  ? "Ready"
                  : testStatus === "running"
                  ? "Testing"
                  : "Complete"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Only show sidebar if not in zen mode */}
      {!isZenMode && (
        <div
          className={`h-full bg-gray-800/50 backdrop-blur-lg shadow-xl z-20 transition-all duration-300 ${
            sidebarOpen ? "w-84" : "w-0"
          }`}
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Typing Test
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                      ${
                        parseInt(lvl) === level
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm
                      ${
                        parseInt(lvl) === level
                          ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {lvl}
                    </span>
                    {levels[lvl].name}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Customization
                </h3>

                {/* Theme selector */}
                <div className="space-y-2 mb-6">
                  {Object.keys(themes).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => setTheme(themeName)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${
                          theme === themeName
                            ? "bg-blue-900/30 text-blue-400"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Test duration selector */}
                <div className="space-y-2 mb-6">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setTestDuration(duration)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${
                          testDuration === duration
                            ? "bg-blue-900/30 text-blue-400"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      {duration} seconds
                    </button>
                  ))}
                </div>

                {/* Zen mode toggle */}
                <button
                  onClick={() => setIsZenMode(!isZenMode)}
                  className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-300 hover:bg-gray-700"
                >
                  {isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content with improved layout */}
      <div className="flex-1 h-full overflow-auto custom-scrollbar pt-20">
        {/* Toggle sidebar button (visible when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Add a floating exit button for zen mode */}
        {isZenMode && (
          <button
            onClick={() => setIsZenMode(false)}
            className="fixed top-4 right-4 z-30 p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-200 text-gray-400 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div
          className={`max-w-4xl mx-auto flex flex-col justify-center min-h-[calc(100vh-5rem)] ${
            isZenMode ? "px-4" : "px-4 md:px-8"
          }`}
        >
          {/* Test status indicator */}
          <div className={`text-center mb-8 ${isZenMode ? "opacity-30" : ""}`}>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                testStatus === "waiting"
                  ? "bg-gray-800/30"
                  : testStatus === "running"
                  ? `${themes[theme].accent} bg-opacity-20`
                  : "bg-green-500/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  testStatus === "waiting"
                    ? "bg-gray-400"
                    : testStatus === "running"
                    ? `${themes[theme].accent}`
                    : "bg-green-500"
                } ${testStatus === "running" ? "animate-pulse" : ""}`}
              ></span>
              <span className="text-sm text-gray-400">
                {testStatus === "waiting"
                  ? "Start typing to begin"
                  : testStatus === "running"
                  ? "Test in progress"
                  : "Test complete"}
              </span>
            </div>
          </div>

          {/* Text display */}
          <div
            className={`mb-12 relative ${
              testStatus === "finished" ? "opacity-50" : ""
            }`}
          >
            <div
              className={`text-center font-mono text-3xl leading-relaxed tracking-wider ${themes[theme].text}`}
            >
              {text.split("").map((char, i) => {
                const state = getCharacterState(char, i);
                return (
                  <span
                    key={i}
                    className={`transition-all duration-200 ${
                      state === "current"
                        ? `${themes[theme].accent} border-b-2 ${themes[theme].cursor} animate-pulse`
                        : state === "correct"
                        ? "text-green-400"
                        : state === "incorrect"
                        ? "text-red-400 bg-red-500/10"
                        : "opacity-50"
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Hidden textarea for typing */}
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInput}
            disabled={isFinished}
            className="opacity-0 absolute h-0 w-0 overflow-hidden"
            autoFocus
          />

          {/* Stats display */}
          <div
            className={`flex justify-center gap-16 mb-12 ${
              isZenMode ? "opacity-30" : ""
            }`}
          >
            <div className="text-center">
              <div className={`text-4xl font-bold ${themes[theme].accent}`}>
                {wpm}
              </div>
              <div className="text-sm text-gray-400 mt-2">WPM</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${themes[theme].accent}`}>
                {accuracy}%
              </div>
              <div className="text-sm text-gray-400 mt-2">accuracy</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${themes[theme].accent}`}>
                {errors}
              </div>
              <div className="text-sm text-gray-400 mt-2">errors</div>
            </div>
          </div>

          {/* Virtual keyboard with modern styling */}
          <div className="keyboard-container space-y-4 max-w-3xl mx-auto">
            {/* Keyboard with integrated finger indicators */}
            <div
              className={`relative ${
                isZenMode ? "opacity-30" : "opacity-90"
              } transition-opacity duration-300`}
            >
              {keyboardRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex justify-center gap-1.5 mb-1.5 ${
                    rowIndex === 1 ? "ml-8" : rowIndex === 2 ? "ml-16" : ""
                  }`}
                >
                  {row.map((key) => {
                    const finger = fingerMap[key.toLowerCase()];
                    const isActive = nextChar === key;
                    return (
                      <div
                        key={key}
                        className={`relative w-12 h-12 flex items-center justify-center rounded-lg text-base font-medium 
                          transition-all duration-300 ease-in-out backdrop-blur-sm
                          ${
                            isActive
                              ? `bg-gradient-to-t ${fingerColors[finger]} to-transparent shadow-lg`
                              : "bg-gray-800/20 hover:bg-gray-700/30"
                          }
                          border border-gray-700/30
                          transform-gpu ${isActive ? "scale-110" : "scale-100"}
                        `}
                      >
                        {/* Key label */}
                        <span
                          className={`transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {key}
                        </span>

                        {/* Finger indicator */}
                        {isActive && (
                          <div
                            className={`absolute -top-3 left-1/2 transform -translate-x-1/2`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-b ${fingerColors[finger]} to-transparent 
                              opacity-50 animate-pulse-subtle`}
                            />
                            <div
                              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                              w-2 h-2 rounded-full ${fingerColors[finger]
                                .replace("from-", "bg-")
                                .replace("/30", "")}`}
                            />
                          </div>
                        )}

                        {/* Ripple effect on key press */}
                        {isActive && (
                          <div
                            className={`absolute inset-0 rounded-lg ${fingerColors[
                              finger
                            ].replace("/30", "/10")}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Spacebar with improved animation */}
              <div className="flex justify-center mt-1.5">
                <div
                  className={`relative w-72 h-12 flex items-center justify-center rounded-lg text-base font-medium
                    transition-all duration-300 ease-in-out backdrop-blur-sm
                    ${
                      nextChar === " "
                        ? `bg-gradient-to-t ${fingerColors["r-thumb"]} to-transparent shadow-lg`
                        : "bg-gray-800/20 hover:bg-gray-700/30"
                    }
                    border border-gray-700/30
                    transform-gpu ${
                      nextChar === " " ? "scale-105" : "scale-100"
                    }
                  `}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      nextChar === " " ? "text-white" : "text-gray-400"
                    }`}
                  >
                    space
                  </span>

                  {/* Thumb indicator for spacebar */}
                  {nextChar === " " && (
                    <div
                      className={`absolute -top-3 left-1/2 transform -translate-x-1/2`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-b ${fingerColors["r-thumb"]} to-transparent 
                        opacity-50 animate-pulse-subtle`}
                      />
                      <div
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-2 h-2 rounded-full bg-amber-500`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test complete overlay with modern design */}
          {testStatus === "finished" && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800/90 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${themes[theme].accent} bg-opacity-20 mb-4`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${themes[theme].accent}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${themes[theme].text}`}>
                    Test Complete!
                  </h2>
                  <p className="text-gray-400 mt-2">Here's how you did</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* WPM Card */}
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div
                      className={`text-4xl font-bold ${themes[theme].accent} mb-1`}
                    >
                      {wpm}
                    </div>
                    <div className="text-sm text-gray-400">WPM</div>
                  </div>

                  {/* Accuracy Card */}
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div
                      className={`text-4xl font-bold ${themes[theme].accent} mb-1`}
                    >
                      {accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>

                  {/* Time Card */}
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div
                      className={`text-4xl font-bold ${themes[theme].accent} mb-1`}
                    >
                      {testDuration}s
                    </div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>

                  {/* Errors Card */}
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div
                      className={`text-4xl font-bold ${themes[theme].accent} mb-1`}
                    >
                      {errors}
                    </div>
                    <div className="text-sm text-gray-400">Errors</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={resetTest}
                    className={`w-full py-3 rounded-xl ${themes[theme].accent} bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 font-medium flex items-center justify-center gap-2`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again
                  </button>

                  <button
                    onClick={() => setIsZenMode(!isZenMode)}
                    className="w-full py-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 text-gray-300 font-medium flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    {isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                  </button>
                </div>

                {/* Keyboard shortcut hint */}
                <div className="text-center mt-6 text-sm text-gray-500">
                  Press{" "}
                  <kbd className="px-2 py-1 bg-gray-700/50 rounded text-gray-400 text-xs">
                    enter
                  </kbd>{" "}
                  to restart
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to your existing styles (CSS) */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(66, 153, 225, 0.3);
        }
        @keyframes pulse-subtle {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.3;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default TypingTest;
