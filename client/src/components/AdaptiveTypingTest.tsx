import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, Brain, Activity, Zap, Award, 
  RotateCcw, Play, CheckCircle, 
  TrendingUp, Keyboard, ArrowRight, ExternalLink,
  BarChart3
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
  const [loading, setLoading] = useState(false);
  
  // Test state
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
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
      case 1: return 'baseline assessment';
      case 2: return 'finger weakness detection';
      case 3: return 'bigram challenge';
      case 4: return 'flow & rhythm test';
      case 5: return 'comprehensive challenge';
      default: return 'typing test';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header - Minimal style matching MonkeyType */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Keyboard className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">typingod</span>
          </Link>
          <div className="text-gray-400 text-sm">•</div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-gray-300">find your layout</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session && (
            <div className="text-sm text-gray-400">
              test <span className="text-purple-400 font-bold">{currentTest}</span> of 5 • {getTestTitle(currentTest)}
            </div>
          )}
          <Link to="/typingod" className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-all text-gray-300">
            ← back to typing test
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {!session ? (
          /* Start Screen */
          <div className="text-center py-12">
            <div className="mb-12">
              <Brain className="w-16 h-16 mx-auto text-purple-400 mb-6" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                discover your perfect layout
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm">
                Complete 5 specialized typing tests (60 seconds each) to analyze your unique typing patterns.
                Our intelligent system identifies your strengths, weaknesses, and habits to match you with the ideal keyboard layout.
              </p>
            </div>

            {/* Process Overview */}
            <div className="grid grid-cols-5 gap-3 mb-12 max-w-3xl mx-auto">
              {[1, 2, 3, 4, 5].map(testNum => (
                <div key={testNum} className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700 hover:border-purple-500/50 transition-all">
                  <div className="flex justify-center mb-2 text-purple-400">
                    {getTestIcon(testNum)}
                  </div>
                  <div className="text-xs font-medium text-gray-300">
                    {getTestTitle(testNum).split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    60s
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={startAdaptiveTest}
              disabled={loading}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 inline mr-2" />
                  start adaptive test
                </>
              )}
            </button>
          </div>
        ) : showRecommendations ? (
          /* Final Results and Recommendations */
          <div className="space-y-8">
            {/* Completion Banner */}
            <div className="bg-green-900/20 rounded-lg p-6 border border-green-700/50">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Analysis Complete!</h2>
                  <p className="text-gray-400 text-sm">Your personalized layout recommendations are ready.</p>
                </div>
              </div>
            </div>

            {/* Test Results Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                Test Results Summary
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-3 text-center border border-gray-700">
                    <div className="flex justify-center mb-2 text-purple-400 opacity-80">
                      {getTestIcon(result.testNumber)}
                    </div>
                    <div className="text-lg font-bold text-purple-400">{result.wpm}</div>
                    <div className="text-xs text-gray-400">wpm</div>
                    <div className="text-sm text-gray-500 mt-1">{result.accuracy}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Recommendations */}
            {session.recommendations && session.recommendations.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-400" />
                  Recommended Layouts
                </h3>
                <div className="space-y-4">
                  {session.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between border border-gray-700 hover:border-purple-500/50 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-purple-600/20 text-purple-400 text-xs font-bold px-2 py-1 rounded mr-3 border border-purple-500/50">
                            #{index + 1}
                          </span>
                          <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{rec.layout.name}</h4>
                          <div className="ml-auto text-right">
                            <div className="text-lg font-bold text-purple-400">
                              {Math.round(rec.score)}%
                            </div>
                            <div className="text-xs text-gray-500">match</div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{rec.layout.description}</p>
                        <div className="text-xs text-green-400/80">{rec.reasoning}</div>
                        
                        {/* Key Metrics */}
                        <div className="flex gap-4 mt-3 text-xs">
                          <span className="text-gray-400">
                            effort: <span className="text-blue-400">{rec.stats.effort?.toFixed(3)}</span>
                          </span>
                          <span className="text-gray-400">
                            sfb: <span className="text-yellow-400">{rec.stats.same_finger_bigrams_pct?.toFixed(1)}%</span>
                          </span>
                          <span className="text-gray-400">
                            roll in: <span className="text-green-400">{rec.stats.roll_in_pct?.toFixed(1)}%</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/layouts/${rec.layout.slug}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all inline-flex items-center"
                        >
                          view details
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
                <h3 className="text-xl font-semibold gradient-text mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                  personalized improvement plan
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
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all text-sm border border-gray-700"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Retake Test
              </button>
              <Link
                to="/layouts"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all inline-flex items-center text-sm"
              >
                Browse All Layouts
                <ArrowRight className="w-4 h-4 ml-2" />
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
                  <div className="text-gray-400">wpm</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className={`text-2xl font-bold ${calculateAccuracy() >= 95 ? 'text-green-400' : calculateAccuracy() >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {calculateAccuracy()}%
                  </div>
                  <div className="text-gray-400">accuracy</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{userInput.length}</div>
                  <div className="text-gray-400">characters</div>
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
                <p>click here and start typing</p>
                <p className="text-xs mt-2 text-gray-500">type the text above as accurately as possible</p>
              </div>
            )}

            {/* Test Complete */}
            {showResults && (
              <div className="text-center bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold gradient-text mb-4">test {session.testNumber} complete!</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{calculateWPM()}</div>
                    <div className="text-gray-400">wpm</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${calculateAccuracy() >= 95 ? 'text-green-400' : calculateAccuracy() >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {calculateAccuracy()}%
                    </div>
                    <div className="text-gray-400">accuracy</div>
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
                      analyzing...
                    </>
                  ) : session.testNumber >= 5 ? (
                    'get my layout recommendations'
                  ) : (
                    `continue to test ${session.testNumber + 1}`
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
