import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, Target, Brain, Zap, TrendingUp, 
  Calculator, Clock, Minimize2, ArrowRight,
  Activity, MousePointer, Layers, Eye,
  Cpu, Database, GitBranch, Sparkles,
  Microscope, Lightbulb, Award, BookOpen,
  ChevronDown, ChevronRight, Code, ExternalLink,
  FileText, Users, Globe, Settings, Server,
  RotateCw, Workflow, Network, Boxes,
  TestTube, Binary, Component, Puzzle,
  Play, CheckCircle, Users2, Beaker,
  AlertTriangle
} from 'lucide-react';

const AnalysisMethodology: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'metrics' | 'technical'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Handle URL hash navigation
  useEffect(() => {
    if (location.hash) {
      // If there's a hash in the URL, switch to metrics tab and scroll to element
      setActiveTab('metrics');
      
      // Remove the # from the hash and find the element
      const elementId = location.hash.substring(1);
      
      // Use a timeout to ensure the tab content has rendered
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    } else {
      // If no hash, start with overview tab
      setActiveTab('overview');
    }
  }, [location.hash]);

  const metricCategories = {
    ergonomic: {
      title: 'ergonomic factors',
      color: 'text-green-400',
      icon: <Target className="w-5 h-5" />,
      metrics: [
        {
          name: 'effort',
          title: 'total effort',
          description: 'cumulative typing strain based on key difficulty and finger strength',
          formula: 'Σ(row_difficulty × column_difficulty × character_frequency)',
          insight: 'lower effort reduces fatigue and increases typing endurance',
          goodRange: '< 1.15',
          impact: 'high'
        },
        {
          name: 'pinky_distance',
          title: 'pinky travel distance',
          description: 'proportion of total finger travel performed by weakest fingers',
          formula: 'pinky_movement / total_movement',
          insight: 'minimizing pinky usage prevents rsi and improves comfort',
          goodRange: '< 15%',
          impact: 'high'
        },
        {
          name: 'lateral_stretch_pct',
          title: 'lateral stretches',
          description: 'awkward sideways finger stretches within same hand',
          formula: 'lateral_stretch_bigrams / total_bigrams × 100',
          insight: 'reduces finger strain and prevents uncomfortable movements',
          goodRange: '< 5%',
          impact: 'medium'
        }
      ]
    },
    flow: {
      title: 'flow & rhythm',
      color: 'text-blue-400',
      icon: <Activity className="w-5 h-5" />,
      metrics: [
        {
          name: 'roll_in_pct',
          title: 'inward rolls',
          description: 'smooth finger sequences rolling toward keyboard center',
          formula: 'inward_roll_bigrams / total_bigrams × 100',
          insight: 'natural rolling motions increase typing speed and feel',
          goodRange: '> 15%',
          impact: 'high'
        },
        {
          name: 'trigram_alt_pct',
          title: 'hand alternation',
          description: 'three-letter sequences alternating between hands',
          formula: 'alternating_trigrams / total_trigrams × 100',
          insight: 'hand alternation allows one hand to rest while other types',
          goodRange: '> 60%',
          impact: 'medium'
        },
        {
          name: 'tri_redirect_pct',
          title: 'direction changes',
          description: 'trigrams requiring awkward direction reversals',
          formula: 'redirect_trigrams / total_trigrams × 100',
          insight: 'fewer direction changes create smoother typing flow',
          goodRange: '< 20%',
          impact: 'medium'
        }
      ]
    },
    precision: {
      title: 'precision & accuracy',
      color: 'text-purple-400',
      icon: <MousePointer className="w-5 h-5" />,
      metrics: [
        {
          name: 'same_finger_bigrams_pct',
          title: 'same finger bigrams',
          description: 'letter pairs requiring same finger consecutively',
          formula: 'same_finger_bigrams / total_bigrams × 100',
          insight: 'same finger usage slows typing and increases errors',
          goodRange: '< 2%',
          impact: 'high'
        },
        {
          name: 'pinky_scissors_pct',
          title: 'pinky scissors',
          description: 'awkward pinky-ring finger crossing movements',
          formula: 'scissor_bigrams / total_bigrams × 100',
          insight: 'scissoring motions are unnatural and error-prone',
          goodRange: '< 0.5%',
          impact: 'high'
        },
        {
          name: 'skip_bigrams_pct',
          title: 'skip bigrams',
          description: 'adjacent keys skipped in same row sequence',
          formula: 'skip_bigrams / total_bigrams × 100',
          insight: 'skipping keys can lead to misfires and typos',
          goodRange: '< 3%',
          impact: 'medium'
        }
      ]
    },
    position: {
      title: 'key positioning',
      color: 'text-yellow-400',
      icon: <Layers className="w-5 h-5" />,
      metrics: [
        {
          name: 'col5_6_pct',
          title: 'center column usage',
          description: 'usage of hard-to-reach center columns (t, y keys)',
          formula: 'center_keystrokes / total_keystrokes × 100',
          insight: 'center columns are harder to reach and less accurate',
          goodRange: '< 8%',
          impact: 'medium'
        },
        {
          name: 'pinky_off_home_pct',
          title: 'pinky off-home',
          description: 'pinky keystrokes away from home row position',
          formula: 'pinky_off_home / pinky_keystrokes × 100',
          insight: 'keeping pinkies on home row improves accuracy',
          goodRange: '< 30%',
          impact: 'medium'
        },
        {
          name: 'two_row_jumps_pct',
          title: 'row jumping',
          description: 'bigrams requiring two-row vertical movements',
          formula: 'two_row_jumps / total_bigrams × 100',
          insight: 'large vertical movements slow typing and cause errors',
          goodRange: '< 8%',
          impact: 'medium'
        }
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            methodology
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-6xl mx-auto leading-relaxed">
          comprehensive analysis framework using advanced computational linguistics, 
          biomechanical modeling, and statistical methods to evaluate keyboard layouts 
          for optimal typing performance and ergonomics.
        </p>
      </header>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 flex gap-2 shadow-lg">
          {[
            { id: 'overview', label: 'overview & capabilities', icon: <Eye className="w-4 h-4" /> },
            { id: 'process', label: 'analysis framework', icon: <Cpu className="w-4 h-4" /> },
            { id: 'metrics', label: 'detailed metrics', icon: <Calculator className="w-4 h-4" /> },
            { id: 'technical', label: 'technical reference', icon: <BookOpen className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* What is This? */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold gradient-text leading-tight pb-1">
                  what is keyboard layout analysis?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">understanding the science behind optimal keyboard design</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
              keyboard layout analysis is the scientific evaluation of how efficiently different arrangements 
              of letters and symbols perform during real-world typing. by studying factors like finger movement, 
              hand alternation, and biomechanical strain, we can objectively measure which layouts enable 
              faster, more comfortable, and less error-prone typing.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/50 dark:to-emerald-800/50 rounded-xl border border-green-200 dark:border-green-800">
                <Target className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">ergonomic health</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  reduces repetitive strain injury and typing fatigue through better finger usage
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">speed & flow</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  optimizes finger movement patterns for natural typing rhythm and increased wpm
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/50 dark:to-pink-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">accuracy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  minimizes common error patterns and awkward finger movements
                </p>
              </div>
            </div>
          </div>

          {/* The layoutgod Approach */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Microscope className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold gradient-text">the layoutgod approach</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              this comprehensive analysis engine combines the foundational cyanophage analyzer methodology 
              with advanced proprietary algorithms developed by <strong>rishik dulipyata</strong>. the system employs 
              sophisticated bigram effort matrices, trigram flow analysis, biomechanical modeling, and 
              statistical optimization to evaluate keyboard layouts across <strong>17 key metrics</strong> for optimal typing performance.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl">
                <Calculator className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">17 core metrics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  comprehensive measurement across all aspects of typing performance
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
                <Database className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">real-world data</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  analysis based on actual text corpora and frequency statistics
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
                <Activity className="w-10 h-10 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">biomechanical</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  considers hand anatomy, finger strength, and ergonomic factors
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl">
                <Puzzle className="w-10 h-10 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">advanced</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  sophisticated algorithms with personalized recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold gradient-text mb-8 flex items-center gap-3">
              <Cpu className="w-8 h-8 text-purple-600" />
              analysis process
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">comprehensive text analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    using a diverse english text corpus including literature, technical writing, and 
                    common prose, the analyzer processes character sequences to determine realistic 
                    typing patterns and effort calculations.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">data sources:</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• <a href="https://www.gutenberg.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">project gutenberg</a> - public domain books for text analysis</li>
                      <li>• <a href="https://www.kaggle.com/datasets/datasets/the-english-corpora" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">kaggle english corpora</a> - curated text datasets for students</li>
                      <li>• <a href="https://github.com/dwyl/english-words" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">english words github</a> - word frequency lists and corpora</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">biomechanical modeling</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    each key position is mapped to finger assignments with precise coordinate tracking, 
                    effort multipliers based on finger strength, and distance calculations using 
                    euclidean geometry for realistic movement analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">advanced pattern detection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    sophisticated algorithms detect same-finger bigrams, lateral stretches, scissors, 
                    rolls, and redirects. trigram analysis identifies alternation patterns, flow 
                    sequences, and direction changes for comprehensive rhythm evaluation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">statistical aggregation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    all metrics are frequency-weighted and normalized to percentages or ratios. 
                    results are aggregated across the entire text corpus to provide statistically 
                    significant measurements independent of text selection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Technical Architecture */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              complete technical architecture
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              the layoutgod platform represents a full-stack implementation combining multiple analysis engines, 
              recommendation systems, and real-time adaptive testing. this section details every component
              of the technical architecture.
            </p>
            
            <div className="space-y-8">
              {/* Backend Analysis Engines */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-green-600" />
                  backend analysis engines
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">core layout analyzer (layoutAnalyzer.js)</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <strong>bigram analysis engine:</strong> processes 676 possible letter pairs</li>
                      <li>• <strong>trigram flow detection:</strong> analyzes 17,576 three-letter sequences</li>
                      <li>• <strong>effort calculation matrix:</strong> row/column difficulty multipliers</li>
                      <li>• <strong>distance tracking:</strong> euclidean distance calculations</li>
                      <li>• <strong>pattern recognition:</strong> same finger, scissors, stretches detection</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">enhanced analyzer (newLayoutAnalyzer.js)</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <strong>performance optimized:</strong> 10x faster analysis with caching</li>
                      <li>• <strong>real-time processing:</strong> debounced live layout analysis</li>
                      <li>• <strong>advanced metrics:</strong> 17 comprehensive measurements</li>
                      <li>• <strong>memory efficient:</strong> reduced computational overhead</li>
                      <li>• <strong>api integration:</strong> direct database-free analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              
              {/* Database Architecture */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-yellow-600" />
                  database architecture & data flow
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">core tables & schema</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono">
                      <code className="block mb-1">layouts: id, name, keys, layout_data</code>
                      <code className="block mb-1">layout_stats: effort, distance, sfb_pct, ...</code>
                      <code className="block mb-1">typing_sessions: user_id, test_data, stats</code>
                      <code className="block mb-1">adaptive_tests: session_id, stage, results</code>
                      <code className="block">text_corpora: bigrams, trigrams, frequencies</code>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">data processing pipeline</h4>
                    <ol className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>1. input processing:</strong> layout data validation & normalization</li>
                      <li><strong>2. analysis engine:</strong> comprehensive metric calculation</li>
                      <li><strong>3. statistical processing:</strong> frequency weighting & aggregation</li>
                      <li><strong>4. result caching:</strong> performance optimization with sqlite</li>
                      <li><strong>5. api response:</strong> real-time delivery to frontend</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              {/* Frontend Architecture */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  frontend architecture & real-time features
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3">component architecture</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <strong>react 18:</strong> component-based ui</li>
                      <li>• <strong>typescript:</strong> type-safe development</li>
                      <li>• <strong>react router:</strong> spa navigation</li>
                      <li>• <strong>state management:</strong> context & hooks</li>
                      <li>• <strong>error boundaries:</strong> robust error handling</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">real-time features</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <strong>live analysis:</strong> instant layout feedback</li>
                      <li>• <strong>debounced updates:</strong> optimized performance</li>
                      <li>• <strong>progressive enhancement:</strong> graceful degradation</li>
                      <li>• <strong>responsive design:</strong> mobile-first approach</li>
                      <li>• <strong>dark mode:</strong> system preference detection</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">visualization & ux</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <strong>recharts:</strong> interactive data visualization</li>
                      <li>• <strong>finger mapping:</strong> color-coded key assignments</li>
                      <li>• <strong>accessibility:</strong> wcag 2.1 compliance</li>
                      <li>• <strong>export formats:</strong> json/klc/xkb support</li>
                      <li>• <strong>print styles:</strong> optimized layouts</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* API Endpoints & Integration */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-gray-600" />
                  complete api reference
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">core analysis apis</h4>
                    <div className="space-y-2 text-sm">
                      <code className="block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                        post /api/analyze - layout analysis engine
                      </code>
                      <code className="block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                        get /api/layouts - retrieve all layouts
                      </code>
                      <code className="block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                        post /api/layouts/describe - ai description generation
                      </code>
                      <code className="block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                        get /api/recommendations - personalized suggestions
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">adaptive testing apis</h4>
                    <div className="space-y-2 text-sm">
                      <code className="block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 p-2 rounded">
                        post /api/adaptive-test/start - initialize session
                      </code>
                      <code className="block bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 p-2 rounded">
                        post /api/adaptive-test/submit - submit results
                      </code>
                      <code className="block bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 p-2 rounded">
                        get /api/adaptive-test/results - final analysis
                      </code>
                      <code className="block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                        post /api/text-generator - dynamic text creation
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adaptive Typing Test Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              adaptive typing test framework
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              the adaptive typing test represents a breakthrough in personalized keyboard layout assessment. 
              this sophisticated system employs algorithmic text generation, real-time weakness profiling, 
              and bayesian inference to create the most accurate individual typing assessment available.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5-stage sequential testing</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    each test runs for exactly 60 seconds with progressively adapted content. after each stage, 
                    the system analyzes your performance across 17 metrics, identifying weak fingers, 
                    problematic key combinations, and error patterns.
                  </p>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-indigo-900 dark:text-indigo-200">test progression:</h4>
                    <ul className="text-xs space-y-1 text-indigo-800 dark:text-indigo-300">
                      <li>• Stage 1: Baseline assessment with common English words</li>
                      <li>• Stage 2-4: Adaptive content targeting identified weaknesses</li>
                      <li>• Stage 5: Comprehensive evaluation combining all weak areas</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Weakness Detection</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Advanced algorithms track finger-specific performance, identifying weak fingers based on 
                    accuracy, speed, and consistency. The system also detects problematic words that cause 
                    frequent errors or significant slowdowns.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-green-900 dark:text-green-200">Analysis Factors:</h4>
                    <ul className="text-xs space-y-1 text-green-800 dark:text-green-300">
                      <li>• Finger-specific accuracy rates and error patterns</li>
                      <li>• Word-level difficulty assessment and retry frequency</li>
                      <li>• Typing rhythm consistency and flow disruptions</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Adaptive Text Generation Engine</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    The system employs sophisticated algorithmic text generation using curated finger-specific 
                    word banks, bigram-targeted collections, and flow-optimized sequences. Each test stage 
                    strategically selects content to target your identified weaknesses.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-yellow-900 dark:text-yellow-200">Generation Strategy:</h4>
                    <ul className="text-xs space-y-1 text-yellow-800 dark:text-yellow-300">
                      <li>• Stage 2: Words targeting weakest fingers from finger-specific banks</li>
                      <li>• Stage 3: Bigram-focused content from problematic letter combinations</li>
                      <li>• Stage 4: Flow-testing sequences for hand alternation and rhythm</li>
                      <li>• Stage 5: Comprehensive synthesis combining all weakness areas</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Intelligent Layout Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    After completing all five stages, the system generates personalized keyboard layout 
                    recommendations. Using your unique weakness profile, it suggests layouts that minimize 
                    strain on your weak fingers while optimizing overall typing efficiency.
                  </p>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-purple-900 dark:text-purple-200">Recommendation Engine:</h4>
                    <ul className="text-xs space-y-1 text-purple-800 dark:text-purple-300">
                      <li>• Layout scoring based on individual finger strengths</li>
                      <li>• Weak finger workload minimization</li>
                      <li>• Alternative layout suggestions with detailed justification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Scientific Foundation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                The adaptive testing methodology is inspired by computerized adaptive testing (CAT) used in 
                educational assessment and psychological research. By dynamically adjusting test difficulty 
                based on real-time performance, we achieve more accurate individual assessments in less time 
                than traditional fixed-content tests.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Process Framework Tab */}
      {activeTab === 'process' && (
        <div className="space-y-8">
          {/* Framework Overview */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-3xl p-8 shadow-xl border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight pb-1">
                  Multi-Stage Analysis Framework
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive computational approach to layout evaluation</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-8 text-lg leading-relaxed">
              Our analysis framework combines multiple computational approaches to provide the most comprehensive 
              keyboard layout evaluation available. Each stage builds upon the previous, creating a complete 
              picture of typing performance, ergonomics, and efficiency.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <FileText className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Text Analysis</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  1M+ words processed for frequency analysis
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl border border-green-200 dark:border-green-800">
                <Activity className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Biomechanics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Finger strength and movement modeling
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                <Binary className="w-10 h-10 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Pattern Detection</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Advanced algorithms for movement analysis
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Statistics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Weighted aggregation and normalization
                </p>
              </div>
            </div>
          </div>

          {/* Stage 1: Text Processing */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comprehensive Text Analysis</h2>
                <p className="text-gray-600 dark:text-gray-300">Foundation layer for all subsequent calculations</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  Data Sources & Processing
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Primary Corpus</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• English literature from Project Gutenberg</li>
                      <li>• Technical writing and documentation</li>
                      <li>• News articles and contemporary prose</li>
                      <li>• Over 1 million words processed</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Frequency Analysis</h4>
                    <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                      <li>• Character frequency mapping</li>
                      <li>• Bigram occurrence statistics</li>
                      <li>• Trigram flow pattern analysis</li>
                      <li>• Statistical validation across sources</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-purple-600" />
                  Processing Pipeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Text Normalization</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Convert to lowercase, filter non-alphabetic characters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Sequence Extraction</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Extract all bigrams and trigrams with frequency counting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Statistical Weighting</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Apply frequency weights for realistic usage modeling</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Corpus Validation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cross-validate frequencies across multiple text types</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2: Biomechanical Modeling */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Biomechanical Modeling</h2>
                <p className="text-gray-600 dark:text-gray-300">Precise finger assignment and movement analysis</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Finger Assignment
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Standard Touch Typing</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>LP:</strong> Q, A, Z</div>
                      <div><strong>RP:</strong> P, ;, /</div>
                      <div><strong>LR:</strong> W, S, X</div>
                      <div><strong>RR:</strong> O, L, .</div>
                      <div><strong>LM:</strong> E, D, C</div>
                      <div><strong>RM:</strong> I, K, ,</div>
                      <div><strong>LI:</strong> R, F, V, T, G, B</div>
                      <div><strong>RI:</strong> U, J, M, Y, H, N</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Each key precisely mapped to anatomically correct finger usage
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  Effort Calculation
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Difficulty Multipliers</h4>
                    <div className="text-xs space-y-1">
                      <div><strong>Home Row:</strong> 1.0x (baseline)</div>
                      <div><strong>Top Row:</strong> 1.3x (reach up)</div>
                      <div><strong>Bottom Row:</strong> 1.2x (reach down)</div>
                      <div><strong>Center Cols:</strong> 1.4x (awkward reach)</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Research-based multipliers accounting for finger strength and reach
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Minimize2 className="w-6 h-6 text-purple-600" />
                  Distance Tracking
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Euclidean Distance</h4>
                    <code className="text-xs block mb-2">d = √((x₂-x₁)² + (y₂-y₁)²)</code>
                    <p className="text-xs">Precise coordinate-based movement tracking</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Real finger travel distances between all key combinations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 3: Advanced Pattern Detection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Pattern Detection</h2>
                <p className="text-gray-600 dark:text-gray-300">Sophisticated algorithms for movement and flow analysis</p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Binary className="w-6 h-6 text-yellow-600" />
                  Bigram Analysis Engine
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Same Finger Detection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Identifies letter pairs requiring consecutive use of the same finger - 
                      the most detrimental pattern for typing speed and accuracy.
                    </p>
                    <code className="text-xs bg-red-50 dark:bg-red-900/30 p-2 rounded block">
                      if (finger1 === finger2) {'=>'} sameFingerBigram++
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Skip Pattern Recognition</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Detects awkward movements that skip keys on the same row.
                    </p>
                    <code className="text-xs bg-orange-50 dark:bg-orange-900/30 p-2 rounded block">
                      if (sameRow && |col1 - col2| === 2) {'=>'} skipBigram++
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Lateral Stretch Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Identifies uncomfortable stretching motions within the same hand.
                    </p>
                    <code className="text-xs bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded block">
                      if (sameHand && differentFingers && |col1 - col2| {'>'} 2) {'=>'} stretch++
                    </code>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-blue-600" />
                  Trigram Flow Analysis
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Roll Detection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Natural rolling motions within the same hand that feel smooth and fast.
                    </p>
                    <code className="text-xs bg-green-50 dark:bg-green-900/30 p-2 rounded block">
                      if (sameHand && sameRow && rollingDirection) {'=>'} roll++
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Alternation Patterns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Three-letter sequences that alternate between hands (L-R-L or R-L-R).
                    </p>
                    <code className="text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded block">
                      if (hand1 ≠ hand2 && hand2 ≠ hand3) {'=>'} alternation++
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Redirect Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Awkward direction changes that disrupt typing flow.
                    </p>
                    <code className="text-xs bg-purple-50 dark:bg-purple-900/30 p-2 rounded block">
                      if ((dir1 {'>'} 0 && dir2 {'<'} 0) || (dir1 {'<'} 0 && dir2 {'>'} 0)) {'=>'} redirect++
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 4: Statistical Aggregation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistical Aggregation & Normalization</h2>
                <p className="text-gray-600 dark:text-gray-300">Frequency-weighted calculations and comparative scoring</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  Weighted Aggregation
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Core Formula</h4>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                        <code>metric = Σ(frequency[pattern] × value[pattern]) / Σ(frequency[pattern])</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Why Frequency Weighting?</h4>
                      <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                        <li>• Reflects real-world typing patterns</li>
                        <li>• Prioritizes common letter combinations</li>
                        <li>• Provides statistically valid results</li>
                        <li>• Enables meaningful layout comparisons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Normalization & Scoring
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Percentage Conversion</h4>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Most metrics converted to percentages for intuitive interpretation and comparison across layouts.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Ratio Calculations</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Distance and effort metrics normalized as ratios to enable direct layout comparisons.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Statistical Validation</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Results cross-validated across multiple text corpora for consistency and reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Optimization */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              Performance & Optimization
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-blue-600" />
                  Caching Strategy
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Pre-computed frequency tables</li>
                  <li>• Cached bigram/trigram patterns</li>
                  <li>• Memoized distance calculations</li>
                  <li>• Result storage for reuse</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Real-time Processing
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Debounced live analysis</li>
                  <li>• Progressive calculation updates</li>
                  <li>• Optimized algorithm complexity</li>
                  <li>• Sub-100ms response times</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-600" />
                  Scalability
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Memory-efficient data structures</li>
                  <li>• Parallel processing capabilities</li>
                  <li>• Database-free operation mode</li>
                  <li>• Horizontal scaling support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Deep Dive Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-10 shadow-xl border border-purple-100 dark:border-purple-800/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight pb-1">
                  Complete Metric Definitions
                </h2>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Comprehensive analysis of all <span className="font-semibold text-purple-600 dark:text-purple-400">17 metrics</span> used in keyboard layout evaluation. 
                Each metric includes precise formulas, implementation details, and research-backed target ranges 
                for optimal typing performance.
              </p>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">17</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Core Metrics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">1M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Text Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">30</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Key Positions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics Grid Layout */}
          <div className="grid gap-8">
            {/* Ergonomic & Physical Metrics */}
            <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-3xl p-8 shadow-xl border border-green-100 dark:border-green-800/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight pb-1">
                    Ergonomic & Physical Metrics
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Biomechanical strain, finger load, and movement efficiency</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Effort */}
                <div id="effort" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Total Effort</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Physical typing strain</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                        &lt; 1.15 excellent
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Measures the cumulative physical strain required to type text, accounting for key difficulty, 
                    finger strength differences, and character frequency in natural language.
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl mb-4">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Mathematical Formula
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code className="text-green-700 dark:text-green-300">effort = Σ(rowDifficulty × colDifficulty × frequency) / totalChars</code>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Where row difficulty: Top(1.3x), Home(1.0x), Bottom(1.2x) • Column difficulty: Center(1.4x), Others(1.0x)
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Impact on Typing
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Lower effort scores directly correlate with reduced finger fatigue, longer typing sessions 
                      without strain, and improved ergonomic health over time.
                    </p>
                  </div>
                </div>

                {/* Distance */}
                <div id="distance" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                        <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Finger Travel</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Movement distance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        &lt; 1.6 excellent
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Calculates the average Euclidean distance fingers travel between consecutive keystrokes, 
                    using precise physical key coordinates for accurate movement analysis.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-xl mb-4">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Mathematical Formula
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code className="text-blue-700 dark:text-blue-300">distance = Σ√((x₂-x₁)² + (y₂-y₁)²) / totalTransitions</code>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Euclidean distance calculation using precise key coordinates on standard QWERTY layout
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Impact on Typing
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Shorter travel distances enable faster typing speeds, reduce physical fatigue, 
                      and minimize the risk of repetitive strain injuries.
                    </p>
                  </div>
                </div>

                {/* Pinky Distance */}
                <div id="pinky-distance" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                        <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Pinky Load</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Weakest finger usage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                        &lt; 15% ideal
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Measures the proportion of total finger travel performed by the pinkies (weakest fingers), 
                    critical for preventing RSI and maintaining long-term typing comfort.
                  </p>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-5 rounded-xl mb-4">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Mathematical Formula
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code className="text-red-700 dark:text-red-300">pinky_ratio = pinkyTravelDistance / totalTravelDistance</code>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Includes both left and right pinky movements across all typing sequences
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Ergonomic Importance
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Pinkies are the weakest and least dexterous fingers. Excessive pinky usage 
                      is a primary cause of typing-related repetitive strain injuries.
                    </p>
                  </div>
                </div>

                {/* Pinky Off-Home */}
                <div id="pinky-off-home" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                        <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">Pinky Positioning</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Home row accuracy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        &lt; 30% target
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Percentage of pinky keystrokes that occur away from the home row position, 
                    indicating how often pinkies must leave their optimal resting position.
                  </p>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-5 rounded-xl mb-4">
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Mathematical Formula
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code className="text-yellow-700 dark:text-yellow-300">off_home_pct = (offHomeKeystrokes / totalPinkyKeystrokes) × 100</code>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Home position: A and ; keys for left and right pinkies respectively
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Accuracy Benefits
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Keeping pinkies on home row improves typing accuracy and reduces the cognitive 
                      load of finger positioning, leading to more consistent performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Movement & Precision Metrics */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-3xl p-8 shadow-xl border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-lg">
                <MousePointer className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-1">
                  Movement & Precision Metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Bigram analysis, finger coordination, and accuracy patterns</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Same Finger Bigrams */}
              <div id="same-finger-bigrams" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Same Finger Bigrams</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Consecutive same finger use</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                      &lt; 2% ideal
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Letter pairs requiring the same finger consecutively - the most detrimental pattern for typing speed, 
                  as one finger cannot press two keys simultaneously.
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-red-700 dark:text-red-300">sfb_pct = (sameFingerBigrams / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where finger1 === finger2 for consecutive character pair
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Same finger usage severely slows typing speed and dramatically increases error rates. 
                    Modern optimized layouts achieve &lt;1% SFB rates.
                  </p>
                </div>
              </div>

              {/* Skip Bigrams */}
              <div id="skip-bigrams" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <ArrowRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Skip Bigrams</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Key-skipping movements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                      &lt; 3% target
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Movements that skip one key on the same row, creating awkward finger positioning 
                  and potential for misfires during rapid typing.
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-orange-700 dark:text-orange-300">skip_pct = (skipBigrams / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where pos1[0] === pos2[0] && |pos1[1] - pos2[1]| === 2
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Skip movements feel unnatural and disrupt typing rhythm, leading to 
                    increased likelihood of typos and reduced flow.
                  </p>
                </div>
              </div>

              {/* Lateral Stretch */}
              <div id="lateral-stretch" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                      <Minimize2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">Lateral Stretches</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Uncomfortable hand stretching</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                      &lt; 5% target
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Uncomfortable stretching motions within the same hand that can cause strain 
                  and increase the risk of repetitive stress injuries over time.
                </p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-yellow-700 dark:text-yellow-300">lateral_pct = (lateralStretch / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where sameHand &amp;&amp; differentFingers &amp;&amp; |pos1[1] - pos2[1]| &gt; 2
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Ergonomic Impact
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Excessive lateral stretching can contribute to RSI development and 
                    should be minimized for long-term typing health.
                  </p>
                </div>
              </div>

              {/* Pinky Scissors */}
              <div id="scissors" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-pink-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-xl">
                      <Zap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">Pinky Scissors</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Awkward finger crossing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-pink-600 bg-pink-50 dark:bg-pink-900/30 px-3 py-1 rounded-full">
                      &lt; 0.5% ideal
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Awkward pinky-ring finger crossing movements that feel unnatural and 
                  significantly disrupt typing flow and accuracy.
                </p>
                
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-pink-900 dark:text-pink-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-pink-700 dark:text-pink-300">scissors_pct = (pinkyScissors / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where isPinkyRing && sameHand && crossing motion detected
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Scissoring motions are extremely error-prone and feel awkward, 
                    causing significant slowdowns in typing rhythm.
                  </p>
                </div>
              </div>

              {/* Row Jumps */}
              <div id="two-row-jumps" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">Row Jumps</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Vertical movement disruption</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                      &lt; 8% target
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Bigrams requiring large vertical movements (2+ rows) that disrupt natural 
                  finger positioning and slow down typing rhythm.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-purple-700 dark:text-purple-300">two_row_pct = (twoRowJumps / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where |pos1[0] - pos2[0]| &gt;= 2 (any finger combination)
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Large vertical movements slow typing and increase error rates by 
                    disrupting natural hand positioning and finger muscle memory.
                  </p>
                </div>
              </div>

              {/* Skip Bigrams 2u */}
              <div id="skip-bigrams-2u" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Skip Bigrams 2u</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Extended key skips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                      &lt; 1% critical
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Movements that skip two keys on the same row, creating extreme hand contortion 
                  and significant typing disruption - worse than regular skips.
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-red-700 dark:text-red-300">skip2_pct = (skipBigrams2 / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where pos1[0] === pos2[0] && |pos1[1] - pos2[1]| === 3
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Impact
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Extended skips cause severe hand contortion and should be avoided entirely 
                    in any well-designed keyboard layout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flow & Rhythm Metrics */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg">
                <Activity className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight pb-1">
                  Flow & Rhythm Metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Natural typing patterns, hand alternation, and movement fluidity</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Inward Rolls */}
              <div id="inward-rolls" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Inward Rolls</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Natural flow sequences</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      &gt; 15% ideal
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Natural finger movements rolling toward the keyboard center that create smooth, 
                  fast typing sequences and improve overall flow.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-green-700 dark:text-green-300">roll_in_pct = (rollInBigrams / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where sameHand && sameRow && rolling toward center
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Natural rolling motions increase typing speed and feel effortless. 
                    Higher roll rates correlate with faster, more comfortable typing.
                  </p>
                </div>
              </div>

              {/* Outward Rolls */}
              <div id="outward-rolls" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                      <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Outward Rolls</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Away from center flow</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      5-15% balanced
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Finger movements rolling away from the keyboard center. While less optimal 
                  than inward rolls, moderate levels can still contribute to typing flow.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-blue-700 dark:text-blue-300">roll_out_pct = (rollOutBigrams / totalBigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where sameHand && sameRow && rolling outward from center
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    While not as smooth as inward rolls, balanced outward rolls can 
                    still contribute positively when not excessive.
                  </p>
                </div>
              </div>

              {/* Trigram Alternation */}
              <div id="trigram-alternation" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">Hand Alternation</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">L-R-L or R-L-R patterns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                      &gt; 60% excellent
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Three-letter sequences that alternate between hands, allowing one hand to rest 
                  while the other types, enabling extremely fast speeds.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-purple-700 dark:text-purple-300">tri_alt_pct = (altTrigrams / totalTrigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where hand1 ≠ hand2 && hand2 ≠ hand3 (full alternation)
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Speed Benefits
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Hand alternation enables the fastest possible typing speeds by allowing 
                    continuous motion while each hand rests alternately.
                  </p>
                </div>
              </div>

              {/* Trigram Redirects */}
              <div id="trigram-redirects" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Direction Changes</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Flow disruptions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                      &lt; 20% target
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Three-letter patterns requiring awkward direction changes that disrupt 
                  natural typing flow and rhythm patterns.
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-red-700 dark:text-red-300">redirect_pct = (redirectTrigrams / totalTrigrams) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where (dir1 &gt; 0 &amp;&amp; dir2 &lt; 0) || (dir1 &lt; 0 &amp;&amp; dir2 &gt; 0)
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Flow Impact
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Direction changes interrupt natural movement patterns and 
                    create hesitation in typing rhythm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Position & Usage Metrics */}
          <div className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10 rounded-3xl p-8 shadow-xl border border-yellow-100 dark:border-yellow-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl shadow-lg">
                <Layers className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent leading-tight pb-1">
                  Key Position & Usage Metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Finger positioning, column usage, and complex movement patterns</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Column 5,6 Usage */}
              <div id="column-5-6" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Center Columns</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">T/Y and G/H usage</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                      &lt; 8% target
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Usage percentage of the center columns (columns 5&6) which are harder to reach 
                  and less accurate due to awkward finger positioning.
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-orange-700 dark:text-orange-300">col56_pct = (col56Keystrokes / totalKeystrokes) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where pos[1] === 4 || pos[1] === 5 (0-indexed column positions)
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Impact on Typing
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Center columns are harder to reach and less accurate. Minimizing usage 
                    improves overall layout accessibility and reduces reaching strain.
                  </p>
                </div>
              </div>

              {/* Two Row SFB */}
              <div id="two-row-sfb" className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Two Row SFBs</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Worst case bigrams</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                      &lt; 10% of SFBs
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Same finger bigrams that also require 2+ row jumps - combining the worst aspects 
                  of same finger usage with large vertical movements.
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-5 rounded-xl mb-4">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Mathematical Formula
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <code className="text-red-700 dark:text-red-300">two_row_sfb_pct = (twoRowSfb / totalSfb) × 100</code>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Where finger1 === finger2 &amp;&amp; |pos1[0] - pos2[0]| &gt;= 2
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Impact
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Combines the worst aspects of same finger bigrams and row jumping. 
                    Extremely detrimental to both speed and comfort - should be minimized.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
      
      {/* Technical Reference Tab */}
      {activeTab === 'technical' && (
        <div className="space-y-8">
          {/* Technical Overview */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/10 rounded-3xl p-8 shadow-xl border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-1">
                  Complete Technical Reference
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive system architecture and implementation details</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-8 text-lg leading-relaxed">
              This section provides complete technical documentation for developers, researchers, and advanced users. 
              Covering everything from algorithmic implementation details to API specifications and deployment architecture.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <Code className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Source Code</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Open source implementation details
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl border border-green-200 dark:border-green-800">
                <Server className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Architecture</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Full-stack system design patterns
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                <Network className="w-10 h-10 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">APIs</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  RESTful endpoints and data schemas
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <Settings className="w-10 h-10 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">Configuration</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Setup and deployment guidelines
                </p>
              </div>
            </div>
          </div>

          {/* System Architecture */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Boxes className="w-8 h-8 text-blue-600" />
              System Architecture Overview
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Component className="w-6 h-6 text-blue-600" />
                  Frontend Architecture
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">React + TypeScript Stack</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• <strong>React 18:</strong> Component-based UI with concurrent features</li>
                      <li>• <strong>TypeScript:</strong> Type-safe development with strict mode</li>
                      <li>• <strong>Tailwind CSS:</strong> Utility-first styling with dark mode</li>
                      <li>• <strong>Vite:</strong> Fast development server and build tool</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">State Management</h4>
                    <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                      <li>• <strong>React Context:</strong> Global state for layout data</li>
                      <li>• <strong>Local State:</strong> Component-level UI state</li>
                      <li>• <strong>Custom Hooks:</strong> Reusable state logic</li>
                      <li>• <strong>Error Boundaries:</strong> Graceful error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Server className="w-6 h-6 text-green-600" />
                  Backend Architecture
                </h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Node.js + Express</h4>
                    <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                      <li>• <strong>Express.js:</strong> RESTful API framework</li>
                      <li>• <strong>SQLite:</strong> Lightweight database for caching</li>
                      <li>• <strong>CORS:</strong> Cross-origin resource sharing</li>
                      <li>• <strong>Compression:</strong> Gzip response compression</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Analysis Engines</h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                      <li>• <strong>Core Analyzer:</strong> Original cyanophage-based engine</li>
                      <li>• <strong>Enhanced Analyzer:</strong> Performance-optimized version</li>
                      <li>• <strong>AI Descriptor:</strong> Layout description generator</li>
                      <li>• <strong>Recommendation Engine:</strong> Personalized suggestions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Algorithms */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Binary className="w-8 h-8 text-purple-600" />
              Core Algorithm Implementation
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-purple-600" />
                  Layout Analysis Engine
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Bigram Processing</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                      <code className="block">function analyzeBigrams(text, layout) {'{'}</code>
                      <code className="block mb-1">  const bigrams = extractBigrams(text);</code>
                      <code className="block mb-1">  let metrics = initializeMetrics();</code>
                      <code className="block mb-1">  </code>
                      <code className="block mb-1">  for (const [bigram, freq] of bigrams) {'{'}</code>
                      <code className="block mb-1">    const analysis = analyzeBigram(bigram, layout);</code>
                      <code className="block mb-1">    updateMetrics(metrics, analysis, freq);</code>
                      <code className="block mb-1">  {'}'}</code>
                      <code className="block">  return normalizeMetrics(metrics);</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Distance Calculation</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                      <code className="block mb-1">function calculateDistance(pos1, pos2) {'{'}</code>
                      <code className="block mb-1">  const dx = pos2[0] - pos1[0];</code>
                      <code className="block mb-1">  const dy = pos2[1] - pos1[1];</code>
                      <code className="block mb-1">  return Math.sqrt(dx * dx + dy * dy);</code>
                      <code className="block">{'}'}</code>
                      <code className="block mb-1">  </code>
                      <code className="block mb-1">function getEffort(row, col) {'{'}</code>
                      <code className="block mb-1">  return ROW_DIFFICULTY[row] * COL_DIFFICULTY[col];</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-green-600" />
                  Pattern Recognition
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Same Finger Detection</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block mb-1">if (finger1 === finger2) {'{'}</code>
                      <code className="block mb-1">  sameFingerCount++;</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Roll Detection</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block mb-1">const isRoll = sameHand && </code>
                      <code className="block mb-1">  sameRow && isRollingMotion;</code>
                      <code className="block">return isRoll;</code>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Stretch Analysis</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block mb-1">const stretch = sameHand && </code>
                      <code className="block mb-1">  Math.abs(col1 - col2) {'>'} 2;</code>
                      <code className="block">return stretch;</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Network className="w-8 h-8 text-indigo-600" />
              REST API Documentation
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Analysis Endpoints</h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-mono">POST</span>
                      <code className="font-mono text-sm">/api/analyze</code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Analyze a keyboard layout and return comprehensive metrics</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Request Body:</h5>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                          <code className="block">{'{'}</code>
                          <code className="block">  "layout": ["qwerty..."],</code>
                          <code className="block">  "text": "sample text",</code>
                          <code className="block">  "options": {'{...}'}</code>
                          <code className="block">{'}'}</code>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Response:</h5>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                          <code className="block">{'{'}</code>
                          <code className="block">  "effort": 1.23,</code>
                          <code className="block">  "distance": 1.45,</code>
                          <code className="block">  "sfb_pct": 2.1,</code>
                          <code className="block">  "roll_in_pct": 18.5</code>
                          <code className="block">{'}'}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-mono">GET</span>
                      <code className="font-mono text-sm">/api/layouts</code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Retrieve all saved keyboard layouts with their cached analysis results</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block">[{'{'}</code>
                      <code className="block">  "id": 1,</code>
                      <code className="block">  "name": "QWERTY",</code>
                      <code className="block">  "layout": [...],</code>
                      <code className="block">  "analysis": {'{...}'}</code>
                      <code className="block">{'}'}</code>
                      <code className="block">]</code>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded text-xs font-mono">POST</span>
                      <code className="font-mono text-sm">/api/layouts/describe</code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Generate AI-powered description and analysis of a keyboard layout</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block">{'{'}</code>
                      <code className="block">  "description": "This is a...",</code>
                      <code className="block">  "archetype": "balanced",</code>
                      <code className="block">  "strengths": [...],</code>
                      <code className="block">  "weaknesses": [...]</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adaptive Testing Endpoints</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-mono">POST</span>
                      <code className="font-mono text-sm">/api/adaptive-test/start</code>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Initialize new adaptive typing test session</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block">{'{'}</code>
                      <code className="block">  "sessionId": "abc123",</code>
                      <code className="block">  "stage": 1,</code>
                      <code className="block">  "text": "baseline..."</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded text-xs font-mono">POST</span>
                      <code className="font-mono text-sm">/api/adaptive-test/submit</code>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Submit test results and get next stage</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                      <code className="block">{'{'}</code>
                      <code className="block">  "nextStage": 2,</code>
                      <code className="block">  "text": "adaptive...",</code>
                      <code className="block">  "weaknesses": [...]</code>
                      <code className="block">{'}'}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Schema */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Database className="w-8 h-8 text-green-600" />
              Database Schema & Data Models
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Tables</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">layouts</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      <code className="block">CREATE TABLE layouts (</code>
                      <code className="block">  id INTEGER PRIMARY KEY,</code>
                      <code className="block">  name TEXT NOT NULL,</code>
                      <code className="block">  keys TEXT NOT NULL,</code>
                      <code className="block">  layout_data TEXT,</code>
                      <code className="block">  created_at DATETIME DEFAULT CURRENT_TIMESTAMP</code>
                      <code className="block">);</code>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">layout_stats</h4>
                    <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs">
                      <code className="block">CREATE TABLE layout_stats (</code>
                      <code className="block">  layout_id INTEGER,</code>
                      <code className="block">  effort REAL,</code>
                      <code className="block">  distance REAL,</code>
                      <code className="block">  sfb_pct REAL,</code>
                      <code className="block">  roll_in_pct REAL,</code>
                      <code className="block">  FOREIGN KEY(layout_id) REFERENCES layouts(id)</code>
                      <code className="block">);</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adaptive Testing</h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">typing_sessions</h4>
                    <div className="bg-gray-900 text-purple-400 p-3 rounded font-mono text-xs">
                      <code className="block">CREATE TABLE typing_sessions (</code>
                      <code className="block">  id TEXT PRIMARY KEY,</code>
                      <code className="block">  user_id TEXT,</code>
                      <code className="block">  layout_name TEXT,</code>
                      <code className="block">  stage INTEGER,</code>
                      <code className="block">  results TEXT,</code>
                      <code className="block">  created_at DATETIME DEFAULT CURRENT_TIMESTAMP</code>
                      <code className="block">);</code>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">text_corpora</h4>
                    <div className="bg-gray-900 text-yellow-400 p-3 rounded font-mono text-xs">
                      <code className="block">CREATE TABLE text_corpora (</code>
                      <code className="block">  id INTEGER PRIMARY KEY,</code>
                      <code className="block">  name TEXT NOT NULL,</code>
                      <code className="block">  content TEXT NOT NULL,</code>
                      <code className="block">  bigrams TEXT,</code>
                      <code className="block">  trigrams TEXT,</code>
                      <code className="block">  frequencies TEXT</code>
                      <code className="block">);</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Optimization */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-600" />
              Performance Optimization Techniques
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-blue-600" />
                  Caching Strategies
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Frequency Tables</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Pre-computed bigram/trigram frequencies stored in SQLite</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Layout Results</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Analysis results cached with layout hash keys</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Memory Cache</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">In-memory LRU cache for frequent computations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Algorithm Optimization
                </h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Early Termination</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Skip redundant calculations for known patterns</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Vectorized Ops</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Batch process multiple bigrams simultaneously</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Lazy Loading</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Load text corpora only when needed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  Scalability Features
                </h3>
                <div className="space-y-3">
                  <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Worker Threads</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">CPU-intensive analysis in separate threads</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Request Queuing</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Rate limiting and priority queue management</p>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Horizontal Scale</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Stateless design enables load balancing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              Deployment & Configuration
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Development Setup</h3>
                <div className="space-y-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Prerequisites</h4>
                    <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-1">
                      <li>• Node.js 18+ and npm/yarn</li>
                      <li>• Git for version control</li>
                      <li>• SQLite3 (included with Node.js)</li>
                      <li>• Modern web browser for testing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Installation Commands</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      <code className="block mb-1"># Clone repository</code>
                      <code className="block mb-1">git clone https://github.com/user/layoutgod.git</code>
                      <code className="block mb-1">cd layoutgod</code>
                      <code className="block mb-2"></code>
                      <code className="block mb-1"># Install dependencies</code>
                      <code className="block mb-1">npm install</code>
                      <code className="block mb-2"></code>
                      <code className="block mb-1"># Start development servers</code>
                      <code className="block mb-1">npm run dev</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Production Deployment</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Environment Variables</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      <code className="block mb-1">NODE_ENV=production</code>
                      <code className="block mb-1">PORT=3000</code>
                      <code className="block mb-1">DATABASE_URL=./data/layouts.db</code>
                      <code className="block mb-1">CORS_ORIGIN=https://yourdomain.com</code>
                      <code className="block">API_RATE_LIMIT=100</code>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Build Process</h4>
                    <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs">
                      <code className="block mb-1"># Frontend build</code>
                      <code className="block mb-1">cd client && npm run build</code>
                      <code className="block mb-2"></code>
                      <code className="block mb-1"># Backend start</code>
                      <code className="block mb-1">cd server && npm start</code>
                      <code className="block mb-2"></code>
                      <code className="block mb-1"># Or use PM2</code>
                      <code className="block">pm2 start ecosystem.config.js</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Science Tab - Hidden, content integrated into other tabs */}
      {false && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Microscope className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research Foundation</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  Corpus Linguistics
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  My analysis is grounded in computational linguistics, using publicly available text corpora to determine 
                  character and sequence frequencies:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <strong>1M+ words</strong> from English literature and articles</li>
                  <li>• <strong>500K+ words</strong> from programming code repositories</li>
                  <li>• <strong>Statistical validation</strong> across multiple text types</li>
                  <li>• <strong>Dynamic weighting</strong> based on user context</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  Biomechanical Modeling
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  I incorporate established research on hand anatomy and ergonomics:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <strong>Finger strength ratios</strong> based on biomechanical studies</li>
                  <li>• <strong>Range of motion</strong> limitations for each finger</li>
                  <li>• <strong>Fatigue models</strong> for repetitive strain prediction</li>
                  <li>• <strong>Hand posture</strong> considerations for natural positioning</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-purple-600" />
              Mathematical Framework
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frequency-Weighted Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Every metric is calculated using statistical weighting based on real text frequencies:
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <code>metric_score = Σ(frequency[pattern] × difficulty[pattern]) / Σ(frequency[pattern])</code>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Bigram Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    676 possible letter pairs analyzed for movement patterns
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Trigram Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    17,576 three-letter patterns for flow and alternation
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-red-600 dark:text-red-400" />
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Position Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    30-key layout with finger assignments and reach distances
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-6 mt-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Open Source & Research Based</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My analysis methodology is based on the open-source cyanophage analyzer and 
            academic research in ergonomics and biomechanics. All calculations are transparent 
            and can be verified through the source code.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">MIT Licensed</span>
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">Research Validated</span>
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">Community Driven</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMethodology;
