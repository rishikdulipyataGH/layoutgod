import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { LayoutWithStats } from '../types';
import { Info, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface LayoutAnalyticsProps {
  layout: LayoutWithStats;
  className?: string;
}

const LayoutAnalytics: React.FC<LayoutAnalyticsProps> = ({ layout, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'finger-usage' | 'bigrams' | 'trigrams'>('overview');

  // Finger usage data - only the 8 main fingers visible in the layout visualizer
  const fingerUsageData = [
    { 
      finger: 'LP', 
      name: 'left pinky', 
      fullName: 'left pinky finger',
      usage: layout.pinky_off_home_pct ? (100 - layout.pinky_off_home_pct) * 0.15 : 6.5, 
      effort: layout.pinky_distance ? layout.pinky_distance * 100 : 8.2,
      color: '#dc2626', // Red-600 for pinkies (weakest)
      position: 'Outer columns (Q, P, etc.)'
    },
    { 
      finger: 'LR', 
      name: 'left ring', 
      fullName: 'left ring finger',
      usage: 11.5, 
      effort: layout.lateral_stretch_pct ? layout.lateral_stretch_pct * 3 : 12.8,
      color: '#ea580c', // Orange-600 for ring fingers
      position: 'Second columns (W, O, etc.)'
    },
    { 
      finger: 'LM', 
      name: 'left middle', 
      fullName: 'left middle finger',
      usage: 14.2, 
      effort: 10.5,
      color: '#ca8a04', // Yellow-600 for middle fingers
      position: 'Third columns (E, I, etc.)'
    },
    { 
      finger: 'LI', 
      name: 'left index', 
      fullName: 'left index finger',
      usage: 18.7, 
      effort: 8.9,
      color: '#16a34a', // Green-600 for index fingers (strongest)
      position: 'Fourth columns (R, T, etc.)'
    },
    { 
      finger: 'RI', 
      name: 'right index', 
      fullName: 'right index finger',
      usage: 19.1, 
      effort: 9.2,
      color: '#16a34a', // Green-600 for index fingers (strongest)
      position: 'Fifth columns (Y, U, etc.)'
    },
    { 
      finger: 'RM', 
      name: 'right middle', 
      fullName: 'right middle finger',
      usage: 13.8, 
      effort: 11.1,
      color: '#ca8a04', // Yellow-600 for middle fingers
      position: 'Sixth columns (I, etc.)'
    },
    { 
      finger: 'RR', 
      name: 'right ring', 
      fullName: 'right ring finger',
      usage: 10.9, 
      effort: layout.lateral_stretch_pct ? layout.lateral_stretch_pct * 2.8 : 13.2,
      color: '#ea580c', // Orange-600 for ring fingers
      position: 'Seventh columns (O, etc.)'
    },
    { 
      finger: 'RP', 
      name: 'right pinky', 
      fullName: 'right pinky finger',
      usage: layout.pinky_off_home_pct ? (100 - layout.pinky_off_home_pct) * 0.12 : 5.3, 
      effort: layout.pinky_distance ? layout.pinky_distance * 80 : 7.8,
      color: '#dc2626', // Red-600 for pinkies (weakest)
      position: 'Rightmost columns (P, etc.)'
    }
  ];

  // Column usage with difficulty multipliers
  const columnUsageData = [
    { col: '0', name: 'Col 0', usage: 8.5, difficulty: 1.0, color: '#22c55e' },
    { col: '1', name: 'Col 1', usage: 12.2, difficulty: 1.0, color: '#22c55e' },
    { col: '2', name: 'Col 2', usage: 15.8, difficulty: 1.0, color: '#22c55e' },
    { col: '3', name: 'Col 3', usage: 18.4, difficulty: 1.1, color: '#84cc16' },
    { col: '4', name: 'Col 4 (T)', usage: layout.col5_6_pct ? layout.col5_6_pct / 2 : 7.2, difficulty: 1.4, color: '#ef4444' },
    { col: '5', name: 'Col 5 (Y)', usage: layout.col5_6_pct ? layout.col5_6_pct / 2 : 6.8, difficulty: 1.4, color: '#ef4444' },
    { col: '6', name: 'Col 6', usage: 16.1, difficulty: 1.1, color: '#84cc16' },
    { col: '7', name: 'Col 7', usage: 13.7, difficulty: 1.0, color: '#22c55e' },
    { col: '8', name: 'Col 8', usage: 10.4, difficulty: 1.0, color: '#22c55e' },
    { col: '9', name: 'Col 9', usage: 6.2, difficulty: 1.0, color: '#22c55e' }
  ];

  // Row usage with effort multipliers
  const rowUsageData = [
    { 
      row: 'top',
      usage: layout.two_row_jumps_pct ? Math.min(45, 25 + layout.two_row_jumps_pct) : 28, 
      effort: 1.3, 
      color: '#f97316' 
    },
    { 
      row: 'home',
      usage: layout.pinky_off_home_pct ? Math.max(45, 70 - layout.pinky_off_home_pct) : 58, 
      effort: 1.0, 
      color: '#22c55e' 
    },
    { 
      row: 'bottom',
      usage: layout.two_row_jumps_pct ? Math.min(25, 14 + layout.two_row_jumps_pct / 2) : 14, 
      effort: 1.2, 
      color: '#3b82f6' 
    }
  ];

  // Same finger bigrams data from reference
  const sameFigerBigramsData = [
    { bigram: 'rn', percentage: 0.08, count: '0.08%' },
    { bigram: 'sc', percentage: 0.066, count: '0.066%' },
    { bigram: 'au', percentage: 0.06, count: '0.06%' },
    { bigram: 'ua', percentage: 0.075, count: '0.075%' },
    { bigram: 'eo', percentage: 0.056, count: '0.056%' },
    { bigram: 'ri', percentage: 0.051, count: '0.051%' },
    { bigram: 'tw', percentage: 0.047, count: '0.047%' },
    { bigram: 'nt', percentage: 0.042, count: '0.042%' },
    { bigram: 'ls', percentage: 0.031, count: '0.031%' },
    { bigram: 'l', percentage: 0.026, count: '0.026%' },
    { bigram: 'yi', percentage: 0.025, count: '0.025%' }
  ];

  // Skip bigrams data
  const skipBigramsData = [
    { bigram: 'l_n', percentage: 0.187, count: '0.187%' },
    { bigram: 'n_l', percentage: 0.156, count: '0.156%' },
    { bigram: 'f_c', percentage: 0.085, count: '0.085%' },
    { bigram: 's_d', percentage: 0.069, count: '0.069%' },
    { bigram: 'v_d', percentage: 0.059, count: '0.059%' },
    { bigram: 'd_v', percentage: 0.033, count: '0.033%' },
    { bigram: 'g_n', percentage: 0.033, count: '0.033%' },
    { bigram: 'u_', percentage: 0.023, count: '0.023%' },
    { bigram: 'v_l', percentage: 0.013, count: '0.013%' },
    { bigram: 'c_f', percentage: 0.012, count: '0.012%' },
    { bigram: 'w_m', percentage: 0.01, count: '0.01%' }
  ];

  // Lateral stretch bigrams data
  const lateralStretchData = [
    { bigram: 'ng', percentage: 0.73, count: '0.73%' },
    { bigram: 'ex', percentage: 0.12, count: '0.12%' },
    { bigram: 'gr', percentage: 0.12, count: '0.12%' },
    { bigram: 'e,', percentage: 0.12, count: '0.12%' },
    { bigram: 'rg', percentage: 0.06, count: '0.06%' },
    { bigram: 'wn', percentage: 0.06, count: '0.06%' },
    { bigram: 'mn', percentage: 0.044, count: '0.044%' },
    { bigram: 'gn', percentage: 0.044, count: '0.044%' },
    { bigram: 'o,', percentage: 0.04, count: '0.04%' },
    { bigram: 'ze', percentage: 0.03, count: '0.03%' },
    { bigram: 'gl', percentage: 0.03, count: '0.03%' }
  ];

  // Scissors data
  const scissorsData = [
    { bigram: 'ld', percentage: 0.158, count: '0.158%' },
    { bigram: 'el', percentage: 0.114, count: '0.114%' },
    { bigram: 'nf', percentage: 0.037, count: '0.037%' },
    { bigram: 'dl', percentage: 0.022, count: '0.022%' },
    { bigram: 'o.', percentage: 0.014, count: '0.014%' },
    { bigram: 'nm', percentage: 0.013, count: '0.013%' },
    { bigram: 'lc', percentage: 0.009, count: '0.009%' },
    { bigram: 'o', percentage: 0.004, count: '0.004%' },
    { bigram: 'mn', percentage: 0.004, count: '0.004%' },
    { bigram: 'bc', percentage: 0.003, count: '0.003%' }
  ];

  // Actual trigram flow analysis based on layout metrics
  const trigramStats = [
    { 
      name: 'hand alternation',
      percentage: layout.trigram_alt_pct || 42.5, 
      color: '#3b82f6',
      description: 'L-R-L or R-L-R patterns'
    },
    { 
      name: 'inward rolls',
      percentage: layout.roll_in_pct || 18.2, 
      color: '#10b981',
      description: 'Natural finger flow toward center'
    },
    { 
      name: 'outward rolls',
      percentage: layout.roll_out_pct || 8.7, 
      color: '#22c55e',
      description: 'Finger flow away from center'
    },
    { 
      name: 'same hand same finger',
      percentage: layout.same_finger_bigrams_pct ? layout.same_finger_bigrams_pct * 2 : 3.2, 
      color: '#ef4444',
      description: 'Consecutive same finger usage'
    },
    { 
      name: 'redirects',
      percentage: layout.tri_redirect_pct || 12.8, 
      color: '#f97316',
      description: 'Direction changes in sequence'
    },
    { 
      name: 'same hand other',
      percentage: Math.max(0, 100 - (layout.trigram_alt_pct || 42.5) - (layout.roll_in_pct || 18.2) - (layout.roll_out_pct || 8.7) - (layout.same_finger_bigrams_pct ? layout.same_finger_bigrams_pct * 2 : 3.2) - (layout.tri_redirect_pct || 12.8)), 
      color: '#6b7280',
      description: 'Other same-hand patterns'
    }
  ];

  // Same hand strings data
  const sameHandStringsData = [
    { word: 'you', count: 664, hand: 1 },
    { word: 'equi', count: 500, hand: 2 },
    { word: 'nstr', count: 346, hand: 3 },
    { word: 'eque', count: 304, hand: 4 },
    { word: 'tary', count: 184, hand: 5 },
    { word: 'eque', count: 168, hand: 6 },
    { word: 'ique', count: 152, hand: 7 },
    { word: 'you', count: 128, hand: 8 },
    { word: 'oyee', count: 112, hand: 11 },
    { word: 'you', count: 92, hand: 13 },
    { word: 'ohio', count: 76, hand: 18 }
  ];

  // Hard words data
  const hardWordsData = [
    { word: 'sexual', score: 2.99 },
    { word: 'world', score: 2.23 },
    { word: 'oxygen', score: 2.57 },
    { word: 'exam', score: 1.69 },
    { word: 'jobs', score: 1.62 },
    { word: 'walks', score: 1.98 },
    { word: 'wrong', score: 1.95 },
    { word: 'exact', score: 1.93 },
    { word: 'worldwide', score: 3.46 },
    { word: 'exactly', score: 2.63 },
    { word: 'wild', score: 1.5 }
  ];

  const getMetricColor = (value: number | undefined, good: number, bad: number, lowerIsBetter: boolean) => {
    if (value === undefined) return 'text-gray-400';
    if (lowerIsBetter) {
      return value <= good ? 'text-green-500' : value >= bad ? 'text-red-500' : 'text-yellow-500';
    } else {
      return value >= good ? 'text-green-500' : value <= bad ? 'text-red-500' : 'text-yellow-500';
    }
  };

  const formatValue = (value: number | undefined, unit: string = '') => {
    if (value === undefined) return 'N/A';
    return `${unit === '%' ? value.toFixed(2) : value.toFixed(3)}${unit}`;
  };

  // Map metric names to their corresponding anchor IDs in the methodology page
  const getMetricAnchorId = (metricName: string): string => {
    const metricMap: { [key: string]: string } = {
      'Effort': 'effort-detailed',
      'Total Effort': 'effort-detailed',
      'Distance': 'distance-detailed',
      'Same Finger Bigrams': 'sfb-detailed',
      'Inward Rolls': 'roll-in-detailed',
      'Skip Bigrams 2u': 'skip-bigrams-detailed', // Updated to use the comprehensive skip bigrams section
      'Skip Bigrams': 'skip-bigrams-detailed', // All skip bigram variations go to the same comprehensive section
      'Lat Stretch Bigrams': 'scissors-detailed', // Under scissors & lateral stretches section
      'Lateral Stretch Bigrams': 'scissors-detailed',
      'Lateral Stretch': 'scissors-detailed',
      'Scissors': 'scissors-detailed',
      'Pinky Scissors': 'scissors-detailed',
      'Pinky Off-Home': 'pinky-off-home', // Dedicated section for pinky off-home usage
      'Two Row Jumps': 'row-jumps-detailed',
      'Trigram Alt': 'alternation-detailed',
      'Hand Alternation': 'alternation-detailed',
      'Redirects': 'tri-redirect-detailed', // Dedicated section for trigram redirects
      'Direction Changes': 'tri-redirect-detailed', // Also maps to trigram redirects
      'Roll Out': 'roll-out-detailed',
      'Outward Rolls': 'roll-out-detailed',
      'Column 5,6': 'center-columns-detailed',
      'Center Column Usage': 'center-columns-detailed',
      'Pinky Distance': 'pinky-distance-detailed',
      'Two Row SFB': 'skip-bigrams-detailed', // Two-row same finger falls under skip bigrams comprehensive section
      // Finger usage metrics
      'Finger Usage': 'pinky-distance-detailed', // Finger usage discussion is part of pinky metrics
      'Column Usage': 'center-columns-detailed', // Maps to center column usage discussion
      'Row Usage': 'row-jumps-detailed', // Related to row usage and jumps
      // Bigram metrics - all map to their specific comprehensive sections
      'Same Finger': 'sfb-detailed',
      // Trigram metrics  
      'Trigram Stats': 'alternation-detailed',
      'Same Hand Strings': 'alternation-detailed', // Related to hand patterns and alternation
      'Hard Words': 'sfb-detailed' // Related to typing difficulty from same finger patterns
    };
    
    return metricMap[metricName] || metricName.toLowerCase().replace(/[\s,]+/g, '-').replace(/[%&]/g, '');
  };

  const MetricTooltip = ({ metric, description }: { metric: string; description: string }) => {
    const anchorId = getMetricAnchorId(metric);
    
    return (
      <div className="group relative inline-block">
        <Link 
          to={`/methodology#${anchorId}`}
          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
          title={`Learn more about ${metric}`}
          onClick={() => {
            // Navigate to methodology page with anchor
            setTimeout(() => {
              const element = document.getElementById(anchorId);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 200); // Give more time for page navigation
          }}
        >
          <Info className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
        </Link>
        
        {/* Enhanced Tooltip */}
        <div className="invisible group-hover:visible absolute z-10 w-64 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg -top-2 -translate-y-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="font-semibold mb-1">{metric}</div>
          <div className="text-gray-300">{description || `Learn more about ${metric} in the methodology section.`}</div>
          <div className="text-purple-300 text-xs mt-1">Click to view detailed explanation →</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Statistics Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold gradient-text">layout analysis</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>total word effort: {layout.effort ? (layout.effort * 100).toFixed(1) : 'N/A'}</span>
            <span>•</span>
            <span>effort: {formatValue(layout.effort)}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            overview
          </button>
          <button
            onClick={() => setActiveTab('finger-usage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'finger-usage'
                ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            finger & usage
          </button>
          <button
            onClick={() => setActiveTab('bigrams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'bigrams'
                ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            bigrams
          </button>
          <button
            onClick={() => setActiveTab('trigrams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'trigrams'
                ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            trigrams
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Effort</span>
                  <MetricTooltip metric="Effort" description="Cumulative typing strain - lower is better." />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatValue(layout.effort)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {layout.effort && layout.effort < 8.5 ? 'Excellent' : layout.effort && layout.effort < 12.0 ? 'Good' : layout.effort && layout.effort < 15.0 ? 'Fair' : 'Poor'}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Distance</span>
                  <MetricTooltip metric="Distance" description="Average finger travel distance between keys." />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatValue(layout.distance)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {layout.distance && layout.distance < 18.0 ? 'Excellent' : layout.distance && layout.distance < 25.0 ? 'Good' : layout.distance && layout.distance < 30.0 ? 'Fair' : 'Poor'} travel
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">SFB</span>
                  <MetricTooltip metric="Same Finger Bigrams" description="Letter pairs using the same finger consecutively." />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatValue(layout.same_finger_bigrams_pct, '%')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {layout.same_finger_bigrams_pct && layout.same_finger_bigrams_pct < 4.0 ? 'Excellent' : layout.same_finger_bigrams_pct && layout.same_finger_bigrams_pct < 10.0 ? 'Good' : layout.same_finger_bigrams_pct && layout.same_finger_bigrams_pct < 15.0 ? 'Fair' : 'Poor'}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Inward Rolls</span>
                  <MetricTooltip metric="Inward Rolls" description="Natural finger sequences rolling toward center." />
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatValue(layout.roll_in_pct, '%')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {layout.roll_in_pct && layout.roll_in_pct >= 25 ? 'Excellent' : layout.roll_in_pct && layout.roll_in_pct >= 15 ? 'Good' : 'Fair'} flow
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  name: 'Pinky Distance', 
                  value: layout.pinky_distance, 
                  unit: '', 
                  description: 'Proportion of travel by pinkies (weakest fingers).',
                  good: 0.15, bad: 0.25, lowerIsBetter: true
                },
                { 
                  name: 'Skip Bigrams', 
                  value: layout.skip_bigrams_pct, 
                  unit: '%', 
                  description: 'Adjacent keys skipped on same row.',
                  good: 3, bad: 6, lowerIsBetter: true
                },
                { 
                  name: 'Skip Bigrams 2u', 
                  value: layout.skip_bigrams2_pct, 
                  unit: '%', 
                  description: 'Skipping two keys on same row (3-key gap).',
                  good: 1, bad: 3, lowerIsBetter: true
                },
                { 
                  name: 'Lat Stretch Bigrams', 
                  value: layout.lateral_stretch_pct, 
                  unit: '%', 
                  description: 'Awkward sideways finger stretches within same hand.',
                  good: 3, bad: 5, lowerIsBetter: true
                },
                { 
                  name: 'Scissors', 
                  value: layout.pinky_scissors_pct, 
                  unit: '%', 
                  description: 'Pinky-ring finger crossing movements.',
                  good: 0.5, bad: 2, lowerIsBetter: true
                },
                { 
                  name: 'Two Row SFB', 
                  value: layout.two_row_sfb_pct, 
                  unit: '%', 
                  description: 'Same finger bigrams requiring 2+ row jumps.',
                  good: 5, bad: 15, lowerIsBetter: true
                },
                { 
                  name: 'Pinky Off-Home', 
                  value: layout.pinky_off_home_pct, 
                  unit: '%', 
                  description: 'Pinky keystrokes away from home row.',
                  good: 30, bad: 50, lowerIsBetter: true
                },
                { 
                  name: 'Two Row Jumps', 
                  value: layout.two_row_jumps_pct, 
                  unit: '%', 
                  description: 'Bigrams requiring 2+ row vertical movements.',
                  good: 8, bad: 15, lowerIsBetter: true
                },
                { 
                  name: 'Trigram Alt', 
                  value: layout.trigram_alt_pct, 
                  unit: '%', 
                  description: 'Three-letter sequences alternating hands (L-R-L).',
                  good: 35, bad: 25, lowerIsBetter: false
                },
                { 
                  name: 'Redirects', 
                  value: layout.tri_redirect_pct, 
                  unit: '%', 
                  description: 'Three-letter patterns with awkward direction changes.',
                  good: 10, bad: 20, lowerIsBetter: true
                },
                { 
                  name: 'Roll Out', 
                  value: layout.roll_out_pct, 
                  unit: '%', 
                  description: 'Finger movements rolling away from center.',
                  good: 25, bad: 15, lowerIsBetter: false
                },
                { 
                  name: 'Column 5,6', 
                  value: layout.col5_6_pct, 
                  unit: '%', 
                  description: 'Usage of hard-to-reach center columns (T, Y).',
                  good: 8, bad: 15, lowerIsBetter: true
                }
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-default">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{metric.name}</span>
                    <MetricTooltip metric={metric.name} description={metric.description} />
                  </div>
                  <div className={`text-lg font-bold ${getMetricColor(metric.value, metric.good, metric.bad, metric.lowerIsBetter)}`}>
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metric.value !== undefined ? (
                      metric.lowerIsBetter ? 
                        (metric.value <= metric.good ? 'Excellent' : metric.value >= metric.bad ? 'Poor' : 'Good')
                        : (metric.value >= metric.good ? 'Excellent' : metric.value <= metric.bad ? 'Poor' : 'Good')
                    ) : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finger Usage Tab */}
        {activeTab === 'finger-usage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Finger Load Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  finger load & effort
                  <MetricTooltip metric="Finger Usage" description="Distribution of keystrokes across all fingers." />
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fingerUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="finger" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: any, name: any) => {
                          const isUsage = name === 'usage';
                          return [
                            `${typeof value === 'number' ? value.toFixed(1) : value}${isUsage ? '%' : ' pts'}`, 
                            isUsage ? 'keystroke usage' : 'effort score'
                          ];
                        }}
                        labelFormatter={(label: any) => {
                          const fingerData = fingerUsageData.find(f => f.finger === label);
                          return fingerData ? `${fingerData.fullName} • ${fingerData.position}` : label;
                        }}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          color: '#f9fafb'
                        }}
                        labelStyle={{
                          color: '#e5e7eb',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                        itemStyle={{
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                      <Bar dataKey="usage" name="usage" fill="#8b5cf6" />
                      <Bar dataKey="effort" name="effort" fill="#a78bfa" fillOpacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-4">
                  {fingerUsageData.map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[80px] flex flex-col justify-between">
                      <div className="text-center mb-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.fullName}</span>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="font-medium text-gray-700 dark:text-gray-300 text-sm">{item.usage.toFixed(1)}%</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{item.effort.toFixed(0)} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column Difficulty Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  column usage vs difficulty
                  <MetricTooltip metric="Column Usage" description="Usage by column with difficulty multipliers." />
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={columnUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }} 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: any, name: any) => {
                          const isUsage = name === 'usage';
                          if (isUsage) {
                            return [
                              `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                              'keystroke usage'
                            ];
                          }
                          return [`${value}x`, 'difficulty multiplier'];
                        }}
                        labelFormatter={(label: any) => {
                          const colData = columnUsageData.find(c => c.name === label);
                          return colData ? `${colData.name} - difficulty: ${colData.difficulty}x` : label;
                        }}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          color: '#f9fafb'
                        }}
                        labelStyle={{
                          color: '#e5e7eb',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                        itemStyle={{
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                      <Bar dataKey="usage">
                        {columnUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>normal (1.0x)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-lime-400 rounded"></div>
                    <span>moderate (1.1x)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>difficult (1.4x)</span>
                  </div>
                </div>
              </div>

              {/* Row Ergonomics Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  row usage & ergonomics
                  <MetricTooltip metric="Row Usage" description="Row distribution with effort multipliers." />
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={rowUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="usage"
                      >
                        {rowUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any, props: any) => {
                          const rowData = props.payload;
                          return [
                            `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                            `${rowData?.row || 'row'} usage`
                          ];
                        }}
                        labelFormatter={(label: any, payload: any) => {
                          const rowData = payload?.[0]?.payload;
                          return rowData ? `${rowData.row} row (${rowData.effort}x effort multiplier)` : label;
                        }}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          color: '#f9fafb'
                        }}
                        labelStyle={{
                          color: '#e5e7eb',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                        itemStyle={{
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-sm mt-3">
                  {rowUsageData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium">{item.row} row</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({item.effort}x effort)</span>
                      </div>
                      <span className="font-semibold">{item.usage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bigrams Tab */}
        {activeTab === 'bigrams' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Same Finger Bigrams */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  same finger bigrams - {formatValue(layout.same_finger_bigrams_pct, '%')}
                  <MetricTooltip metric="Same Finger Bigrams" description="Letter pairs using same finger consecutively." />
                </h3>
                <div className="space-y-1 text-xs">
                  {sameFigerBigramsData.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 rounded">{item.bigram}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skip Bigrams */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  skip bigrams 2u - {formatValue(layout.skip_bigrams2_pct, '%')}
                  <MetricTooltip metric="Skip Bigrams" description="Movements skipping two keys on same row." />
                </h3>
                <div className="space-y-1 text-xs">
                  {skipBigramsData.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono bg-orange-100 dark:bg-orange-900/50 px-1 rounded">{item.bigram}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lateral Stretch */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  lat stretch bigrams - {formatValue(layout.lateral_stretch_pct, '%')}
                  <MetricTooltip metric="Lateral Stretch" description="Uncomfortable stretching motions within same hand." />
                </h3>
                <div className="space-y-1 text-xs">
                  {lateralStretchData.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">{item.bigram}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scissors */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  scissors - {formatValue(layout.pinky_scissors_pct, '%')}
                  <MetricTooltip metric="Scissors" description="Pinky-ring finger crossing movements." />
                </h3>
                <div className="space-y-1 text-xs">
                  {scissorsData.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono bg-red-100 dark:bg-red-900/50 px-1 rounded">{item.bigram}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trigrams Tab */}
        {activeTab === 'trigrams' && (
          <div className="space-y-6">
            {/* Flow Quality Analysis */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                typing flow analysis
                <MetricTooltip metric="Trigram Stats" description="Analysis of typing flow patterns and sequences." />
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{(layout.trigram_alt_pct || 42.5).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">hand alternation</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">l-r-l patterns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(layout.roll_in_pct || 18.2).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">inward rolls</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">natural flow</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{(layout.tri_redirect_pct || 12.8).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">redirects</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">direction changes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{(layout.same_finger_bigrams_pct ? layout.same_finger_bigrams_pct * 2 : 3.2).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">same finger</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">worst pattern</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trigram Flow Breakdown */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  flow pattern distribution
                  <MetricTooltip metric="Trigram Stats" description="Breakdown of trigram patterns by type." />
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trigramStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="percentage"
                      >
                        {trigramStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any, props: any) => {
                          const patternData = props.payload;
                          return [
                            `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                            patternData?.name || 'flow pattern'
                          ];
                        }}
                        labelFormatter={(label: any, payload: any) => {
                          const patternData = payload?.[0]?.payload;
                          return patternData ? `${patternData.name}: ${patternData.description}` : label;
                        }}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          color: '#f9fafb',
                          maxWidth: '280px'
                        }}
                        labelStyle={{
                          color: '#e5e7eb',
                          fontWeight: '600',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}
                        itemStyle={{
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                  {trigramStats.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Same Hand Strings & Hard Words */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    same hand strings
                    <MetricTooltip metric="Same Hand Strings" description="Word sequences typed with same hand." />
                  </h3>
                  <div className="space-y-1 text-xs">
                    {sameHandStringsData.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-mono bg-purple-100 dark:bg-purple-900/50 px-1 rounded">{item.word}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                          <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">{item.hand}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    hard words
                    <MetricTooltip metric="Hard Words" description="Words with high typing difficulty scores." />
                  </h3>
                  <div className="space-y-1 text-xs">
                    {hardWordsData.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-mono bg-red-100 dark:bg-red-900/50 px-1 rounded">{item.word}</span>
                        <span className="text-gray-600 dark:text-gray-400">{item.score.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutAnalytics;
