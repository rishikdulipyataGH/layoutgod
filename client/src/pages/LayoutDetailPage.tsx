import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { LayoutWithStats } from '../types';
import KeyboardVisualization from '../components/KeyboardVisualization';
import LayoutAnalytics from '../components/LayoutAnalytics';
import { renderFormattedText } from '../utils/textFormatting';

const LayoutDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [layout, setLayout] = useState<LayoutWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLayout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchLayout = async () => {
    try {
      console.log('Original slug from URL:', slug);
      const encodedSlug = encodeURIComponent(slug || '');
      console.log('Encoded slug:', encodedSlug);
      console.log('Making request to:', `/api/layouts/${encodedSlug}`);
      const response = await fetch(`/api/layouts/${encodedSlug}`);
      if (response.ok) {
        const data = await response.json();
        setLayout(data);
      } else {
        console.log('Response status:', response.status);
        setError('Layout not found');
      }
    } catch (error) {
      console.error('Error fetching layout:', error);
      setError('Failed to load layout');
    } finally {
      setLoading(false);
    }
  };

  // Test layout function
  const testLayout = () => {
    if (!layout) return;
    
    // Store the layout in sessionStorage for the typing test to use
    const layoutData = {
      name: layout.name,
      description: layout.description,
      layout: {
        keys: layout.visual_data.keys
      }
    };
    sessionStorage.setItem('testLayout', JSON.stringify(layoutData));
    
    // Navigate to typing test with layout parameter
    window.location.href = '/typingod?layout=custom';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text mb-4">
            {error?.toLowerCase() || 'layout not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            the requested layout could not be loaded.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-3">
              {layout.name.toLowerCase()}
            </h1>
            <p 
              className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm"
              dangerouslySetInnerHTML={{ __html: renderFormattedText(layout.description?.toLowerCase() || '') }}
            />
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur text-purple-300 text-xs rounded-full border border-purple-500/30">
                {layout.type.toLowerCase()}
              </span>
              {layout.source_url && (
                <a 
                  href={layout.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-300 hover:text-white text-xs transition-colors"
                >
                  <ExternalLink size={12} />
                  view source
                </a>
              )}
            </div>
            
            {/* Test Layout Button */}
            <button
              onClick={testLayout}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <Play size={18} />
              <span>test this layout</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Keyboard Visualization */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-purple-pink mb-2">layout preview</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">visual representation with finger assignments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <KeyboardVisualization 
              layoutData={layout.visual_data}
              className="max-w-4xl mx-auto"
              showFingerColors={true}
            />
          </div>
        </div>
        
        {/* Analytics Dashboard */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text mb-2">performance metrics</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">comprehensive analysis across 17 key indicators</p>
          </div>
          <LayoutAnalytics 
            layout={layout}
            className="max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutDetailPage;
