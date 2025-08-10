import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, Brain, Activity, Zap, Award, 
  RotateCcw, Play, Pause, CheckCircle, 
  AlertCircle, TrendingUp, Clock, 
  Keyboard, ArrowRight, ExternalLink,
  BarChart3, Eye
} from 'lucide-react';

interface AdaptiveTestSession {
  sessionId: string;
  testNumber: number;
  testText: string;
  totalTests: number;
  instructions: string;
  completed?: boolean;
  analysisResult?: any;
  finalResults?: any;
  recommendations?: any[];
  message?: string;
}

interface TestResult {
  testNumber: number;
  wpm: number;
  accuracy: number;
  weakestFingers: string[];
  mostMissedBigrams: string[];
  improvementAreas: any[];
}

const AdaptiveTypingTest: React.FC = () => {
  // Core state
  const [session, setSession] = useState<AdaptiveTestSession | null>(null);
  const [currentTest, setCurrentTest] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Test state
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [errors, setErrors] = useState(0);
  
  // Advanced tracking
  const [keyStats, setKeyStats] = useState<Record<string, { correct: number; incorrect: number }>>({});
  const [fingerStats, setFingerStats] = useState<Record<string, { correct: number; incorrect: number }>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  
  // UI state
  const [showResults, setShowResults] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Finger mapping for analysis
  const fingerMap: Record<string, string> = {
    'q': 'LP', 'w': 'LR', 'e': 'LM', 'r': 'LI', 't': 'LI', 'y': 'RI', 'u': 'RI', 'i': 'RM', 'o': 'RR', 'p': 'RP',
    'a': 'LP', 's': 'LR', 'd': 'LM', 'f': 'LI', 'g': 'LI', 'h': 'RI', 'j': 'RI', 'k': 'RM', 'l': 'RR', ';': 'RP',
    'z': 'LP', 'x': 'LR', 'c': 'LM', 'v': 'LI', 'b': 'LI', 'n': 'RI', 'm': 'RI', ',': 'RM', '.': 'RR', '/': 'RP',
    ' ': 'thumb'
  };

  // Start new adaptive test session
  const startAdaptiveTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/adaptive-test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to start adaptive test');
      
      const data = await response.json();
      setSession(data);
      setCurrentTest(1);
      setIsActive(true);
      resetCurrentTest();
      
    } catch (error) {
      console.error('Error starting adaptive test:', error);
      alert('Failed to start adaptive test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit test result and get next test
  const submitTestResult = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const actualTestDuration = startTimeRef.current > 0 ? (Date.now() - startTimeRef.current) / 1000 : 60 - timeLeft;
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      
      const response = await fetch('/api/adaptive-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          testNumber: session.testNumber,
          userInput,
          targetText: session.testText,
          wpm,
          accuracy,
          keyStats,
          fingerStats,
          testDuration: actualTestDuration
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit test result');
      
      const data = await response.json();
      
      if (data.completed) {
        // All tests completed
        setSession({ ...session, ...data });
        setShowResults(true);
        setShowRecommendations(true);
        setIsActive(false);
      } else {
        // Move to next test
        setSession(data);
        setCurrentTest(data.testNumber);
        
        // Add current test to results
        const newResult: TestResult = {
          testNumber: session.testNumber,
          wpm,
          accuracy,
          weakestFingers: data.analysisResult?.testSummary?.weakestFingers || [],
          mostMissedBigrams: data.analysisResult?.testSummary?.mostMissedBigrams || [],
          improvementAreas: data.analysisResult?.testSummary?.improvementAreas || []
        };
        setTestResults(prev => [...prev, newResult]);
        
        resetCurrentTest();
      }
      
    } catch (error) {
      console.error('Error submitting test result:', error);
      alert('Failed to submit test result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset current test state
  const resetCurrentTest = () => {
    setUserInput('');
    setCurrentIndex(0);
    setTimeLeft(60);
    setIsTyping(false);
    setErrors(0);
    setKeyStats({});
    setFingerStats({});
    setTestStartTime(0);
    setShowResults(false);
    startTimeRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (startTimeRef.current === 0) return 0;
    
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    if (timeElapsed <= 0) return 0;
    
    // Count only correct characters for net WPM
    const correctChars = Math.max(0, userInput.length - errors);
    const grossWPM = (userInput.length / 5) / timeElapsed;
    const netWPM = (correctChars / 5) / timeElapsed;
    
    // Return net WPM, but ensure it's not negative
    return Math.max(0, Math.round(netWPM));
  }, [userInput.length, errors]);

  // Calculate accuracy
  const calculateAccuracy = useCallback(() => {
    if (userInput.length === 0) return 100;
    const accuracy = ((userInput.length - errors) / userInput.length) * 100;
    return Math.max(0, Math.min(100, Math.round(accuracy)));
  }, [userInput.length, errors]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentTime = Date.now();

    // Start test on first keystroke
    if (!isTyping && value.length === 1) {
      setIsTyping(true);
      startTimeRef.current = currentTime;
      setTestStartTime(currentTime);
    }

    // Prevent typing beyond text length
    if (value.length > (session?.testText?.length || 0)) return;

    setUserInput(value);
    setCurrentIndex(value.length);

    // Track key and finger stats
    let errorCount = 0;
    const newKeyStats = { ...keyStats };
    const newFingerStats = { ...fingerStats };

    for (let i = 0; i < value.length; i++) {
      const typedChar = value[i];
      const expectedChar = session?.testText[i] || '';
      const expectedFinger = fingerMap[expectedChar.toLowerCase()] || 'Unknown';
      const typedFinger = fingerMap[typedChar.toLowerCase()] || 'Unknown';

      // Initialize stats for expected character and finger
      if (!newKeyStats[expectedChar]) {
        newKeyStats[expectedChar] = { correct: 0, incorrect: 0 };
      }
      if (!newFingerStats[expectedFinger]) {
        newFingerStats[expectedFinger] = { correct: 0, incorrect: 0 };
      }

      if (typedChar === expectedChar) {
        newKeyStats[expectedChar].correct++;
        newFingerStats[expectedFinger].correct++;
      } else {
        newKeyStats[expectedChar].incorrect++;
        newFingerStats[expectedFinger].incorrect++;
        errorCount++;
      }
    }

    setErrors(errorCount);
    setKeyStats(newKeyStats);
    setFingerStats(newFingerStats);

    // Check if test is complete
    if (value.length === session?.testText?.length) {
      endTest();
    }
  };

  // End current test
  const endTest = useCallback(() => {
    setIsTyping(false);
    setShowResults(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isTyping && timeLeft > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping, timeLeft, showResults, endTest]);

  // Render character with color coding
  const renderCharacter = (char: string, index: number) => {
    let className = 'character font-mono ';
    
    if (index < userInput.length) {
      className += userInput[index] === char ? 'text-green-400 bg-green-400/20 ' : 'text-red-400 bg-red-400/20 ';
    } else if (index === currentIndex) {
      className += 'bg-purple-500/50 ';
    } else {
      className += 'text-gray-500 ';
    }

    return (
      <span key={index} className={className}>
        {char === ' ' ? '·' : char}
      </span>
    );
  };

  // Get test icon based on test number
  const getTestIcon = (testNum: number) => {
    switch(testNum) {
      case 1: return <Target className="w-5 h-5" />;
      case 2: return <Brain className="w-5 h-5" />;
      case 3: return <Activity className="w-5 h-5" />;
      case 4: return <Zap className="w-5 h-5" />;
      case 5: return <Award className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  // Get test title based on test number
  const getTestTitle = (testNum: number) => {
    switch(testNum) {
      case 1: return 'Baseline Assessment';
      case 2: return 'Finger Weakness Detection';
      case 3: return 'Bigram Challenge';
      case 4: return 'Flow & Rhythm Test';
      case 5: return 'Comprehensive Challenge';
      default: return 'Typing Test';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Brain className="w-12 h-12 text-purple-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">
            find your layout
          </h1>
              </div>
              <p className="text-purple-200 mt-2">
                Discover your perfect keyboard layout through intelligent analysis
              </p>
            </div>
            <div className="text-right min-w-[160px]">
              {session ? (
                <>
                  <div className="text-2xl font-bold text-purple-300">
                    Test {currentTest} / 5
                  </div>
                  <div className="text-purple-200 text-sm">
                    {getTestTitle(currentTest)}
                  </div>
                </>
              ) : (
                <div className="opacity-0 pointer-events-none">
                  <div className="text-2xl font-bold text-purple-300">
                    Test 0 / 5
                  </div>
                  <div className="text-purple-200 text-sm">
                    Placeholder
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!session ? (
          /* Start Screen */
          <div className="text-center py-16">
            <div className="mb-8">
              <Brain className="w-20 h-20 mx-auto text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Your Perfect Layout Awaits
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Take 5 specialized typing assessments (60 seconds each) that analyze your unique typing patterns.
                The intelligent system identifies your finger weaknesses, problematic key combinations, and typing habits,
                then matches you with the ideal keyboard layout from the comprehensive database.
              </p>
            </div>

            {/* Process Overview */}
            <div className="grid md:grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5].map(testNum => (
                <div key={testNum} className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2 text-purple-400">
                    {getTestIcon(testNum)}
                  </div>
                  <div className="text-sm font-medium text-white">
                    {getTestTitle(testNum)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    60 seconds
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={startAdaptiveTest}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 inline mr-2" />
                  Find My Layout
                </>
              )}
            </button>
          </div>
        ) : showRecommendations ? (
          /* Final Results and Recommendations */
          <div className="space-y-8">
            {/* Completion Banner */}
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg p-6 border border-green-700/50">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-400 mr-4" />
                <div>
                <h2 className="text-2xl font-bold text-white">Your Layout Has Been Found!</h2>
                <p className="text-green-200">Analysis complete. Here are your personalized layout recommendations.</p>
                </div>
              </div>
            </div>

            {/* Test Results Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
                Test Results Summary
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2 text-purple-400">
                      {getTestIcon(result.testNumber)}
                    </div>
                    <div className="text-lg font-bold text-white">{result.wpm} WPM</div>
                    <div className="text-sm text-gray-300">{result.accuracy}% acc</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Test {result.testNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Recommendations */}
            {session.recommendations && session.recommendations.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-400" />
                  Recommended Layouts for You
                </h3>
                <div className="space-y-4">
                  {session.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-purple-600 text-white text-sm font-bold px-2 py-1 rounded mr-3">
                            #{index + 1}
                          </span>
                          <h4 className="text-lg font-semibold text-white">{rec.layout.name}</h4>
                          <div className="ml-auto text-right">
                            <div className="text-lg font-bold text-purple-400">
                              {Math.round(rec.score)}/100
                            </div>
                            <div className="text-xs text-gray-400">Match Score</div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{rec.layout.description}</p>
                        <div className="text-xs text-green-400">{rec.reasoning}</div>
                        
                        {/* Key Metrics */}
                        <div className="flex gap-4 mt-3 text-xs">
                          <span className="text-gray-400">
                            Effort: <span className="text-blue-400">{rec.stats.effort?.toFixed(3)}</span>
                          </span>
                          <span className="text-gray-400">
                            SFB: <span className="text-yellow-400">{rec.stats.same_finger_bigrams_pct?.toFixed(1)}%</span>
                          </span>
                          <span className="text-gray-400">
                            Roll In: <span className="text-green-400">{rec.stats.roll_in_pct?.toFixed(1)}%</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/layouts/${rec.layout.slug}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all inline-flex items-center"
                        >
                          View Details
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Plan */}
            {session.finalResults?.improvementPlan && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                  Personalized Improvement Plan
                </h3>
                <div className="space-y-4">
                  {session.finalResults.improvementPlan.map((plan: any, index: number) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">{plan.focus}</h4>
                      <p className="text-gray-300 text-sm mb-3">{plan.description}</p>
                      <div className="space-y-1">
                        {plan.exercises.map((exercise: string, exIndex: number) => (
                          <div key={exIndex} className="text-xs text-green-400 font-mono bg-gray-800 p-2 rounded">
                            {exercise}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Take Test Again
              </button>
              <Link
                to="/layouts"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all inline-flex items-center"
              >
                Explore All Layouts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Test */
          <div className="space-y-6">
            {/* Test Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getTestIcon(session.testNumber)}
                  <div className="ml-3">
                    <h3 className="text-xl font-semibold text-white">
                      {getTestTitle(session.testNumber)}
                    </h3>
                    <p className="text-gray-300 text-sm">{session.instructions}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{timeLeft}s</div>
                  <div className="text-gray-400 text-sm">remaining</div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                />
              </div>
            </div>

            {/* Test Text */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-xl leading-relaxed font-mono select-none break-words">
                {session.testText.split('').map((char, index) => renderCharacter(char, index))}
              </div>
            </div>

            {/* Live Stats */}
            {isTyping && (
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{calculateWPM()}</div>
                  <div className="text-gray-400">WPM</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className={`text-2xl font-bold ${calculateAccuracy() >= 95 ? 'text-green-400' : calculateAccuracy() >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {calculateAccuracy()}%
                  </div>
                  <div className="text-gray-400">Accuracy</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{userInput.length}</div>
                  <div className="text-gray-400">Characters</div>
                </div>
              </div>
            )}

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none z-[-1]"
              disabled={showResults || loading}
              autoFocus
              style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
            />

            {/* Click to Focus */}
            {!isTyping && !showResults && (
              <div 
                className="text-center py-8 text-gray-400 cursor-pointer"
                onClick={() => inputRef.current?.focus()}
              >
                <p>Click here and start typing</p>
                <p className="text-xs mt-2 text-gray-500">Type the text above as accurately as possible</p>
              </div>
            )}

            {/* Test Complete */}
            {showResults && (
              <div className="text-center bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Test {session.testNumber} Complete!</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{calculateWPM()}</div>
                    <div className="text-gray-400">WPM</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${calculateAccuracy() >= 95 ? 'text-green-400' : calculateAccuracy() >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {calculateAccuracy()}%
                    </div>
                    <div className="text-gray-400">Accuracy</div>
                  </div>
                </div>
                <button
                  onClick={submitTestResult}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : session.testNumber >= 5 ? (
                    'Get My Layout Recommendations'
                  ) : (
                    `Continue to Test ${session.testNumber + 1}`
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveTypingTest;
