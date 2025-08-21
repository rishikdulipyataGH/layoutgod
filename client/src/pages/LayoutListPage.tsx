import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, ExternalLink } from 'lucide-react';
import { LayoutWithStats } from '../types';

const LayoutListPage: React.FC = () => {
  const [layouts, setLayouts] = useState<LayoutWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const response = await fetch('/api/layouts');
      if (response.ok) {
        const data = await response.json();
        setLayouts(data);
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLayouts = layouts.filter(layout => {
    const layoutName = layout.name || '';
    const layoutDescription = layout.description || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = layoutName.toLowerCase().includes(searchTermLower) ||
                         layoutDescription.toLowerCase().includes(searchTermLower);
    return matchesSearch;
  });

  const getMetricClass = (value: number | undefined, thresholds: { good: number; bad: number }, lowerIsBetter: boolean = true) => {
    if (value === undefined) return '';
    if (lowerIsBetter) {
      return value <= thresholds.good ? 'metric-good' : value >= thresholds.bad ? 'metric-bad' : 'metric-warning';
    } else {
      return value >= thresholds.good ? 'metric-good' : value <= thresholds.bad ? 'metric-bad' : 'metric-warning';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Grid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              layout gallery
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            explore and compare keyboard layouts with analysis metrics
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="search layouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>


          {/* View Mode */}
          <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
              } transition-colors`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-l border-gray-300 dark:border-dark-600 ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
              } transition-colors`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredLayouts.length} layout{filteredLayouts.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Layout Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLayouts.map((layout) => (
              <Link
                key={layout.id}
                to={`/layouts/${encodeURIComponent(layout.slug)}`}
                className="stats-card hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {layout.name?.toLowerCase() || layout.name}
                  </h3>
                </div>
                
                
                {layout.source_url && (
                  <div className="mb-4">
                    <a 
                      href={layout.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} />
                      source
                    </a>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">effort</span>
                    <div className={`font-medium text-sm ${getMetricClass(layout.effort, { good: 8.5, bad: 12.0 })}`}>
                      {layout.effort?.toFixed(2) || 'n/a'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">sfbs</span>
                    <div className={`font-medium text-sm ${getMetricClass(layout.same_finger_bigrams_pct, { good: 4.0, bad: 10.0 })}`}>
                      {layout.same_finger_bigrams_pct?.toFixed(1) + '%' || 'n/a'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">roll in</span>
                    <div className={`font-medium text-sm ${getMetricClass(layout.roll_in_pct, { good: 25, bad: 15 }, false)}`}>
                      {layout.roll_in_pct?.toFixed(1) + '%' || 'n/a'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">alt</span>
                    <div className={`font-medium text-sm ${getMetricClass(layout.trigram_alt_pct, { good: 35, bad: 25 }, false)}`}>
                      {layout.trigram_alt_pct?.toFixed(1) + '%' || 'n/a'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLayouts.map((layout) => (
              <Link
                key={layout.id}
                to={`/layouts/${encodeURIComponent(layout.slug)}`}
                className="stats-card hover:border-purple-300 dark:hover:border-purple-700 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {layout.name?.toLowerCase() || layout.name}
                      </h3>
                    </div>
                    {layout.source_url && (
                      <a 
                        href={layout.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        source
                      </a>
                    )}
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">effort</div>
                      <div className={`font-medium text-sm ${getMetricClass(layout.effort, { good: 8.5, bad: 12.0 })}`}>
                        {layout.effort?.toFixed(2) || 'n/a'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">sfbs</div>
                      <div className={`font-medium text-sm ${getMetricClass(layout.same_finger_bigrams_pct, { good: 4.0, bad: 10.0 })}`}>
                        {layout.same_finger_bigrams_pct?.toFixed(1) + '%' || 'n/a'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">roll in</div>
                      <div className={`font-medium text-sm ${getMetricClass(layout.roll_in_pct, { good: 25, bad: 15 }, false)}`}>
                        {layout.roll_in_pct?.toFixed(1) + '%' || 'n/a'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">alt</div>
                      <div className={`font-medium text-sm ${getMetricClass(layout.trigram_alt_pct, { good: 35, bad: 25 }, false)}`}>
                        {layout.trigram_alt_pct?.toFixed(1) + '%' || 'n/a'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredLayouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              no layouts found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutListPage;
