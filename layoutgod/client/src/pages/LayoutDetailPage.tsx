import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { LayoutWithStats, Recommendation } from '../types';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {error || 'Layout not found'}
          </h1>
          <p className="text-gray-300">
            The requested layout could not be loaded.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto p-4">
        {/* Header with layout info */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 leading-tight pb-1">
            {layout.name}
          </h1>
          <p 
            className="text-gray-600 dark:text-gray-300 mb-4"
            dangerouslySetInnerHTML={{ __html: renderFormattedText(layout.description) }}
          />
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm px-3 py-1 rounded-full">
              {layout.type}
            </span>
            {layout.source_url && (
              <a 
                href={layout.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors"
              >
                <ExternalLink size={14} />
                View Source
              </a>
            )}
          </div>
          
          {/* Test Layout Button */}
          <div className="flex justify-center">
            <button
              onClick={testLayout}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Play size={20} />
              Test This Layout
            </button>
          </div>
        </div>
        
        {/* Keyboard Visualization */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-300">Layout Preview</h4>
          </div>
          <KeyboardVisualization 
            layoutData={layout.visual_data}
            className="max-w-3xl mx-auto"
            showFingerColors={true}
          />
        </div>
        
        
        {/* Analytics Dashboard */}
        <LayoutAnalytics 
          layout={layout}
          className="max-w-full"
        />
      </div>
    </div>
  );
};

export default LayoutDetailPage;
