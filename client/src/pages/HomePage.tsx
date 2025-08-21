import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Keyboard, 
  BarChart3, 
  Lightbulb, 
  Timer, 
  Zap,
  Github,
  Linkedin,
  Brain
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      title: 'analysis',
      description: '27 metrics: effort, distance, bigrams, ergonomics',
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
      title: 'recommendations',
      description: 'personalized suggestions based on your typing',
    },
    {
      icon: <Timer className="h-6 w-6 text-purple-600" />,
      title: 'typing tests',
      description: 'measure performance and find improvements',
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: 'layout designer',
      description: 'create and modify layouts with instant analysis',
    },
  ];

  const popularLayouts = [
    { name: 'qwerty', effort: '1.832', sfb: '6.12%', description: 'standard layout' },
    { name: 'dvorak', effort: '1.261', sfb: '0.96%', description: 'optimized for efficiency' },
    { name: 'colemak', effort: '1.208', sfb: '1.37%', description: 'easy to learn alternative' },
    { name: 'colemak-dh', effort: '1.184', sfb: '1.25%', description: 'improved center column' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - elegant and minimal */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <Keyboard className="w-10 h-10 text-purple-400" />
              <h1 className="text-5xl font-bold gradient-text">
                layoutgod
              </h1>
            </div>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto font-light">
              the ultimate keyboard layout analyzer. compare, test, optimize.
            </p>
            <div className="text-xs text-gray-400 mb-8 flex items-center justify-center gap-3">
              <span>crafted by rishik dulipyata</span>
              <div className="flex items-center gap-2">
                <a 
                  href="https://github.com/rishikdulipyataGH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="github"
                >
                  <Github className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/rishikdulipyata/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="linkedin"
                >
                  <Linkedin className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/adaptive-test"
                className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                <span>find your layout</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </Link>
              <Link
                to="/layouts"
                className="px-8 py-3 bg-white/10 backdrop-blur text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-200 border border-white/20"
              >
                explore layouts
              </Link>
              <Link
                to="/designer"
                className="px-8 py-3 bg-transparent text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 border border-white/30"
              >
                design your own
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - elegant cards */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-3">
              powerful tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              everything you need to analyze and optimize keyboard layouts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700">
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-200">
                  {React.cloneElement(feature.icon, { className: "h-8 w-8 text-purple-600 dark:text-purple-400" })}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Overview - refined design */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-purple-pink mb-3">
              27 key metrics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              comprehensive analysis for every aspect of typing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  effort & distance
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                typing strain and finger travel
              </p>
            </div>
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  finger balance
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                pinky usage and off-home percentages
              </p>
            </div>
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  bigram analysis
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                same-finger patterns and stretches
              </p>
            </div>
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  flow & rhythm
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                alternation, rolls, and redirects
              </p>
            </div>
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  ergonomic factors
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                scissors and two-row jumps
              </p>
            </div>
            <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  key distribution
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                column usage patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Layouts - enhanced cards */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-3">
              popular layouts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              explore and compare the most widely used keyboard layouts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {popularLayouts.map((layout, index) => (
              <Link
                key={index}
                to={`/layouts/${encodeURIComponent(layout.name.toLowerCase())}`}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-bl-full"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-3">
                    {layout.name}
                  </h3>
                  <div className="flex gap-3 mb-3">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                      effort: {layout.effort}
                    </span>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                      sfb: {layout.sfb}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {layout.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/layouts"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              view all layouts →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section - elegant gradient */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ready to find your perfect layout?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            get personalized recommendations based on your typing style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recommendations"
              className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              get recommendations
            </Link>
            <Link
              to="/typingod"
              className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-lg font-medium transition-all duration-200"
            >
              take typing test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
