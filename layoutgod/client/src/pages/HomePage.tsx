import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Keyboard, 
  BarChart3, 
  Lightbulb, 
  Timer, 
  TrendingUp,
  Users,
  Zap,
  Shield,
  Github,
  Linkedin,
  Brain
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: 'Comprehensive Analysis',
      description: 'Analyze 17 key metrics including effort, distance, same-finger bigrams, and ergonomic factors.',
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />,
      title: 'Personalized Recommendations',
      description: 'Get layout suggestions tailored to your typing preferences and usage patterns.',
    },
    {
      icon: <Timer className="h-8 w-8 text-purple-600" />,
      title: 'Typing Tests',
      description: 'Measure your performance across different layouts and identify areas for improvement.',
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: 'Real-time Design',
      description: 'Create and modify keyboard layouts with instant analysis and live typing tests.',
    },
  ];

  const popularLayouts = [
    { name: 'QWERTY', effort: '1.832', sfb: '6.12%', description: 'The standard layout used worldwide.' },
    { name: 'Dvorak', effort: '1.261', sfb: '0.96%', description: 'Optimized for typing efficiency.' },
    { name: 'Colemak', effort: '1.208', sfb: '1.37%', description: 'Easy to learn, efficient alternative.' },
    { name: 'Colemak-DH', effort: '1.184', sfb: '1.25%', description: 'Improved version addressing center column issues.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Keyboard className="w-12 h-12 text-purple-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">
                layoutgod
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              The ultimate keyboard layout analyzer with scientific precision. 
              Compare layouts, get personalized recommendations, and optimize your typing experience.
            </p>
            <div className="text-sm text-purple-200 mb-8 flex items-center justify-center gap-4">
              <span>Designed and developed by <span className="font-semibold text-purple-100">Rishik Dulipyata</span></span>
              <div className="flex items-center gap-2">
                <a 
                  href="https://github.com/rishikdulipyataGH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-white transition-colors p-1"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/rishikdulipyata/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-white transition-colors p-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/adaptive-test"
                className="btn-primary text-lg px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Find Your Layout
              </Link>
              <Link
                to="/layouts"
                className="btn-primary text-lg px-8 py-3 bg-white text-purple-900 hover:bg-purple-50"
              >
                Explore Layouts
              </Link>
              <Link
                to="/designer"
                className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-900"
              >
                Design Your Own
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal pb-1 mb-4">
              Powerful Analysis Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A comprehensive suite of tools to help you understand and optimize 
              keyboard layouts for maximum efficiency and comfort.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="stats-card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="py-24 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal pb-1 mb-4">
              17 Key Metrics Analyzed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Analyzing every aspect of keyboard ergonomics and typing efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Effort & Distance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Total typing strain and finger travel distance over representative text.
              </p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Finger Balance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Pinky usage, off-home percentages, and finger-specific measurements.
              </p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Bigram Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Same-finger bigrams, skips, lateral stretches, and awkward movements.
              </p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Flow & Rhythm
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Hand alternation, rolls, redirects, and natural typing patterns.
              </p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ergonomic Factors
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Pinky scissors, two-row jumps, and difficult key combinations.
              </p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Key Distribution
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              Column usage patterns and hard-to-reach key percentages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Layouts */}
      <div className="py-24 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight pb-1">
              Popular Keyboard Layouts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore and compare the most widely used keyboard layouts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {popularLayouts.map((layout, index) => (
              <Link
                key={index}
                to={`/layouts/${encodeURIComponent(layout.name.toLowerCase())}`}
                className="stats-card hover:border-purple-300 dark:hover:border-purple-700 
                         transition-colors cursor-pointer group"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                               group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-2">
                    {layout.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                      Effort: {layout.effort}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                      SFB: {layout.sfb}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {layout.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/layouts"
              className="btn-primary text-lg px-8 py-3"
            >
              View All Layouts
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Typing?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Get personalized recommendations based on your typing habits and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recommendations"
              className="btn-primary text-lg px-8 py-3 bg-white text-purple-600 hover:bg-purple-50"
            >
              Get Recommendations
            </Link>
            <Link
              to="/typingod"
              className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Take Typing Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
