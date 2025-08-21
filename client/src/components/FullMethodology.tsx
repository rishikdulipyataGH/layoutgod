import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, Brain, Zap, Calculator, ArrowRight,
  Cpu, Database, Sparkles,
  Microscope, Code,
  Workflow, Network,
  TestTube, Component,
  CheckCircle,
  AlertTriangle, Hash,
  Eye, Target, Lightbulb, Fingerprint, Columns,
  Layers, Activity, RotateCw, Crosshair, Compass,
  Gauge, Server, Settings, Puzzle, GitBranch
} from 'lucide-react';

const FullMethodology: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'metrics' | 'algorithms' | 'implementation'>('overview');
  // Handle URL hash navigation
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      
      // List of metric IDs that belong to the 'metrics' tab
      const metricIds = [
        'effort-detailed', 'distance-detailed', 'pinky-distance-detailed', 'pinky-off-home',
        'roll-in-detailed', 'roll-out-detailed', 'alternation-detailed', 'tri-redirect-detailed',
        'sfb-detailed', 'skip-bigrams-detailed', 'scissors-detailed', 'center-columns-detailed', 'row-jumps-detailed'
      ];
      
      // If the hash corresponds to a metric, switch to the metrics tab
      if (metricIds.includes(elementId)) {
        setActiveTab('metrics');
      }
      
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200); // Increased timeout to allow tab switch
    }
  }, [location.hash]);


  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
            <Microscope className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            methodology
          </h1>
        </div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">work in progress</span>
          </div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-6xl mx-auto leading-relaxed">
          comprehensive documentation of the layoutgod keyboard layout analysis framework, 
          covering algorithms, calculations, metrics, implementation details, and everything else 
          used to evaluate typing performance, ergonomics, and efficiency.
        </p>
      </header>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 flex gap-2 shadow-lg overflow-x-auto">
          {[
            { id: 'overview', label: 'system overview', icon: <Eye className="w-4 h-4" /> },
            { id: 'analysis', label: 'analysis framework', icon: <Cpu className="w-4 h-4" /> },
            { id: 'metrics', label: 'complete metrics', icon: <Calculator className="w-4 h-4" /> },
            { id: 'algorithms', label: 'algorithms & formulas', icon: <Hash className="w-4 h-4" /> },
            { id: 'implementation', label: 'technical implementation', icon: <Code className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
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
          {/* System Architecture Overview */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/10 rounded-3xl p-8 shadow-xl border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-1">
                  complete system architecture
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">comprehensive framework for keyboard layout evaluation</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-8 text-lg leading-relaxed">
              the layoutgod analysis framework represents the most comprehensive keyboard layout evaluation system 
              available, combining advanced computational linguistics, biomechanical modeling, statistical analysis, 
              and machine learning techniques to provide objective, scientific assessment of typing performance across 
              <strong className="text-indigo-600 dark:text-indigo-400"> 17 core metrics</strong> spanning ergonomics, 
              efficiency, accuracy, and flow optimization.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-800/30">
                <Database className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">data processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  1m+ word corpus analysis with frequency weighting and statistical validation
                </p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-purple-100 dark:border-purple-800/30">
                <Brain className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">biomechanical</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  precise finger modeling with strength, coordination, and ergonomic factors
                </p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-pink-100 dark:border-pink-800/30">
                <Zap className="w-12 h-12 mx-auto mb-4 text-pink-600 dark:text-pink-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">advanced algorithms</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  sophisticated pattern detection, flow analysis, and optimization algorithms
                </p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-green-100 dark:border-green-800/30">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">adaptive testing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  5-stage personalized assessment with real-time weakness detection
                </p>
              </div>
            </div>
          </div>

          {/* Core Analysis Components */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Component className="w-8 h-8 text-blue-600" />
              core analysis components
            </h2>
            
            <div className="space-y-6">
              {/* Advanced Analyzer Engine */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">advanced analyzer engine (advancedanalyzer.js)</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  the primary analysis engine implementing cyanophage's sophisticated methodology with enhanced algorithms 
                  for bigram effort calculation, trigram flow analysis, and comprehensive pattern recognition.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">key features</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• bigram effort matrix with precise transition costs</li>
                      <li>• comprehensive trigram analysis (rolls, alternation, redirects)</li>
                      <li>• multiple penalty systems (sfb, scissors, stretches)</li>
                      <li>• finger position tracking with euclidean distance</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">data processing</h4>
                    <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                      <li>• character frequency mapping from real text corpora</li>
                      <li>• weighted aggregation for realistic usage modeling</li>
                      <li>• statistical normalization and percentage conversion</li>
                      <li>• cross-corpus validation for consistency</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">output metrics</h4>
                    <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                      <li>• 17 comprehensive metrics covering all aspects</li>
                      <li>• detailed breakdown with raw statistics</li>
                      <li>• finger usage analysis and heat mapping</li>
                      <li>• row/column utilization patterns</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Layout Description Generator */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">layout description generator</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  intelligent recommendation system that analyzes layout performance and generates actionable 
                  improvement suggestions based on metric thresholds and comparative analysis against known archetypes.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-5 rounded-xl">
                  <h4 className="font-bold text-green-900 dark:text-green-200 mb-3">recommendation categories</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">high priority:</p>
                      <ul className="space-y-1 text-green-800 dark:text-green-300">
                        <li>• same finger bigram optimization</li>
                        <li>• effort reduction strategies</li>
                        <li>• lateral stretch minimization</li>
                        <li>• ergonomic improvements</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">medium priority:</p>
                      <ul className="space-y-1 text-blue-800 dark:text-blue-300">
                        <li>• finger flow enhancement</li>
                        <li>• hand balance optimization</li>
                        <li>• pinky usage reduction</li>
                        <li>• distance minimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adaptive Test Analyzer */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">adaptive test analyzer</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  revolutionary 5-stage adaptive typing test framework that identifies individual weaknesses and 
                  generates personalized text content to target specific problem areas for maximum improvement efficiency.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-xl">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3">adaptive methodology</h4>
                  <div className="space-y-3 text-sm text-purple-800 dark:text-purple-300">
                    <p><strong>stage 1:</strong> baseline assessment with common english words</p>
                    <p><strong>stage 2:</strong> finger-targeted content focusing on identified weak fingers</p>
                    <p><strong>stage 3:</strong> bigram-focused sequences targeting problematic letter pairs</p>
                    <p><strong>stage 4:</strong> flow optimization with challenging hand alternation patterns</p>
                    <p><strong>stage 5:</strong> comprehensive synthesis combining all weakness areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Innovations */}
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              key innovations & advances
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">scientific methodology</h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>frequency-weighted analysis:</strong> all calculations use real-world character and bigram frequencies for accurate modeling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>biomechanical accuracy:</strong> precise finger strength modeling and coordination factors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>statistical validation:</strong> cross-corpus verification ensures consistent, reliable results</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">technical advances</h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>real-time processing:</strong> optimized algorithms enable live analysis with sub-100ms response times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>adaptive intelligence:</strong> machine learning-inspired weakness detection and content generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>comprehensive coverage:</strong> 17 metrics capturing every aspect of typing performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-8">
          {/* Analysis Pipeline */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg">
                <Workflow className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight pb-1">
                  complete analysis pipeline
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">comprehensive 6-stage processing framework</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-12 text-lg leading-relaxed">
              the layoutgod analysis pipeline processes keyboard layouts through six distinct stages, each building upon 
              the previous to create the most comprehensive and accurate typing performance evaluation available. every stage 
              employs advanced algorithms and statistical methods to ensure scientific rigor and practical relevance.
            </p>
            
            <div className="space-y-12">
              {/* Stage 1: Text Corpus Processing */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">text corpus processing & frequency analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      comprehensive analysis of over 1 million words from diverse english text sources including literature, 
                      technical documentation, news articles, and contemporary prose to establish accurate character, 
                      bigram, and trigram frequency distributions that reflect real-world typing patterns.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          data sources
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li>• <strong>project gutenberg:</strong> classic literature and historical texts</li>
                          <li>• <strong>technical corpora:</strong> programming documentation and manuals</li>
                          <li>• <strong>news archives:</strong> contemporary journalism and reporting</li>
                          <li>• <strong>academic papers:</strong> scientific and research publications</li>
                          <li>• <strong>web content:</strong> modern digital communication patterns</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-green-200 dark:border-green-800/30">
                        <h4 className="font-bold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          processing pipeline
                        </h4>
                        <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li>1. <strong>normalization:</strong> convert to lowercase, filter special characters</li>
                          <li>2. <strong>tokenization:</strong> split into characters, bigrams, trigrams</li>
                          <li>3. <strong>frequency counting:</strong> statistical occurrence analysis</li>
                          <li>4. <strong>weighting:</strong> apply frequency-based importance factors</li>
                          <li>5. <strong>validation:</strong> cross-reference across multiple corpora</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2: Layout Mapping */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">layout mapping & character positioning</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      precise mapping of character positions to physical key coordinates with finger assignments, 
                      hand classifications, and biomechanical modeling to create an accurate representation of 
                      the keyboard layout for subsequent analysis stages.
                    </p>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                      <h4 className="font-bold text-green-900 dark:text-green-200 mb-4">coordinate system</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">physical coordinates:</p>
                          <ul className="space-y-1 text-green-800 dark:text-green-300">
                            <li>• precise x,y positions in millimeters</li>
                            <li>• based on standard qwerty dimensions</li>
                            <li>• accounts for key spacing and stagger</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">finger assignments:</p>
                          <ul className="space-y-1 text-green-800 dark:text-green-300">
                            <li>• 1-4: left hand (pinky to index)</li>
                            <li>• 7-10: right hand (index to pinky)</li>
                            <li>• anatomically correct touch typing</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">biomechanical factors:</p>
                          <ul className="space-y-1 text-green-800 dark:text-green-300">
                            <li>• finger strength differentials</li>
                            <li>• coordination limitations</li>
                            <li>• ergonomic comfort zones</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 3: Effort Calculation */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">effort calculation & distance modeling</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      sophisticated biomechanical modeling that calculates the physical effort required for each keystroke 
                      and finger movement, incorporating finger strength, key difficulty, and euclidean distance calculations 
                      to provide accurate typing strain assessment.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                        <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-4">effort calculation formula</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                          <code className="text-orange-700 dark:text-orange-300">
                            effort = Σ(baseeffort[finger][row] × frequency[char] × multipliers)
                          </code>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold mb-2">base effort values:</p>
                            <ul className="space-y-1 text-orange-800 dark:text-orange-300">
                              <li>• <strong>home row:</strong> 1.4-2.6 (optimal baseline)</li>
                              <li>• <strong>top row:</strong> 2.0-3.6 (reach up penalty)</li>
                              <li>• <strong>bottom row:</strong> 2.1-3.7 (reach down penalty)</li>
                              <li>• <strong>center columns:</strong> +40% difficulty modifier</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold mb-2">finger strength factors:</p>
                            <ul className="space-y-1 text-orange-800 dark:text-orange-300">
                              <li>• <strong>index fingers:</strong> strongest (1.0x base)</li>
                              <li>• <strong>middle fingers:</strong> strong (1.2x multiplier)</li>
                              <li>• <strong>ring fingers:</strong> weak (1.5x multiplier)</li>
                              <li>• <strong>pinky fingers:</strong> weakest (2.0x multiplier)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-4">distance calculation</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                          <code className="text-blue-700 dark:text-blue-300">
                            distance = √((x₂-x₁)² + (y₂-y₁)²) × frequency_weight
                          </code>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          euclidean distance calculations between consecutive keystrokes, weighted by character frequency 
                          to provide realistic finger travel assessment for the analyzed text corpus.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 4: Pattern Detection */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">advanced pattern detection & flow analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      comprehensive algorithmic analysis of typing patterns including same finger bigrams, lateral stretches, 
                      scissors, rolls, redirects, and alternation sequences to identify efficiency bottlenecks and 
                      ergonomic concerns that impact typing performance.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border-l-4 border-red-500">
                          <h4 className="font-bold text-red-900 dark:text-red-200 mb-3">problematic patterns</h4>
                          <ul className="space-y-2 text-sm text-red-800 dark:text-red-300">
                            <li>• <strong>same finger bigrams:</strong> consecutive letters on same finger</li>
                            <li>• <strong>skip bigrams:</strong> finger skipping over adjacent keys</li>
                            <li>• <strong>lateral stretches:</strong> uncomfortable sideways finger extensions</li>
                            <li>• <strong>scissors:</strong> adjacent fingers crossing movements</li>
                            <li>• <strong>two-row jumps:</strong> large vertical finger movements</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border-l-4 border-green-500">
                          <h4 className="font-bold text-green-900 dark:text-green-200 mb-3">beneficial patterns</h4>
                          <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                            <li>• <strong>inward rolls:</strong> natural finger sequences toward center</li>
                            <li>• <strong>outward rolls:</strong> smooth finger sequences outward</li>
                            <li>• <strong>hand alternation:</strong> balanced left-right-left patterns</li>
                            <li>• <strong>home row usage:</strong> optimal finger positioning</li>
                            <li>• <strong>bigram rolls:</strong> two-finger rolling motions</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                        <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-4">trigram flow classification algorithm</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
                          <code className="text-purple-700 dark:text-purple-300">
                            if (hand1 !== hand2 && hand2 !== hand3) → alternation<br/>
                            else if (hand1 === hand2 === hand3 && increasing_fingers) → roll_in<br/>
                            else if (hand1 === hand2 === hand3 && decreasing_fingers) → roll_out<br/>
                            else if (direction_change && same_hand) → redirect
                          </code>
                        </div>
                        <p className="text-sm text-purple-800 dark:text-purple-300">
                          comprehensive classification system that analyzes three-letter sequences to identify optimal 
                          and suboptimal typing flow patterns based on hand usage and finger movement directions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 5: Statistical Aggregation */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">statistical aggregation & normalization</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      comprehensive statistical processing that aggregates all measurements across the entire text corpus, 
                      applies frequency weighting for realistic usage modeling, and normalizes results to standardized 
                      metrics for meaningful comparison across different keyboard layouts.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">frequency weighting formula</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                          <code className="text-indigo-700 dark:text-indigo-300">
                            weighted_metric = Σ(pattern_value × frequency[pattern]) / Σ(frequency[pattern])
                          </code>
                        </div>
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                          ensures that common letter combinations and sequences have appropriate influence on final scores, 
                          reflecting real-world typing patterns rather than theoretical equal-weight scenarios.
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">percentage metrics</h4>
                          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                            <li>• same finger bigrams %</li>
                            <li>• lateral stretch %</li>
                            <li>• roll in/out %</li>
                            <li>• hand alternation %</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">ratio calculations</h4>
                          <ul className="text-xs text-green-800 dark:text-green-300 space-y-1">
                            <li>• effort per character</li>
                            <li>• distance per transition</li>
                            <li>• pinky load proportion</li>
                            <li>• center column usage</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">validation checks</h4>
                          <ul className="text-xs text-purple-800 dark:text-purple-300 space-y-1">
                            <li>• cross-corpus consistency</li>
                            <li>• statistical significance</li>
                            <li>• outlier detection</li>
                            <li>• confidence intervals</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 6: Results Processing */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">results processing & recommendation generation</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      final stage that processes all calculated metrics to generate comprehensive layout assessments, 
                      comparative analysis against known archetypes, identification of strengths and weaknesses, 
                      and actionable recommendations for layout optimization.
                    </p>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-4">comprehensive output package</h4>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <p className="font-semibold mb-2 text-emerald-800 dark:text-emerald-300">quantitative results:</p>
                          <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                            <li>• 17 core metrics with precise values</li>
                            <li>• detailed statistical breakdowns</li>
                            <li>• finger usage distribution analysis</li>
                            <li>• row/column utilization patterns</li>
                            <li>• comparative ranking against database</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2 text-teal-800 dark:text-teal-300">qualitative analysis:</p>
                          <ul className="space-y-1 text-teal-700 dark:text-teal-400">
                            <li>• intelligent layout categorization</li>
                            <li>• archetype similarity matching</li>
                            <li>• strength and weakness identification</li>
                            <li>• prioritized improvement recommendations</li>
                            <li>• personalized optimization strategies</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-12">
          {/* Metrics Overview */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-10 shadow-xl border border-purple-100 dark:border-purple-800/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight pb-1">
                  complete metric definitions
                </h2>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
                comprehensive documentation of all <span className="font-semibold text-purple-600 dark:text-purple-400">27 metrics</span> used in keyboard layout evaluation. 
                each metric includes precise mathematical formulas, implementation details, target ranges, and impact analysis.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">27</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">core metrics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">1m+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">words analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">47</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">key positions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ergonomic & Physical Metrics */}
          <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-3xl p-8 shadow-xl border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight pb-1">
                  ergonomic & physical metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">biomechanical strain, finger load, and movement efficiency</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Effort Metric */}
              <div id="effort-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">total effort</h3>
                      <p className="text-gray-600 dark:text-gray-400">physical typing strain measurement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                      target: &lt; 8.5
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  measures the cumulative physical strain required to type text, accounting for key difficulty, 
                  finger strength differences, row penalties, and character frequency in natural language. 
                  this is the most comprehensive measure of typing effort and directly correlates with fatigue and rsi risk.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                      <h4 className="font-bold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        mathematical formula
                      </h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-base mb-4 overflow-x-auto">
                        <code className="text-green-700 dark:text-green-300">
                          effort = Σ(base_effort[finger][row] × frequency[char]) / total_chars
                        </code>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        where base_effort incorporates finger strength, key position difficulty, and biomechanical factors
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">base effort values by position</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="grid grid-cols-2 gap-2">
                          <span>home row (baseline):</span><span className="text-blue-600">1.0x - 2.6x</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span>top row (reach up):</span><span className="text-orange-600">2.0x - 3.6x</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span>bottom row (reach down):</span><span className="text-yellow-600">2.1x - 3.7x</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span>center columns:</span><span className="text-red-600">+40% penalty</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">finger strength multipliers</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>index fingers (strongest):</span>
                          <span className="font-mono text-green-600">1.0x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>middle fingers (strong):</span>
                          <span className="font-mono text-yellow-600">1.2x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ring fingers (weak):</span>
                          <span className="font-mono text-orange-600">1.5x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>pinky fingers (weakest):</span>
                          <span className="font-mono text-red-600">2.0x</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        performance impact
                      </h4>
                      <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                        <li>• effort &lt; 8.5: excellent efficiency, minimal fatigue</li>
                        <li>• effort 8.5-12.0: good, suitable for extended typing</li>
                        <li>• effort 12.0-15.0: fair, manageable for most users</li>
                        <li>• effort &gt; 15.0: high strain, increased rsi risk</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Metric */}
              <div id="distance-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                      <ArrowRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">finger travel distance</h3>
                      <p className="text-gray-600 dark:text-gray-400">total movement per character</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      target: &lt; 18.0 units
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  calculates the average euclidean distance fingers must travel between consecutive keystrokes, 
                  using precise physical key coordinates. shorter distances enable faster typing speeds and 
                  reduce physical fatigue over extended typing sessions.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    euclidean distance formula
                  </h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                    <code className="text-blue-700 dark:text-blue-300">
                      distance = Σ√((x₂-x₁)² + (y₂-y₁)²) × frequency / total_transitions
                    </code>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">coordinate system:</p>
                      <ul className="space-y-1 text-blue-800 dark:text-blue-300">
                        <li>• millimeter precision measurements</li>
                        <li>• standard qwerty key spacing (19.05mm)</li>
                        <li>• accounts for row stagger and key size</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">performance thresholds:</p>
                      <ul className="space-y-1 text-blue-800 dark:text-blue-300">
                        <li>• &lt; 18.0: excellent finger economy</li>
                        <li>• 18.0-25.0: good, manageable travel</li>
                        <li>• 25.0-30.0: fair, acceptable for most</li>
                        <li>• &gt; 30.0: poor, excessive movement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinky Distance */}
              <div id="pinky-distance-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <Fingerprint className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">pinky load distribution</h3>
                      <p className="text-gray-600 dark:text-gray-400">weakest finger usage ratio</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-full">
                      target: &lt; 0.15
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  measures the proportion of total finger travel performed by the pinky fingers (weakest fingers). 
                  excessive pinky usage is the primary cause of typing-related repetitive strain injuries and 
                  significantly impacts long-term typing comfort and health.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-4">calculation method</h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                      <code className="text-red-700 dark:text-red-300">
                        pinky_ratio = (left_pinky_travel + right_pinky_travel) / total_travel_distance
                      </code>
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      includes both left and right pinky movements across all character sequences, 
                      weighted by frequency to reflect real-world usage patterns.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      ergonomic significance
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                      <div>
                        <p className="font-semibold mb-2">medical considerations:</p>
                        <ul className="space-y-1">
                          <li>• pinkies are weakest and least dexterous</li>
                          <li>• primary source of typing-related rsi</li>
                          <li>• limited coordination and strength</li>
                          <li>• prone to overuse injuries</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">optimization targets:</p>
                        <ul className="space-y-1">
                          <li>• &lt; 0.15: exceptional pinky conservation</li>
                          <li>• 0.15-0.25: good balance, minimal strain</li>
                          <li>• 0.25-0.35: acceptable for most users</li>
                          <li>• &gt; 0.35: high risk of fatigue and injury</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinky Off-Home */}
              <div id="pinky-off-home" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <Fingerprint className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">pinky off-home usage</h3>
                      <p className="text-gray-600 dark:text-gray-400">pinky keystrokes away from home position</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                      target: &lt; 30%
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  measures the percentage of pinky keystrokes that occur away from the home row position. 
                  Since pinkies are the weakest fingers, keeping them on the home row (baseline position) 
                  reduces strain and improves accuracy.
                </p>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-4">calculation method</h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                      <code className="text-orange-700 dark:text-orange-300">
                        pinky_off_home_pct = (pinky_non_home_keystrokes / total_pinky_keystrokes) × 100
                      </code>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      tracks when pinky fingers move away from their natural home row positions 
                      (semicolon/A for right/left pinky respectively) to reach other keys.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      ergonomic impact
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                      <div>
                        <p className="font-semibold mb-2">high off-home usage (&gt;40%):</p>
                        <ul className="space-y-1">
                          <li>• increased pinky strain and fatigue</li>
                          <li>• reduced typing accuracy</li>
                          <li>• higher RSI risk</li>
                          <li>• coordination difficulties</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">optimization targets:</p>
                        <ul className="space-y-1">
                          <li>• &lt; 25%: excellent pinky positioning</li>
                          <li>• 25-35%: good balance</li>
                          <li>• 35-45%: acceptable for most users</li>
                          <li>• &gt; 45%: requires layout optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Finger Usage and Load Distribution */}
            <div id="finger-usage-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-indigo-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                    <Fingerprint className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">finger usage distribution</h3>
                    <p className="text-gray-600 dark:text-gray-400">load balancing across all fingers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
                    balanced usage
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                measures how keystrokes are distributed across all fingers, combining usage percentage with effort scores 
                to identify finger load imbalances. optimal layouts distribute work according to finger strength, 
                avoiding overloading weak fingers while efficiently utilizing strong ones.
              </p>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">finger strength and usage calculation</h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                    <code className="text-indigo-700 dark:text-indigo-300">
                      finger_load = (usage_pct × effort_score) / strength_factor
                    </code>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">finger strength hierarchy:</p>
                      <ul className="space-y-1 text-indigo-800 dark:text-indigo-300">
                        <li>• <strong>index fingers (strongest):</strong> 1.0x base strength</li>
                        <li>• <strong>middle fingers (strong):</strong> 0.85x strength</li>
                        <li>• <strong>ring fingers (weak):</strong> 0.65x strength</li>
                        <li>• <strong>pinky fingers (weakest):</strong> 0.45x strength</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">optimal usage targets:</p>
                      <ul className="space-y-1 text-indigo-800 dark:text-indigo-300">
                        <li>• <strong>index fingers:</strong> 18-22% each</li>
                        <li>• <strong>middle fingers:</strong> 14-18% each</li>
                        <li>• <strong>ring fingers:</strong> 10-14% each</li>
                        <li>• <strong>pinky fingers:</strong> 5-8% each</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">left pinky (LP)</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">6.5%</div>
                    <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                      <div>effort: 8.2 pts</div>
                      <div>position: Q, A, Z</div>
                      <div>weakness factor: 2.2x</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">left ring (LR)</h4>
                    <div className="text-2xl font-bold text-yellow-600 mb-2">11.5%</div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                      <div>effort: 12.8 pts</div>
                      <div>position: W, S, X</div>
                      <div>weakness factor: 1.5x</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">left middle (LM)</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">14.2%</div>
                    <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                      <div>effort: 10.5 pts</div>
                      <div>position: E, D, C</div>
                      <div>weakness factor: 1.2x</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">left index (LI)</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-2">18.7%</div>
                    <div className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                      <div>effort: 8.9 pts</div>
                      <div>position: R, F, V, T, G, B</div>
                      <div>weakness factor: 1.0x</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    finger load optimization targets
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                    <div>
                      <p className="font-semibold mb-2">balanced distribution:</p>
                      <ul className="space-y-1">
                        <li>• no single finger {'>'} 25% usage</li>
                        <li>• pinkies {'<'} 10% combined</li>
                        <li>• indices handle 35-45% total</li>
                        <li>• hand balance within 10%</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">efficiency indicators:</p>
                      <ul className="space-y-1">
                        <li>• effort/usage ratio {'<'} 1.5</li>
                        <li>• strength-usage correlation {'>'} 0.7</li>
                        <li>• minimal weak finger overload</li>
                        <li>• smooth effort distribution</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">optimization strategies:</p>
                      <ul className="space-y-1">
                        <li>• move frequent letters to strong fingers</li>
                        <li>• balance punctuation load</li>
                        <li>• consider bigram patterns</li>
                        <li>• account for language-specific usage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column Usage and Difficulty Analysis */}
          <div id="column-usage-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-teal-500">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-xl">
                  <Columns className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">column usage vs difficulty</h3>
                  <p className="text-gray-600 dark:text-gray-400">comprehensive keyboard column analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full">
                  optimized placement
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              analyzes character placement across all 10 keyboard columns (0-9), evaluating usage patterns 
              against position difficulty to optimize high-frequency character placement. critical for 
              minimizing effort while maximizing accessibility and typing efficiency.
            </p>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                <h4 className="font-bold text-teal-900 dark:text-teal-200 mb-4">complete column difficulty matrix</h4>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                  <code className="text-teal-700 dark:text-teal-300">
                    column_difficulty = base_difficulty × reach_multiplier × frequency_penalty
                  </code>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">difficulty ranking (easiest → hardest):</p>
                    <ul className="space-y-1 text-teal-800 dark:text-teal-300">
                      <li>• <strong>cols 2,3:</strong> home row strong fingers (1.0x)</li>
                      <li>• <strong>cols 7,8:</strong> right home row (1.1x)</li>
                      <li>• <strong>cols 1,9:</strong> ring fingers (1.3x)</li>
                      <li>• <strong>cols 4,6:</strong> index stretches (1.4x)</li>
                      <li>• <strong>cols 5:</strong> center column (1.6x penalty)</li>
                      <li>• <strong>cols 0,9:</strong> outer pinkies (1.8x penalty)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">optimal character placement:</p>
                    <ul className="space-y-1 text-teal-800 dark:text-teal-300">
                      <li>• <strong>cols 2,3,7,8:</strong> highest frequency letters</li>
                      <li>• <strong>cols 1,9:</strong> medium frequency letters</li>
                      <li>• <strong>cols 4,6:</strong> low frequency letters</li>
                      <li>• <strong>cols 5:</strong> rare letters or punctuation</li>
                      <li>• <strong>cols 0,9:</strong> least used characters</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-5 gap-4">
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">col 0 (outer)</h4>
                  <div className="text-lg font-bold text-red-600 mb-2">1.8x</div>
                  <div className="text-xs text-red-700 dark:text-red-400 space-y-1">
                    <div>left pinky outer</div>
                    <div>hardest reach</div>
                    <div>~, `, 1, Tab, Q, A, Z</div>
                    <div>usage: &lt; 3%</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">col 1 (ring)</h4>
                  <div className="text-lg font-bold text-orange-600 mb-2">1.3x</div>
                  <div className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
                    <div>left ring finger</div>
                    <div>moderate difficulty</div>
                    <div>2, W, S, X</div>
                    <div>usage: 8-12%</div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">col 2 (middle)</h4>
                  <div className="text-lg font-bold text-green-600 mb-2">1.0x</div>
                  <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    <div>left middle finger</div>
                    <div>optimal position</div>
                    <div>3, E, D, C</div>
                    <div>usage: 12-16%</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">col 3 (index)</h4>
                  <div className="text-lg font-bold text-blue-600 mb-2">1.1x</div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <div>left index home</div>
                    <div>strong position</div>
                    <div>4, R, F, V</div>
                    <div>usage: 14-18%</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">col 4 (stretch)</h4>
                  <div className="text-lg font-bold text-purple-600 mb-2">1.4x</div>
                  <div className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                    <div>left index stretch</div>
                    <div>uncomfortable</div>
                    <div>5, T, G, B</div>
                    <div>usage: &lt; 8%</div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-5 gap-4">
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">col 5 (center)</h4>
                  <div className="text-lg font-bold text-red-600 mb-2">1.6x</div>
                  <div className="text-xs text-red-700 dark:text-red-400 space-y-1">
                    <div>center column</div>
                    <div>awkward reach</div>
                    <div>6, Y, H, N</div>
                    <div>usage: &lt; 6%</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">col 6 (stretch)</h4>
                  <div className="text-lg font-bold text-purple-600 mb-2">1.4x</div>
                  <div className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                    <div>right index stretch</div>
                    <div>uncomfortable</div>
                    <div>7, U, J, M</div>
                    <div>usage: &lt; 8%</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">col 7 (index)</h4>
                  <div className="text-lg font-bold text-blue-600 mb-2">1.1x</div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <div>right index home</div>
                    <div>strong position</div>
                    <div>8, I, K, comma</div>
                    <div>usage: 14-18%</div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">col 8 (middle)</h4>
                  <div className="text-lg font-bold text-green-600 mb-2">1.1x</div>
                  <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    <div>right middle finger</div>
                    <div>good position</div>
                    <div>9, O, L, period</div>
                    <div>usage: 12-16%</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">col 9 (ring)</h4>
                  <div className="text-lg font-bold text-orange-600 mb-2">1.3x</div>
                  <div className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
                    <div>right ring finger</div>
                    <div>moderate difficulty</div>
                    <div>0, P, semicolon, slash</div>
                    <div>usage: 8-12%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  column optimization strategies
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                  <div>
                    <p className="font-semibold mb-2">high-priority columns (2,3,7,8):</p>
                    <ul className="space-y-1">
                      <li>• place most frequent letters (e, t, a, o, i, n)</li>
                      <li>• target 60-70% total usage</li>
                      <li>• minimize effort per keystroke</li>
                      <li>• optimize for common bigrams</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">problematic columns (0,5,9):</p>
                    <ul className="space-y-1">
                      <li>• avoid high-frequency characters</li>
                      <li>• place rare letters and symbols</li>
                      <li>• minimize total usage (&lt; 15%)</li>
                      <li>• consider punctuation placement</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">balanced usage targets:</p>
                    <ul className="space-y-1">
                      <li>• home positions: 12-18% each</li>
                      <li>• stretch positions: 4-8% each</li>
                      <li>• center column: &lt; 6% total</li>
                      <li>• outer columns: &lt; 8% combined</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row Usage and Ergonomics Analysis */}
          <div id="row-usage-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">row usage & ergonomic patterns</h3>
                  <p className="text-gray-600 dark:text-gray-400">vertical movement analysis and home row optimization</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                  home row priority
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              comprehensive analysis of character distribution across keyboard rows (top, home, bottom), evaluating 
              ergonomic implications of vertical finger movements and optimizing layouts for minimal row departures 
              while maintaining efficient access to all characters.
            </p>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-4">row effort multiplier formula</h4>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                  <code className="text-purple-700 dark:text-purple-300">
                    row_effort = base_effort × row_multiplier × usage_frequency
                  </code>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">row difficulty hierarchy:</p>
                    <ul className="space-y-1 text-purple-800 dark:text-purple-300">
                      <li>• <strong>home row (row 1):</strong> optimal baseline (1.0x)</li>
                      <li>• <strong>bottom row (row 2):</strong> slight reach down (1.1x)</li>
                      <li>• <strong>top row (row 0):</strong> reach up penalty (1.3x)</li>
                      <li>• <strong>number row:</strong> significant stretch (1.8x+)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">ergonomic considerations:</p>
                    <ul className="space-y-1 text-purple-800 dark:text-purple-300">
                      <li>• upward movement more strenuous than downward</li>
                      <li>• home row provides strongest finger positions</li>
                      <li>• row jumps (2+ rows) significantly impact speed</li>
                      <li>• finger-specific row preferences vary</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl text-center">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">home row (optimal)</h4>
                  <div className="text-2xl font-bold text-green-600 mb-2">1.0x</div>
                  <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    <div>natural finger rest position</div>
                    <div>minimal movement required</div>
                    <div>A S D F / J K L ;</div>
                    <div>target usage: 60-70%</div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl text-center">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">bottom row (acceptable)</h4>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">1.1x</div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                    <div>slight downward reach</div>
                    <div>manageable for most users</div>
                    <div>Z X C V / B N M ,</div>
                    <div>target usage: 20-25%</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl text-center">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">top row (challenging)</h4>
                  <div className="text-2xl font-bold text-orange-600 mb-2">1.3x</div>
                  <div className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
                    <div>upward reach required</div>
                    <div>increased strain and errors</div>
                    <div>Q W E R / T Y U I O P</div>
                    <div>target usage: 10-15%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  row optimization strategies
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                  <div>
                    <p className="font-semibold mb-2">home row priority:</p>
                    <ul className="space-y-1">
                      <li>• place highest frequency letters (e, t, a, o, i, n)</li>
                      <li>• prioritize vowels for accessibility</li>
                      <li>• balance across both hands</li>
                      <li>• consider common bigram patterns</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">bottom row allocation:</p>
                    <ul className="space-y-1">
                      <li>• medium frequency consonants</li>
                      <li>• punctuation and common symbols</li>
                      <li>• letters completing common words</li>
                      <li>• avoid frequent bigram pairs</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">top row minimization:</p>
                    <ul className="space-y-1">
                      <li>• reserve for lowest frequency letters</li>
                      <li>• avoid placing common vowels</li>
                      <li>• consider numbers and symbols</li>
                      <li>• maintain some accessibility for q, w</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  row jump analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2 text-red-800 dark:text-red-300">problematic row jumps:</p>
                    <ul className="space-y-1 text-red-700 dark:text-red-400">
                      <li>• <strong>two-row jumps:</strong> top ↔ bottom (q→z, p→/)</li>
                      <li>• <strong>number to bottom:</strong> extreme vertical movement</li>
                      <li>• <strong>same finger jumps:</strong> highest penalty</li>
                      <li>• <strong>weak finger jumps:</strong> pinky row departures</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-red-800 dark:text-red-300">performance impact:</p>
                    <ul className="space-y-1 text-red-700 dark:text-red-400">
                      <li>• 30-50% speed reduction for affected transitions</li>
                      <li>• increased error rates and hesitation</li>
                      <li>• hand position destabilization</li>
                      <li>• cumulative fatigue over long sessions</li>
                    </ul>
                  </div>
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
                  flow & rhythm metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">typing fluidity, hand coordination, and movement patterns</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Roll Metrics */}
              <div className="grid md:grid-cols-2 gap-8">
                <div id="roll-in-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <RotateCw className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">inward rolls</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">target: &gt; 15%</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    smooth finger sequences rolling toward the keyboard center. these natural motions 
                    feel comfortable and enable fast, flowing typing with minimal effort.
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">detection algorithm</h4>
                    <div className="font-mono text-sm text-green-800 dark:text-green-300 mb-2">
                      if (left_hand && finger2 &gt; finger1) → inward_roll<br/>
                      if (right_hand && finger2 &lt; finger1) → inward_roll
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      identifies sequences where fingers move toward the keyboard center in natural progression
                    </p>
                  </div>
                </div>

                <div id="roll-out-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">outward rolls</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">target: &gt; 12%</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    finger sequences rolling away from keyboard center. less comfortable than 
                    inward rolls but still efficient and smooth when properly optimized.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">calculation</h4>
                    <div className="font-mono text-sm text-blue-800 dark:text-blue-300 mb-2">
                      outward_rolls / total_bigrams × 100
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      percentage of all letter pairs that form outward rolling motions within same hand
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternation */}
              <div id="alternation-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">hand alternation</h3>
                      <p className="text-gray-600 dark:text-gray-400">three-letter hand switching patterns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                      target: &gt; 60%
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  percentage of three-letter sequences that alternate between hands (l-r-l or r-l-r pattern). 
                  hand alternation allows one hand to rest while the other types, reducing fatigue and 
                  enabling more consistent rhythm and speed.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-4">trigram classification algorithm</h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-base mb-4">
                      <code className="text-purple-700 dark:text-purple-300">
                        if (hand1 ≠ hand2 && hand2 ≠ hand3 && hand1 ≠ hand3) → alternation<br/>
                        if (finger1 === finger3 && alternation) → alt_sfs (problematic)
                      </code>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      identifies pure alternation patterns while flagging alternating same finger sequences 
                      that can cause coordination problems despite hand switching.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">benefits of high alternation</h4>
                      <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                        <li>• reduced hand fatigue through rest periods</li>
                        <li>• more consistent typing rhythm</li>
                        <li>• better error recovery patterns</li>
                        <li>• improved endurance for long sessions</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">optimization targets</h4>
                      <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-1">
                        <li>• &gt; 65%: excellent alternation balance</li>
                        <li>• 50-65%: good rhythm potential</li>
                        <li>• 35-50%: adequate for most users</li>
                        <li>• &lt; 35%: may cause hand imbalance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trigram Redirects */}
              <div id="tri-redirect-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <ArrowRight className="w-8 h-8 text-red-600 dark:text-red-400 transform rotate-45" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">trigram redirects</h3>
                      <p className="text-gray-600 dark:text-gray-400">awkward direction changes in sequences</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-full">
                      target: &lt; 15%
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  measures the percentage of three-letter sequences that involve awkward direction changes, 
                  where fingers must change direction abruptly within the same hand. redirects disrupt 
                  typing flow and can cause hesitation, reducing overall speed and rhythm.
                </p>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-4">redirect detection algorithm</h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                      <code className="text-red-700 dark:text-red-300">
                        if (same_hand && direction_change && !roll_pattern) → redirect
                      </code>
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      identifies same-hand trigrams where finger movement direction changes abruptly, 
                      excluding smooth roll patterns that maintain flow.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      impact on typing performance
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                      <div>
                        <p className="font-semibold mb-2">performance effects:</p>
                        <ul className="space-y-1">
                          <li>• disrupted typing rhythm</li>
                          <li>• increased hesitation and pauses</li>
                          <li>• reduced overall speed</li>
                          <li>• mental coordination overhead</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">optimization targets:</p>
                        <ul className="space-y-1">
                          <li>• &lt; 10%: excellent flow optimization</li>
                          <li>• 10-15%: good typing rhythm</li>
                          <li>• 15-20%: acceptable for most users</li>
                          <li>• &gt; 20%: significant flow disruption</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precision & Accuracy Metrics */}
          <div className="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl shadow-lg">
                <Crosshair className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-1">
                  precision & accuracy metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">error prevention, coordination, and typing precision</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Same Finger Bigrams - Comprehensive Analysis */}
              <div id="sfb-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">comprehensive same finger bigram analysis</h3>
                      <p className="text-gray-600 dark:text-gray-400">all variations of consecutive same-finger patterns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-full">
                      target: {'<'} 2%
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  same finger bigrams (SFBs) represent the most critical bottleneck in keyboard layout performance. 
                  this comprehensive analysis covers all variations including basic SFBs, skip bigrams, two-row jumps, 
                  and 3-unit skips, each with distinct performance implications and optimization strategies.
                </p>
                
                <div className="space-y-8">
                  {/* SFB Classification Matrix */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-6">complete sfb classification matrix</h4>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {/* Basic SFB */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-red-500">
                          <h5 className="font-semibold text-red-900 dark:text-red-200 mb-3">1. basic same finger bigrams (SFB)</h5>
                          <div className="font-mono text-sm text-red-800 dark:text-red-300 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            if (finger1 === finger2 && key1 !== key2 &&<br/>
                            {'    '}same_row && adjacent_columns) {'{'}<br/>
                            {'  '}basic_sfb++;<br/>
                            {'}'}
                          </div>
                          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                            <strong>examples:</strong> ed, de (qwerty right middle finger)
                          </p>
                          <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded text-xs">
                            <div><strong>impact:</strong> 25-40% speed reduction</div>
                            <div><strong>frequency:</strong> most common SFB type</div>
                            <div><strong>optimization:</strong> highest priority for separation</div>
                          </div>
                        </div>
                        
                        {/* Skip Bigrams 2u */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
                          <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">2. skip bigrams (2u) - horizontal skipping</h5>
                          <div className="font-mono text-sm text-purple-800 dark:text-purple-300 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            if (finger1 === finger2 && key1 !== key2 &&<br/>
                            {'    '}same_row && Math.abs(col1 - col2) === 2) {'{'}<br/>
                            {'  '}skip_2u++;<br/>
                            {'}'}
                          </div>
                          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
                            <strong>examples:</strong> ew, we (qwerty left middle finger skipping over d)
                          </p>
                          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded text-xs">
                            <div><strong>impact:</strong> 40-55% speed reduction</div>
                            <div><strong>coordination:</strong> requires precise finger control</div>
                            <div><strong>accuracy:</strong> high error probability</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Two-Row SFB */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-orange-500">
                          <h5 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">3. two-row same finger bigrams</h5>
                          <div className="font-mono text-sm text-orange-800 dark:text-orange-300 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            if (finger1 === finger2 && key1 !== key2 &&<br/>
                            {'    '}Math.abs(row1 - row2) {'>='} 2) {'{'}<br/>
                            {'  '}two_row_sfb++;<br/>
                            {'}'}
                          </div>
                          <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
                            <strong>examples:</strong> qz, az (qwerty left pinky), p/ (qwerty right pinky)
                          </p>
                          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded text-xs">
                            <div><strong>impact:</strong> 50-70% speed reduction</div>
                            <div><strong>strain:</strong> extreme finger extension</div>
                            <div><strong>ergonomics:</strong> highest injury risk</div>
                          </div>
                        </div>
                        
                        {/* Skip Bigrams 3u */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-pink-500">
                          <h5 className="font-semibold text-pink-900 dark:text-pink-200 mb-3">4. skip bigrams (3u+) - extreme skipping</h5>
                          <div className="font-mono text-sm text-pink-800 dark:text-pink-300 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            if (finger1 === finger2 && key1 !== key2 &&<br/>
                            {'    '}same_row && Math.abs(col1 - col2) {'>='} 3) {'{'}<br/>
                            {'  '}skip_3u_plus++;<br/>
                            {'}'}
                          </div>
                          <p className="text-sm text-pink-700 dark:text-pink-400 mb-3">
                            <strong>examples:</strong> qr, qt (qwerty left - index finger extreme reach)
                          </p>
                          <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded text-xs">
                            <div><strong>impact:</strong> 60-80% speed reduction</div>
                            <div><strong>feasibility:</strong> nearly impossible at speed</div>
                            <div><strong>priority:</strong> absolute elimination required</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comprehensive Performance Impact Analysis */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-8 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      comprehensive performance impact analysis
                    </h4>
                    <div className="grid md:grid-cols-4 gap-6">
                      <div>
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">speed reduction factors</h5>
                        <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                          <div className="flex justify-between">
                            <span>basic SFB:</span>
                            <span className="font-mono">25-40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>skip 2u:</span>
                            <span className="font-mono">40-55%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>two-row:</span>
                            <span className="font-mono">50-70%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>skip 3u+:</span>
                            <span className="font-mono">60-80%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">accuracy degradation</h5>
                        <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                          <div>• timing inconsistency</div>
                          <div>• increased error rates</div>
                          <div>• coordination breakdown</div>
                          <div>• hesitation and pauses</div>
                          <div>• muscle memory interference</div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">ergonomic consequences</h5>
                        <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                          <div>• finger strain accumulation</div>
                          <div>• tendon stress patterns</div>
                          <div>• joint hyperextension</div>
                          <div>• fatigue acceleration</div>
                          <div>• RSI risk elevation</div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">cognitive overhead</h5>
                        <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                          <div>• mental planning required</div>
                          <div>• flow state disruption</div>
                          <div>• attention allocation</div>
                          <div>• typing rhythm breakdown</div>
                          <div>• concentration fatigue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Layout-Specific SFB Examples */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-8 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-6">layout-specific sfb patterns and examples</h4>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">qwerty sfb patterns</h5>
                        <div className="space-y-4 text-sm">
                          <div>
                            <div className="font-semibold text-red-600 mb-1">critical SFBs ({'>'}0.5% frequency):</div>
                            <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• <span className="text-red-600">ed, de</span> (right middle): 0.89%</div>
                              <div>• <span className="text-red-600">fr, rf</span> (left index): 0.44%</div>
                              <div>• <span className="text-red-600">ju, uy</span> (right index): 0.31%</div>
                              <div>• <span className="text-red-600">ol, lo</span> (right ring): 0.28%</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-600 mb-1">skip bigrams:</div>
                            <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• <span className="text-purple-600">ik, ki</span> (right middle skip)</div>
                              <div>• <span className="text-purple-600">ew, we</span> (left middle skip)</div>
                              <div>• <span className="text-purple-600">pl, lp</span> (right ring skip)</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-orange-600 mb-1">two-row SFBs:</div>
                            <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• <span className="text-orange-600">qz, zq</span> (left pinky)</div>
                              <div>• <span className="text-orange-600">p/</span> (right pinky)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">dvorak sfb patterns</h5>
                        <div className="space-y-4 text-sm">
                          <div>
                            <div className="font-semibold text-red-600 mb-1">critical SFBs:</div>
                            <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• <span className="text-red-600">ue, eu</span> (left middle): 0.67%</div>
                              <div>• <span className="text-red-600">oa, ao</span> (left ring): 0.45%</div>
                              <div>• <span className="text-red-600">ht, th</span> (right index): 0.33%</div>
                              <div>• <span className="text-red-600">ns, sn</span> (right middle): 0.28%</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-600 mb-1">dvorak advantages:</div>
                            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• better vowel separation</div>
                              <div>• reduced common SFBs</div>
                              <div>• improved home row usage</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-orange-600 mb-1">remaining issues:</div>
                            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• some problematic consonant pairs</div>
                              <div>• pinky overuse in some positions</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">colemak sfb patterns</h5>
                        <div className="space-y-4 text-sm">
                          <div>
                            <div className="font-semibold text-red-600 mb-1">remaining SFBs:</div>
                            <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• <span className="text-red-600">he, eh</span> (right index): 0.22%</div>
                              <div>• <span className="text-red-600">sc, cs</span> (left middle): 0.18%</div>
                              <div>• <span className="text-red-600">lm, ml</span> (right ring): 0.15%</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-600 mb-1">optimization success:</div>
                            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• dramatically reduced total SFBs</div>
                              <div>• eliminated high-frequency pairs</div>
                              <div>• better letter placement</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-blue-600 mb-1">design philosophy:</div>
                            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                              <div>• SFB minimization priority</div>
                              <div>• evidence-based optimization</div>
                              <div>• practical typing focus</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SFB Optimization Strategies */}
                  <div className="bg-green-50 dark:bg-green-900/30 p-8 rounded-xl">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-6">comprehensive sfb optimization strategies</h4>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="font-semibold text-green-800 dark:text-green-300 mb-4">strategic approaches</h5>
                        <div className="space-y-4 text-sm text-green-700 dark:text-green-400">
                          <div className="border-l-4 border-green-500 pl-4">
                            <div className="font-semibold mb-1">1. frequency-first optimization</div>
                            <div>prioritize separation of highest frequency SFBs first - eliminating just the top 5-10 SFBs can reduce total SFB load by 40-60%</div>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <div className="font-semibold mb-1">2. hand-balanced redistribution</div>
                            <div>move one letter of SFB pair to opposite hand to create alternation instead of same-finger burden</div>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <div className="font-semibold mb-1">3. finger reallocation</div>
                            <div>reassign letters to different fingers on same hand while maintaining ergonomic positioning principles</div>
                          </div>
                          <div className="border-l-4 border-orange-500 pl-4">
                            <div className="font-semibold mb-1">4. strategic placement</div>
                            <div>utilize analysis of letter combination patterns to predict and prevent problematic pairings</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-green-800 dark:text-green-300 mb-4">implementation priorities</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <div className="font-semibold text-red-600 mb-2">phase 1: critical elimination</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <div>• target SFBs {'>'}0.5% frequency first</div>
                              <div>• eliminate all two-row SFBs</div>
                              <div>• remove skip bigrams 3u+</div>
                              <div>• focus on common english patterns</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <div className="font-semibold text-orange-600 mb-2">phase 2: systematic reduction</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <div>• address moderate frequency SFBs (0.1-0.5%)</div>
                              <div>• minimize skip bigrams 2u</div>
                              <div>• optimize finger load balance</div>
                              <div>• maintain ergonomic constraints</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <div className="font-semibold text-green-600 mb-2">phase 3: fine-tuning</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <div>• eliminate remaining low-frequency SFBs</div>
                              <div>• balance with other metrics</div>
                              <div>• verify real-world performance</div>
                              <div>• user testing and iteration</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Target Thresholds and Benchmarks */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-6">target thresholds and performance benchmarks</h4>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <div className="font-bold text-green-800 dark:text-green-300 mb-2">excellent</div>
                        <div className="text-2xl font-bold text-green-600 mb-2">{'<'} 1.5%</div>
                        <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                          <div>minimal speed impact</div>
                          <div>comfortable typing</div>
                          <div>low fatigue levels</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <div className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">good</div>
                        <div className="text-2xl font-bold text-yellow-600 mb-2">1.5-3%</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          <div>acceptable performance</div>
                          <div>manageable for most users</div>
                          <div>slight efficiency loss</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <div className="font-bold text-orange-800 dark:text-orange-300 mb-2">fair</div>
                        <div className="text-2xl font-bold text-orange-600 mb-2">3-6%</div>
                        <div className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
                          <div>noticeable slowdown</div>
                          <div>requires adaptation</div>
                          <div>increased effort needed</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <div className="font-bold text-red-800 dark:text-red-300 mb-2">poor</div>
                        <div className="text-2xl font-bold text-red-600 mb-2">{'>'} 6%</div>
                        <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
                          <div>significant speed loss</div>
                          <div>high fatigue factor</div>
                          <div>optimization required</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skip Bigrams - Comprehensive Section */}
              <div id="skip-bigrams-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <ArrowRight className="w-8 h-8 text-purple-600 dark:text-purple-400 transform rotate-12" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">skip bigrams & two-row same finger</h3>
                      <p className="text-gray-600 dark:text-gray-400">problematic finger skipping patterns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                      target: &lt; 3%
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  identifies bigrams where fingers must skip over adjacent keys on the same row, or same finger 
                  movements requiring two or more row jumps. these patterns disrupt typing flow, reduce accuracy, 
                  and cause uncomfortable finger positioning that slows down overall typing speed.
                </p>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">skip bigrams detection</h4>
                      <div className="font-mono text-sm text-purple-800 dark:text-purple-300 mb-3 bg-white dark:bg-gray-800 p-3 rounded">
                        {`if (same_finger && same_row &&
    Math.abs(col1 - col2) >= 2) {
  skip_bigrams++;
}`}
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-400">
                        identifies when fingers skip over adjacent keys horizontally on same row
                      </p>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl">
                      <h4 className="font-semibold text-red-900 dark:text-red-200 mb-3">two-row same finger</h4>
                      <div className="font-mono text-sm text-red-800 dark:text-red-300 mb-3 bg-white dark:bg-gray-800 p-3 rounded">
                        {`if (same_finger &&
    Math.abs(row1 - row2) >= 2) {
  two_row_sfb++;
}`}
                      </div>
                      <p className="text-xs text-red-700 dark:text-red-400">
                        worst case: same finger jumping two or more rows vertically
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      impact analysis
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
                      <div>
                        <p className="font-semibold mb-2">skip bigrams effects:</p>
                        <ul className="space-y-1">
                          <li>• finger coordination difficulty</li>
                          <li>• reduced typing rhythm</li>
                          <li>• increased error probability</li>
                          <li>• hand position instability</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">two-row sfb effects:</p>
                        <ul className="space-y-1">
                          <li>• extreme finger strain</li>
                          <li>• significant speed reduction</li>
                          <li>• accuracy deterioration</li>
                          <li>• fatigue accumulation</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">optimization targets:</p>
                        <ul className="space-y-1">
                          <li>• &lt; 1%: excellent avoidance</li>
                          <li>• 1-3%: good, manageable</li>
                          <li>• 3-5%: acceptable limit</li>
                          <li>• &gt; 5%: requires optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">common problematic patterns</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">skip bigram examples:</p>
                        <div className="space-y-1 font-mono text-xs">
                          <div>qe, ei, io (qwerty)</div>
                          <div>pk, qz, x; (outer skips)</div>
                          <div>ce, dx, sw (middle skips)</div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">two-row sfb examples:</p>
                        <div className="space-y-1 font-mono text-xs">
                          <div>qz, az (left pinky)</div>
                          <div>p/, ;/ (right pinky)</div>
                          <div>1q, 0p (number-letter)</div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">layout solutions:</p>
                        <div className="space-y-1 text-xs">
                          <div>separate high-frequency pairs</div>
                          <div>minimize vertical same finger</div>
                          <div>place rare letters in problem spots</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Scissors & Lateral Stretches */}
              <div id="scissors-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <Crosshair className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">scissors & lateral stretches</h3>
                      <p className="text-gray-600 dark:text-gray-400">comprehensive analysis of awkward finger coordination patterns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                      target: &lt; 3% combined
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  measures the most ergonomically problematic finger coordination patterns in keyboard layouts. 
                  scissors occur when adjacent fingers must coordinate awkward movements across multiple rows, 
                  while lateral stretches involve uncomfortable sideways finger extensions. these patterns are 
                  primary contributors to typing strain, reduced accuracy, and long-term repetitive stress injuries.
                </p>
                
                <div className="space-y-8">
                  {/* Pattern Type Classification */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-6 flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      complete pattern classification system
                    </h4>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-red-900 dark:text-red-200 mb-3">pinky scissors</h5>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <p className="font-medium">definition:</p>
                          <p>adjacent finger movements involving pinky coordination across 2+ rows</p>
                          <p className="font-medium mt-3">severity: highest</p>
                          <p>affects weakest finger with limited dexterity and strength</p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">general scissors</h5>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <p className="font-medium">definition:</p>
                          <p>adjacent finger coordination across multiple rows (non-pinky)</p>
                          <p className="font-medium mt-3">severity: moderate</p>
                          <p>affects stronger fingers but still creates coordination strain</p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">lateral stretches</h5>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <p className="font-medium">definition:</p>
                          <p>uncomfortable sideways finger extensions to distant columns</p>
                          <p className="font-medium mt-3">severity: high</p>
                          <p>primarily affects index fingers reaching to outer columns</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Detection Algorithms */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6">comprehensive detection algorithms</h4>
                    
                    <div className="space-y-6">
                      {/* Pinky Scissors Algorithm */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-4 text-red-900 dark:text-red-200">pinky scissors detection</h5>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                          <code className="text-red-700 dark:text-red-300">
                            function detectPinkyScissors(key1, key2, freq) {`{`}<br/>
                            {'  '}const pos1 = keyPositions[key1];<br/>
                            {'  '}const pos2 = keyPositions[key2];<br/>
                            {'  '}const hand1 = getHand(pos1.finger);<br/>
                            {'  '}const hand2 = getHand(pos2.finger);<br/>
                            {'  '}<br/>
                            {'  '}{/* Same hand, adjacent fingers */}<br/>
                            {'  '}if (hand1 !== hand2) return null;<br/>
                            {'  '}if (Math.abs(pos1.finger - pos2.finger) !== 1) return null;<br/>
                            {'  '}<br/>
                            {'  '}{/* Check for pinky involvement */}<br/>
                            {'  '}const isPinkyInvolved = pos1.finger === 1 || pos1.finger === 10 ||<br/>
                            {'                        '}pos2.finger === 1 || pos2.finger === 10;<br/>
                            {'  '}<br/>
                            {'  '}{/* Check row separation (2+ rows apart) */}<br/>
                            {'  '}const rowDiff = Math.abs(pos1.row - pos2.row);<br/>
                            {'  '}if (rowDiff {'>='} 2 {'&&'} isPinkyInvolved) {'{'}<br/>
                            {'    '}return {'{'}<br/>
                            {'      '}type: 'pinky_scissors',<br/>
                            {'      '}severity: 3.0, // Highest penalty<br/>
                            {'      '}frequency: freq,<br/>
                            {'      '}pattern: '${'{'}key1{'}'}${'{'}key2{'}'}',
                            {'      '}rowDifference: rowDiff<br/>
                            {'    '}{'};'}<br/>
                            {'  '}{'}'}<br/>
                            {'  '}<br/>
                            {'  '}return null;<br/>
                            {'}'}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          identifies the most problematic scissors patterns involving pinkies, which have
                          the least strength and dexterity for complex coordination movements
                        </p>
                      </div>
                      
                      {/* General Scissors Algorithm */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-4 text-orange-900 dark:text-orange-200">general scissors detection</h5>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                          <code className="text-orange-700 dark:text-orange-300">
                            function detectGeneralScissors(key1, key2, freq) {`{`}<br/>
                            {'  '}const pos1 = keyPositions[key1];<br/>
                            {'  '}const pos2 = keyPositions[key2];<br/>
                            {'  '}const hand1 = getHand(pos1.finger);<br/>
                            {'  '}const hand2 = getHand(pos2.finger);<br/>
                            {'  '}<br/>
                            {'  '}{/* Same hand, adjacent fingers, exclude pinkies */}<br/>
                            {'  '}if (hand1 !== hand2) return null;<br/>
                            {'  '}if (Math.abs(pos1.finger - pos2.finger) !== 1) return null;<br/>
                            {'  '}<br/>
                            {'  '}const isPinky = pos1.finger === 1 || pos1.finger === 10 ||<br/>
                            {'                  '}pos2.finger === 1 || pos2.finger === 10;<br/>
                            {'  '}if (isPinky) return null; // Handled separately<br/>
                            {'  '}<br/>
                            {'  '}const rowDiff = Math.abs(pos1.row - pos2.row);<br/>
                            {'  '}if (rowDiff {'>='} 2) {'{'}<br/>
                            {'    '}{/* Calculate severity based on finger strength */}<br/>
                            {'    '}const fingerStrength = getFingerStrength(pos1.finger, pos2.finger);<br/>
                            {'    '}const severity = 2.0 / fingerStrength; // Weaker = higher penalty<br/>
                            {'    '}<br/>
                            {'    '}return {'{'}<br/>
                            {'      '}type: 'general_scissors',<br/>
                            {'      '}severity: severity,<br/>
                            {'      '}frequency: freq,<br/>
                            {'      '}pattern: '${'{'}key1{'}'}${'{'}key2{'}'}',
                            {'      '}fingerPair: getFingerPairName(pos1.finger, pos2.finger)<br/>
                            {'    '}{'};'}<br/>
                            {'  '}{'}'}<br/>
                            {'  '}<br/>
                            {'  '}return null;<br/>
                            {'}'}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          detects scissors patterns for all non-pinky adjacent finger pairs,
                          with severity scaled by relative finger strength
                        </p>
                      </div>
                      
                      {/* Lateral Stretch Algorithm */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-4 text-yellow-900 dark:text-yellow-200">lateral stretch detection</h5>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                          <code className="text-yellow-700 dark:text-yellow-300">
                            function detectLateralStretch(key1, key2, freq) {`{`}<br/>
                            {'  '}const pos1 = keyPositions[key1];<br/>
                            {'  '}const pos2 = keyPositions[key2];<br/>
                            {'  '}<br/>
                            {'  '}{/* Define uncomfortable stretches by column pairs */}<br/>
                            {'  '}const stretchPatterns = [<br/>
                            {'    '}{/* Left hand index stretches */}<br/>
                            {'    '}{'{'} from: 3, to: 5, severity: 2.5 {'}'}, // F to T/G<br/>
                            {'    '}{'{'} from: 3, to: 6, severity: 3.0 {'}'}, // F to Y/H (extreme)<br/>
                            {'    '}{/* Right hand index stretches */}<br/>
                            {'    '}{'{'} from: 6, to: 4, severity: 2.5 {'}'}, // J to R/F<br/>
                            {'    '}{'{'} from: 6, to: 3, severity: 3.0 {'}'}, // J to E/D (extreme)<br/>
                            {'    '}{/* Reverse patterns */}<br/>
                            {'    '}{'{'} from: 5, to: 3, severity: 2.5 {'}'},<br/>
                            {'    '}{'{'} from: 4, to: 6, severity: 2.5 {'}'}<br/>
                            {'  '}];<br/>
                            {'  '}<br/>
                            {'  '}for (const pattern of stretchPatterns) {'{'}<br/>
                            {'    '}if ((pos1.col === pattern.from && pos2.col === pattern.to) ||<br/>
                            {'        '}(pos2.col === pattern.from && pos1.col === pattern.to)) {'{'}<br/>
                            {'      '}<br/>
                            {'      '}{/* Additional penalty for same-row stretches (harder) */}<br/>
                            {'      '}const rowPenalty = pos1.row === pos2.row ? 1.3 : 1.0;<br/>
                            {'      '}<br/>
                            {'      '}return {'{'}<br/>
                            {'        '}type: 'lateral_stretch',<br/>
                            {'        '}severity: pattern.severity * rowPenalty,<br/>
                            {'        '}frequency: freq,<br/>
                            {'        '}pattern: '${'{'}key1{'}'}${'{'}key2{'}'}',
                            {'        '}columnSpan: Math.abs(pos1.col - pos2.col)<br/>
                            {'      '}{'};'}<br/>
                            {'    '}{'}'}<br/>
                            {'  '}{'}'}<br/>
                            {'  '}<br/>
                            {'  '}return null;<br/>
                            {'}'}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          identifies uncomfortable sideways finger extensions, particularly problematic
                          when index fingers reach to center or outer columns
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Biomechanical Impact Analysis */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      comprehensive biomechanical impact analysis
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-red-900 dark:text-red-200 mb-3">pinky scissors effects</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>severe coordination strain:</strong> pinkies lack dexterity for complex multi-row movements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>tendon stress:</strong> excessive force required from weakest finger tendons</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>accuracy degradation:</strong> up to 15% increase in error rates</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>RSI vulnerability:</strong> primary contributor to pinky-related injuries</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>speed reduction:</strong> 20-30% slower than optimal finger patterns</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">general scissors effects</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>coordination complexity:</strong> requires precise timing between adjacent fingers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>hand position disruption:</strong> forces awkward wrist/hand positioning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>rhythm interruption:</strong> breaks natural typing flow patterns</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>fatigue accumulation:</strong> extra effort compounds over typing sessions</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">lateral stretch effects</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>index finger overextension:</strong> uncomfortable sideways reaching motions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>wrist deviation:</strong> forces non-neutral wrist positioning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>timing precision loss:</strong> harder to maintain consistent keystroke timing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>hand stability reduction:</strong> base hand position becomes less stable</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">combined pattern effects</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>compounding strain:</strong> multiple patterns amplify ergonomic problems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>learning difficulty:</strong> complex patterns harder to master</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>adaptation stress:</strong> body compensates with suboptimal postures</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimization Strategies */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      comprehensive optimization strategies
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-green-900 dark:text-green-200 mb-3">primary prevention</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>• separate high-frequency bigrams prone to scissors</li>
                            <li>• place common letters on home row positions</li>
                            <li>• minimize pinky usage for complex movements</li>
                            <li>• avoid center column placement for frequent chars</li>
                            <li>• prioritize same-hand rolls over scissors</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-green-900 dark:text-green-200 mb-3">layout design rules</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>• place rare letters in problematic positions</li>
                            <li>• create vertical finger movement patterns</li>
                            <li>• balance scissor patterns across both hands</li>
                            <li>• use alternation to break up difficult sequences</li>
                            <li>• consider bigram frequency in positioning</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                          <h5 className="font-semibold text-green-900 dark:text-green-200 mb-3">advanced techniques</h5>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>• use trigram analysis for context optimization</li>
                            <li>• implement weighted frequency calculations</li>
                            <li>• apply genetic algorithm optimization</li>
                            <li>• perform Monte Carlo layout testing</li>
                            <li>• validate with multi-language corpora</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">performance target thresholds</h5>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-2">&lt; 1%</div>
                            <div className="text-xs text-green-700 dark:text-green-400">excellent<br/>minimal strain</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600 mb-2">1-2%</div>
                            <div className="text-xs text-yellow-700 dark:text-yellow-400">good<br/>minor issues</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600 mb-2">2-4%</div>
                            <div className="text-xs text-orange-700 dark:text-orange-400">acceptable<br/>manageable</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-red-600 mb-2">&gt; 4%</div>
                            <div className="text-xs text-red-700 dark:text-red-400">problematic<br/>needs optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Common Pattern Examples */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-6">common problematic patterns & solutions</h4>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-red-900 dark:text-red-200 mb-3">pinky scissors examples</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">QWERTY patterns:</p>
                            <div className="font-mono text-xs space-y-1 text-red-700 dark:text-red-400">
                              <div>qw, qa (left pinky-ring, 2 rows)</div>
                              <div>p/, p; (right pinky-ring, 2 rows)</div>
                              <div>1q, 0p (number-letter scissors)</div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">solution approach:</p>
                            <p className="text-xs text-green-700 dark:text-green-400">
                              separate these letters to different hands or
                              place on same finger for consistent usage
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">general scissors examples</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">common patterns:</p>
                            <div className="font-mono text-xs space-y-1 text-orange-700 dark:text-orange-400">
                              <div>wr, ws (ring-middle, 2 rows)</div>
                              <div>ed, ec (middle-ring, 2 rows)</div>
                              <div>ui, uj (index-middle, 2+ rows)</div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">mitigation:</p>
                            <p className="text-xs text-green-700 dark:text-green-400">
                              use rolls or alternation instead,
                              minimize frequency of these patterns
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg">
                        <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">lateral stretch examples</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">index stretches:</p>
                            <div className="font-mono text-xs space-y-1 text-yellow-700 dark:text-yellow-400">
                              <div>ft, fg (left index to center)</div>
                              <div>jy, jh (right index to center)</div>
                              <div>fb, fv (left index extreme reach)</div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">optimization:</p>
                            <p className="text-xs text-green-700 dark:text-green-400">
                              avoid placing frequent letters in
                              center columns, use thumbs when possible
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Positioning & Layout Metrics */}
          <div className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10 rounded-3xl p-8 shadow-xl border border-yellow-100 dark:border-yellow-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl shadow-lg">
                <Compass className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent leading-tight pb-1">
                  positioning & layout metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">key placement optimization and accessibility</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Center Column Usage */}
              <div id="center-columns-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                      <Gauge className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">center column usage</h3>
                      <p className="text-gray-600 dark:text-gray-400">t, g, y, h key positions utilization</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-full">
                      target: &lt; 8%
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  measures usage of the hard-to-reach center columns (columns 5 and 6, typically t/g and y/h positions). 
                  these keys require awkward index finger stretches and are less accurate than standard positions, 
                  making them suboptimal for high-frequency characters.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-4">calculation methodology</h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                      <code className="text-yellow-700 dark:text-yellow-300">
                        col5_6_pct = (center_column_keystrokes / total_keystrokes) × 100
                      </code>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold mb-2">center positions:</p>
                        <ul className="space-y-1 text-yellow-800 dark:text-yellow-300">
                          <li>• column 5: t, g, b positions (left index stretch)</li>
                          <li>• column 6: y, h, n positions (right index stretch)</li>
                          <li>• requires uncomfortable finger extension</li>
                          <li>• reduced accuracy and speed</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">optimization strategy:</p>
                        <ul className="space-y-1 text-yellow-800 dark:text-yellow-300">
                          <li>• place low-frequency letters in center</li>
                          <li>• avoid common characters like 'e', 't', 'a'</li>
                          <li>• consider punctuation or rare letters</li>
                          <li>• balance with overall layout efficiency</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">ergonomic considerations</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-300">
                      <div>
                        <p className="font-semibold mb-1">physical challenges:</p>
                        <ul className="space-y-1">
                          <li>• awkward index finger reach</li>
                          <li>• increased strain on hand position</li>
                          <li>• reduced typing accuracy</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">performance impact:</p>
                        <ul className="space-y-1">
                          <li>• slower key access time</li>
                          <li>• higher error probability</li>
                          <li>• disrupted typing rhythm</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">layout recommendations:</p>
                        <ul className="space-y-1">
                          <li>• &lt; 5%: excellent optimization</li>
                          <li>• 5-8%: acceptable usage</li>
                          <li>• &gt; 10%: requires optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row Jump Analysis */}
              <div id="row-jumps-detailed" className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <ArrowRight className="w-8 h-8 text-orange-600 dark:text-orange-400 transform rotate-90" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">two-row jumps</h3>
                      <p className="text-gray-600 dark:text-gray-400">large vertical finger movements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                      target: &lt; 8%
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  identifies bigrams requiring fingers to jump across two or more keyboard rows. large vertical 
                  movements slow typing speed, increase error rates, and disrupt typing flow by requiring 
                  significant hand repositioning and finger coordination.
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl">
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-4">detection algorithm</h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-lg mb-4">
                    <code className="text-orange-700 dark:text-orange-300">
                      if (|row1 - row2| ≥ 2) → two_row_jump++
                    </code>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">examples of problematic jumps:</p>
                      <ul className="space-y-1 text-orange-800 dark:text-orange-300">
                        <li>• top row to bottom row (q→z, p→/)</li>
                        <li>• number row to bottom row (1→z, 0→/)</li>
                        <li>• any jump skipping home row entirely</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">impact on performance:</p>
                      <ul className="space-y-1 text-orange-800 dark:text-orange-300">
                        <li>• 20-40% speed reduction for affected bigrams</li>
                        <li>• increased error probability</li>
                        <li>• disrupted hand position and flow</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'algorithms' && (
        <div className="space-y-8">
          {/* Algorithms Overview */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/10 rounded-3xl p-8 shadow-xl border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg">
                <Hash className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-1">
                  complete algorithms & formulas
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">mathematical foundations and computational methods</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-12 text-lg leading-relaxed">
              detailed documentation of every algorithm, formula, and computational method used in the layoutgod 
              analysis framework. includes mathematical derivations, implementation details, complexity analysis, 
              and optimization techniques for accurate and efficient keyboard layout evaluation.
            </p>
          </div>

          {/* Core Mathematical Formulas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              core mathematical formulations
            </h2>
            
            <div className="space-y-8">
              {/* Effort Calculation */}
              <div className="border-l-4 border-indigo-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">effort calculation matrix</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  the fundamental algorithm that quantifies physical typing strain by combining finger strength, 
                  key position difficulty, and character frequency analysis.
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-6">complete formula derivation</h4>
                  
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3">base effort calculation</h5>
                      <div className="font-mono text-lg text-indigo-700 dark:text-indigo-300 mb-4 overflow-x-auto">
                        E<sub>total</sub> = Σ<sub>i=1</sub><sup>n</sup> (E<sub>base</sub>[f<sub>i</sub>][r<sub>i</sub>] × F<sub>char</sub>[c<sub>i</sub>] × M<sub>position</sub>[c<sub>i</sub>])
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p><strong>E<sub>total</sub>:</strong> total layout effort score</p>
                        <p><strong>E<sub>base</sub>[f][r]:</strong> base effort for finger f on row r</p>
                        <p><strong>F<sub>char</sub>[c]:</strong> frequency of character c in corpus</p>
                        <p><strong>M<sub>position</sub>[c]:</strong> position difficulty multiplier</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">finger strength matrix</h5>
                        <div className="font-mono text-sm space-y-1">
                          <div className="grid grid-cols-4 gap-2 mb-2 font-bold">
                            <span>finger</span><span>row0</span><span>row1</span><span>row2</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
                            <span>lp(1)</span><span>4.2</span><span>3.5</span><span>2.4</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
                            <span>lr(2)</span><span>3.8</span><span>3.0</span><span>1.8</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
                            <span>lm(3)</span><span>3.5</span><span>2.7</span><span>1.6</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
                            <span>li(4)</span><span>3.3</span><span>2.5</span><span>1.4</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">position multipliers</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>home row (baseline):</span>
                            <span className="font-mono text-green-600">1.0x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>top row (reach up):</span>
                            <span className="font-mono text-yellow-600">1.3x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>bottom row (reach down):</span>
                            <span className="font-mono text-orange-600">1.2x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>center columns (t,g,y,h):</span>
                            <span className="font-mono text-red-600">1.4x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Calculation */}
              <div className="border-l-4 border-blue-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">euclidean distance modeling</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  precise geometric calculation of finger travel distances using accurate key coordinate mapping 
                  and weighted frequency analysis for realistic movement assessment.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6">distance calculation algorithm</h4>
                  
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3">weighted euclidean distance</h5>
                      <div className="font-mono text-lg text-blue-700 dark:text-blue-300 mb-4 overflow-x-auto">
                        D<sub>total</sub> = Σ<sub>i=1</sub><sup>n-1</sup> (√((x<sub>i+1</sub>-x<sub>i</sub>)² + (y<sub>i+1</sub>-y<sub>i</sub>)²) × F<sub>bigram</sub>[c<sub>i</sub>c<sub>i+1</sub>])
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p><strong>D<sub>total</sub>:</strong> total weighted finger travel distance</p>
                        <p><strong>(x<sub>i</sub>,y<sub>i</sub>):</strong> physical coordinates of key i in millimeters</p>
                        <p><strong>F<sub>bigram</sub>:</strong> frequency weight of character transition</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">key coordinate system</h5>
                        <div className="text-sm space-y-2">
                          <p><strong>origin:</strong> top-left key (`~) at (0,0)</p>
                          <p><strong>x-axis:</strong> horizontal, 19.05mm per column</p>
                          <p><strong>y-axis:</strong> vertical, 19.05mm per row</p>
                          <p><strong>precision:</strong> 0.01mm resolution</p>
                          <p><strong>stagger:</strong> accounting for qwerty row offset</p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">finger position tracking</h5>
                        <div className="font-mono text-xs space-y-1 text-gray-700 dark:text-gray-300">
                          <div>fingerpos[1] = [row, col]  // left pinky</div>
                          <div>fingerpos[2] = [row, col]  // left ring</div>
                          <div>fingerpos[3] = [row, col]  // left middle</div>
                          <div>fingerpos[4] = [row, col]  // left index</div>
                          <div>fingerpos[7] = [row, col]  // right index</div>
                          <div>fingerpos[8] = [row, col]  // right middle</div>
                          <div>fingerpos[9] = [row, col]  // right ring</div>
                          <div>fingerpos[10] = [row, col] // right pinky</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern Detection Algorithms */}
              <div className="border-l-4 border-green-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">advanced pattern detection</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  sophisticated algorithms that identify typing patterns including same finger bigrams, 
                  rolls, redirects, and other movement classifications crucial for layout evaluation.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-green-900 dark:text-green-200 mb-6">pattern classification algorithms</h4>
                  
                  <div className="space-y-8">
                    {/* Same Finger Bigram Detection */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-4">same finger bigram detection</h5>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                        <code className="text-green-700 dark:text-green-300">
                          function detectSFB(key1, key2) {`{`}<br/>
                          &nbsp;&nbsp;const pos1 = keyPositions[key1];<br/>
                          &nbsp;&nbsp;const pos2 = keyPositions[key2];<br/>
                          &nbsp;&nbsp;if (pos1.finger === pos2.finger && key1 !== key2) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;const rowDiff = Math.abs(pos1.row - pos2.row);<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;if (rowDiff &gt;= 2) return 'two_row_sfb';<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return 'same_finger_bigram';<br/>
                          &nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;return null;<br/>
                          {`}`}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        identifies consecutive letters using the same finger, with special classification 
                        for particularly problematic two-row jumps
                      </p>
                    </div>
                    
                    {/* Trigram Flow Classification */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-4">trigram flow classification</h5>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                        <code className="text-green-700 dark:text-green-300">
                          function classifyTrigram(key1, key2, key3) {`{`}<br/>
                          &nbsp;&nbsp;const [pos1, pos2, pos3] = [key1, key2, key3].map(k =&gt; keyPositions[k]);<br/>
                          &nbsp;&nbsp;const [hand1, hand2, hand3] = [pos1, pos2, pos3].map(p =&gt; getHand(p.finger));<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;// alternation pattern<br/>
                          &nbsp;&nbsp;if ((hand1 === 'left' && hand2 === 'right' && hand3 === 'left') ||<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(hand1 === 'right' && hand2 === 'left' && hand3 === 'right')) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return pos1.finger === pos3.finger ? 'alt_sfs' : 'alternation';<br/>
                          &nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;// roll patterns<br/>
                          &nbsp;&nbsp;if (hand1 === hand2 && hand2 === hand3) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;const direction = hand1 === 'left' ? 1 : -1;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;if ((pos2.finger - pos1.finger) * direction &gt; 0 &&<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(pos3.finger - pos2.finger) * direction &gt; 0) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 'roll_in';<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;{`}`} else if ((pos2.finger - pos1.finger) * direction &lt; 0 &&<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(pos3.finger - pos2.finger) * direction &lt; 0) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 'roll_out';<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;return 'other';<br/>
                          {`}`}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        comprehensive algorithm that classifies three-letter sequences into optimal and 
                        suboptimal typing flow patterns
                      </p>
                    </div>
                    
                    {/* Scissors Detection */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-4">scissors & lateral stretch detection</h5>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                        <code className="text-green-700 dark:text-green-300">
                          function detectScissors(key1, key2) {`{`}<br/>
                          &nbsp;&nbsp;const pos1 = keyPositions[key1];<br/>
                          &nbsp;&nbsp;const pos2 = keyPositions[key2];<br/>
                          &nbsp;&nbsp;const hand1 = getHand(pos1.finger);<br/>
                          &nbsp;&nbsp;const hand2 = getHand(pos2.finger);<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;// scissors: adjacent fingers, 2+ rows apart, same hand<br/>
                          &nbsp;&nbsp;if (hand1 === hand2 &&<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Math.abs(pos1.finger - pos2.finger) === 1 &&<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Math.abs(pos1.row - pos2.row) &gt;= 2) {`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;const isPinky = pos1.finger === 1 || pos1.finger === 10 ||<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos2.finger === 1 || pos2.finger === 10;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return isPinky ? 'pinky_scissors' : 'scissors';<br/>
                          &nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;// lateral stretch: index finger to outer columns<br/>
                          &nbsp;&nbsp;const isLateralStretch =<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;(pos1.col === 3 && pos2.col === 5) || (pos1.col === 8 && pos2.col === 6) ||<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;(pos1.col === 5 && pos2.col === 3) || (pos1.col === 6 && pos2.col === 8);<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;return isLateralStretch ? 'lateral_stretch' : null;<br/>
                          {`}`}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        identifies awkward finger movements that cause strain, with special attention to 
                        pinky-involved patterns and uncomfortable stretches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistical Processing */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              statistical processing & normalization
            </h2>
            
            <div className="space-y-8">
              {/* Frequency Weighting */}
              <div className="border-l-4 border-purple-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">frequency weighting methodology</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  advanced statistical processing that applies character and bigram frequency weights to ensure 
                  analysis results reflect real-world typing patterns rather than theoretical equal distributions.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-6">weighted aggregation formula</h4>
                  
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3">general weighted metric calculation</h5>
                      <div className="font-mono text-lg text-purple-700 dark:text-purple-300 mb-4 overflow-x-auto">
                        M<sub>weighted</sub> = (Σ<sub>i=1</sub><sup>n</sup> (V<sub>i</sub> × F<sub>i</sub>)) / (Σ<sub>i=1</sub><sup>n</sup> F<sub>i</sub>)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p><strong>M<sub>weighted</sub>:</strong> final weighted metric value</p>
                        <p><strong>V<sub>i</sub>:</strong> raw metric value for pattern i</p>
                        <p><strong>F<sub>i</sub>:</strong> frequency weight of pattern i</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">character frequencies (top 10)</h5>
                        <div className="font-mono text-sm space-y-1">
                          <div className="grid grid-cols-2 gap-4">
                            <span>e: 11.87%</span><span>t: 9.55%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>a: 7.47%</span><span>o: 7.66%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>i: 6.18%</span><span>n: 6.14%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>h: 6.52%</span><span>s: 5.57%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>r: 4.99%</span><span>l: 4.60%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">bigram frequencies (top 10)</h5>
                        <div className="font-mono text-sm space-y-1">
                          <div className="grid grid-cols-2 gap-4">
                            <span>th: 3.88%</span><span>he: 3.68%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>in: 2.28%</span><span>er: 2.18%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>an: 2.14%</span><span>re: 1.75%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>ed: 1.53%</span><span>nd: 1.52%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <span>ou: 1.29%</span><span>ea: 1.00%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Normalization Techniques */}
              <div className="border-l-4 border-blue-500 pl-8">
                <h3 className="text-xl font-semibent text-gray-900 dark:text-white mb-4">normalization & standardization</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  mathematical techniques used to convert raw measurements into standardized metrics that 
                  enable meaningful comparison across different keyboard layouts and typing contexts.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6">standardization methods</h4>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">percentage conversion</h5>
                        <div className="font-mono text-lg text-blue-700 dark:text-blue-300 mb-3">
                          percentage = (count / total_count) × 100
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          used for metrics like same finger bigrams, rolls, alternation 
                          to express as percentage of all possible occurrences
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">ratio calculation</h5>
                        <div className="font-mono text-lg text-blue-700 dark:text-blue-300 mb-3">
                          ratio = metric_value / total_characters
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          used for effort and distance metrics to express per-character values 
                          for layout-independent comparison
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">z-score normalization</h5>
                        <div className="font-mono text-lg text-blue-700 dark:text-blue-300 mb-3">
                          z = (x - μ) / σ
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          used for comparative analysis against database of known layouts 
                          to identify statistical outliers and ranking
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">min-max scaling</h5>
                        <div className="font-mono text-lg text-blue-700 dark:text-blue-300 mb-3">
                          scaled = (x - min) / (max - min)
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          used for recommendation scoring to normalize metrics 
                          to 0-1 scale for weighted combination
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'implementation' && (
        <div className="space-y-8">
          {/* Implementation Overview */}
          <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-3xl p-8 shadow-xl border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg">
                <Code className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight pb-1">
                  technical implementation
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">complete system architecture and codebase structure</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-12 text-lg leading-relaxed">
              comprehensive documentation of the complete technical implementation including system architecture, 
              database design, api endpoints, frontend components, performance optimizations, and deployment strategies 
              that power the layoutgod keyboard layout analysis platform.
            </p>
          </div>

          {/* System Architecture */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-600" />
              complete system architecture
            </h2>
            
            <div className="space-y-8">
              {/* Backend Architecture */}
              <div className="border-l-4 border-blue-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">backend architecture & analysis engines</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  node.js-based backend featuring multiple specialized analysis engines, comprehensive api layer, 
                  and optimized database integration for real-time layout evaluation and recommendation generation.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6">core backend components</h4>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-blue-600" />
                          analysis engines
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>advancedanalyzer.js:</strong> primary cyanophage-based analysis engine</li>
                          <li><strong>newlayoutanalyzer.js:</strong> optimized high-performance analyzer</li>
                          <li><strong>adaptivetestanalyzer.js:</strong> personalized testing framework</li>
                          <li><strong>layoutdescriptiongenerator.js:</strong> ai-powered recommendations</li>
                          <li><strong>textgenerator.js:</strong> intelligent content generation</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Database className="w-5 h-5 text-green-600" />
                          data layer
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>sqlite database:</strong> layout storage and statistics</li>
                          <li><strong>in-memory caching:</strong> performance optimization</li>
                          <li><strong>frequency tables:</strong> character and bigram data</li>
                          <li><strong>word corpora:</strong> text analysis datasets</li>
                          <li><strong>user sessions:</strong> adaptive test tracking</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          api layer
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>express.js server:</strong> robust http request handling</li>
                          <li><strong>rest api endpoints:</strong> layout crud operations</li>
                          <li><strong>websocket support:</strong> real-time analysis updates</li>
                          <li><strong>rate limiting:</strong> ddos protection and fair usage</li>
                          <li><strong>cors handling:</strong> secure cross-origin requests</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-orange-600" />
                          middleware & utilities
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>helmet.js:</strong> security headers and protection</li>
                          <li><strong>compression:</strong> response compression for speed</li>
                          <li><strong>error handling:</strong> comprehensive error management</li>
                          <li><strong>logging system:</strong> detailed request and error logs</li>
                          <li><strong>environment config:</strong> production/development settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Schema */}
              <div className="border-l-4 border-green-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">database schema & data modeling</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  comprehensive sqlite database design optimized for layout storage, statistical analysis, 
                  and user session management with proper indexing and relationship modeling.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-green-900 dark:text-green-200 mb-6">complete database schema</h4>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="space-y-4">
                        <div>
                          <div className="text-yellow-400 font-bold mb-2">-- layouts table</div>
                          <div>create table layouts (</div>
                          <div>&nbsp;&nbsp;id integer primary key autoincrement,</div>
                          <div>&nbsp;&nbsp;name text not null,</div>
                          <div>&nbsp;&nbsp;slug text unique not null,</div>
                          <div>&nbsp;&nbsp;type text not null,</div>
                          <div>&nbsp;&nbsp;description text,</div>
                          <div>&nbsp;&nbsp;visual_data json not null,</div>
                          <div>&nbsp;&nbsp;file_formats json,</div>
                          <div>&nbsp;&nbsp;created_at datetime default current_timestamp,</div>
                          <div>&nbsp;&nbsp;updated_at datetime default current_timestamp</div>
                          <div>);</div>
                        </div>
                        
                        <div>
                          <div className="text-yellow-400 font-bold mb-2">-- layout_stats table</div>
                          <div>create table layout_stats (</div>
                          <div>&nbsp;&nbsp;id integer primary key autoincrement,</div>
                          <div>&nbsp;&nbsp;layout_id integer not null,</div>
                          <div>&nbsp;&nbsp;effort real,</div>
                          <div>&nbsp;&nbsp;distance real,</div>
                          <div>&nbsp;&nbsp;pinky_distance real,</div>
                          <div>&nbsp;&nbsp;pinky_off_home_pct real,</div>
                          <div>&nbsp;&nbsp;same_finger_bigrams_pct real,</div>
                          <div>&nbsp;&nbsp;skip_bigrams_pct real,</div>
                          <div>&nbsp;&nbsp;lateral_stretch_pct real,</div>
                          <div>&nbsp;&nbsp;pinky_scissors_pct real,</div>
                          <div>&nbsp;&nbsp;trigram_alt_pct real,</div>
                          <div>&nbsp;&nbsp;roll_in_pct real,</div>
                          <div>&nbsp;&nbsp;roll_out_pct real,</div>
                          <div>&nbsp;&nbsp;-- ... all 17 metrics</div>
                          <div>&nbsp;&nbsp;foreign key (layout_id) references layouts(id)</div>
                          <div>);</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">additional tables</h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>typing_sessions:</strong> adaptive test user data</li>
                          <li><strong>adaptive_tests:</strong> multi-stage test results</li>
                          <li><strong>text_corpora:</strong> frequency analysis data</li>
                          <li><strong>bigram_frequencies:</strong> cached bigram statistics</li>
                          <li><strong>user_preferences:</strong> personalization settings</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h5 className="font-semibold mb-3">indexing strategy</h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li><strong>primary keys:</strong> btree indexes on all id fields</li>
                          <li><strong>unique indexes:</strong> layout slugs and names</li>
                          <li><strong>composite indexes:</strong> layout_id + metric combinations</li>
                          <li><strong>text indexes:</strong> full-text search on descriptions</li>
                          <li><strong>timestamp indexes:</strong> created_at for chronological queries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frontend Architecture */}
              <div className="border-l-4 border-purple-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">frontend architecture & components</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  modern react-based frontend with typescript, comprehensive component architecture, 
                  real-time analysis integration, and responsive design optimized for desktop and mobile.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-xl">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-6">frontend technology stack</h4>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Component className="w-5 h-5 text-blue-600" />
                        core framework
                      </h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li><strong>react 18:</strong> component-based ui architecture</li>
                        <li><strong>typescript:</strong> type-safe development</li>
                        <li><strong>react router:</strong> client-side navigation</li>
                        <li><strong>context api:</strong> state management</li>
                        <li><strong>custom hooks:</strong> reusable logic patterns</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        ui & styling
                      </h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li><strong>tailwind css:</strong> utility-first styling</li>
                        <li><strong>lucide icons:</strong> consistent iconography</li>
                        <li><strong>responsive design:</strong> mobile-first approach</li>
                        <li><strong>dark mode:</strong> system preference detection</li>
                        <li><strong>animations:</strong> smooth transitions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        data visualization
                      </h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li><strong>recharts:</strong> interactive chart components</li>
                        <li><strong>finger heatmaps:</strong> usage visualization</li>
                        <li><strong>metric dashboards:</strong> comprehensive analytics</li>
                        <li><strong>real-time updates:</strong> live analysis display</li>
                        <li><strong>export features:</strong> pdf and image generation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Component Architecture */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Puzzle className="w-8 h-8 text-indigo-600" />
              complete component architecture
            </h2>
            
            <div className="space-y-8">
              {/* Core Pages */}
              <div className="border-l-4 border-indigo-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">core page components</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  primary application pages that compose the user interface, each optimized for specific 
                  user workflows and integrated with the backend analysis systems.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">homepage.tsx</h4>
                      <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-1">
                        <li>• landing page with feature overview</li>
                        <li>• layout showcase and recommendations</li>
                        <li>• quick analysis entry point</li>
                        <li>• responsive hero sections</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">layoutlistpage.tsx</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• comprehensive layout database browser</li>
                        <li>• filtering and search capabilities</li>
                        <li>• sortable metric comparisons</li>
                        <li>• pagination and infinite scroll</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">layoutdetailpage.tsx</h4>
                      <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                        <li>• detailed single layout analysis</li>
                        <li>• comprehensive metric visualization</li>
                        <li>• keyboard visualization components</li>
                        <li>• recommendation and comparison features</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">designerpage.tsx</h4>
                      <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                        <li>• interactive layout editor interface</li>
                        <li>• real-time analysis feedback</li>
                        <li>• drag-and-drop key assignment</li>
                        <li>• live metric updates</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">typingtestpage.tsx</h4>
                      <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                        <li>• adaptive 5-stage testing framework</li>
                        <li>• real-time performance tracking</li>
                        <li>• weakness identification system</li>
                        <li>• personalized recommendations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-pink-50 dark:bg-pink-900/30 p-6 rounded-lg">
                      <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-3">recommendationspage.tsx</h4>
                      <ul className="text-sm text-pink-800 dark:text-pink-300 space-y-1">
                        <li>• intelligent layout recommendations</li>
                        <li>• user profile-based matching</li>
                        <li>• comparative analysis displays</li>
                        <li>• detailed justification explanations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Components */}
              <div className="border-l-4 border-green-500 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">analysis \u0026 visualization components</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  specialized components for displaying analysis results, keyboard visualizations, 
                  and interactive metric dashboards with real-time updates and comprehensive data presentation.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">layoutanalytics.tsx</h4>
                    <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                      <li>• comprehensive metric dashboard</li>
                      <li>• interactive chart components</li>
                      <li>• comparative analysis views</li>
                      <li>• exportable reports</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">keyboardvisualization.tsx</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• interactive keyboard renderer</li>
                      <li>• finger assignment visualization</li>
                      <li>• heatmap overlays</li>
                      <li>• customizable themes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">adaptivetypingtest.tsx</h4>
                    <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                      <li>• 5-stage adaptive testing</li>
                      <li>• real-time performance analysis</li>
                      <li>• dynamic text generation</li>
                      <li>• weakness profiling system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-orange-600" />
              complete api documentation
            </h2>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">core analysis endpoints</h3>
                  <div className="space-y-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-green-800 dark:text-green-300 mb-2">
                        post /api/analyze
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        primary layout analysis endpoint - processes layout data and returns comprehensive metrics
                      </p>
                    </div>
                    
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">
                        get /api/layouts
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        retrieve all layouts with filtering, search, pagination, and sorting capabilities
                      </p>
                    </div>
                    
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">
                        post /api/layouts
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-400">
                        create new layout with automatic analysis and statistics generation
                      </p>
                    </div>
                    
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                        get /api/layouts/:slug
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        retrieve specific layout by slug with full analysis data and recommendations
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">adaptive testing endpoints</h3>
                  <div className="space-y-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                        post /api/adaptive-test/start
                      </div>
                      <p className="text-xs text-indigo-700 dark:text-indigo-400">
                        initialize new 5-stage adaptive typing test session with baseline text generation
                      </p>
                    </div>
                    
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-pink-800 dark:text-pink-300 mb-2">
                        post /api/adaptive-test/submit
                      </div>
                      <p className="text-xs text-pink-700 dark:text-pink-400">
                        submit test stage results and receive next stage adaptive content
                      </p>
                    </div>
                    
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-teal-800 dark:text-teal-300 mb-2">
                        get /api/adaptive-test/results
                      </div>
                      <p className="text-xs text-teal-700 dark:text-teal-400">
                        retrieve comprehensive analysis and layout recommendations after completion
                      </p>
                    </div>
                    
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
                      <div className="font-mono text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
                        post /api/text-generator
                      </div>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        generate targeted text content based on user weakness profiles and test stage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            complete methodology documentation
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            this comprehensive documentation covers every aspect of the layoutgod keyboard layout analysis framework, 
            from mathematical foundations and algorithmic implementations to technical architecture and user interface design. 
            the methodology represents the culmination of advanced computational linguistics, biomechanical modeling, 
            statistical analysis, and software engineering to create the most sophisticated and accurate 
            keyboard layout evaluation system available.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>layoutgod comprehensive methodology documentation</p>
        <p>developed by rishik dulipyata • based on cyanophage analyzer methodology</p>
        <p>© 2024 all analysis algorithms and implementations</p>
      </div>
    </div>
  );
};

export default FullMethodology;
