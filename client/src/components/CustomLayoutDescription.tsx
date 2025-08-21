import React, { useState } from 'react';
import { Lightbulb, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { renderFormattedText } from '../utils/textFormatting';

interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact?: string;
}

interface CustomLayoutDescriptionProps {
  layoutData: { keys: Record<string, string> };
  layoutName?: string;
  className?: string;
}

interface Weakness {
  metric: string;
  name: string;
  value: number;
  description: string;
}

interface DescriptionData {
  description: string;
  category: string;
  strengths: string[];
  weaknesses: (string | Weakness)[];
  recommendations: Recommendation[];
  overall_assessment: string;
}

const CustomLayoutDescription: React.FC<CustomLayoutDescriptionProps> = ({
  layoutData,
  layoutName = "Custom Layout",
  className = ""
}) => {
  const [descriptionData, setDescriptionData] = useState<DescriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = async () => {
    if (!layoutData?.keys || Object.keys(layoutData.keys).length === 0) {
      setError("no layout data available to analyze");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/layouts/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          layout_data: layoutData,
          layout_name: layoutName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDescriptionData({
          description: data.description || "No description generated",
          category: data.category || "Unknown",
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          recommendations: data.recommendations || [],
          overall_assessment: data.overall_assessment || "No assessment available"
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'failed to generate description');
      }
    } catch (err) {
      setError('network error: failed to connect to analysis service');
      console.error('Error generating description:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-bold gradient-text">
            custom layout analysis
          </h3>
        </div>
        <button
          onClick={generateDescription}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              analyzing...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              get analysis
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300 font-medium">analysis error</span>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {!descriptionData && !loading && !error && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            generate a comprehensive analysis of your custom layout
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            get detailed insights, strengths, weaknesses, and personalized recommendations
          </p>
        </div>
      )}

      {descriptionData && (
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold gradient-text mb-3">
              overview
            </h4>
            <p 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderFormattedText(descriptionData.description) }}
            />
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            {descriptionData.strengths.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                  ✅ strengths
                </h4>
                <ul className="space-y-2">
                  {descriptionData.strengths.map((strength, index) =>
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span 
                        className="text-gray-700 dark:text-gray-300 text-sm"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(strength) }}
                      />
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {descriptionData.weaknesses.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3">
                  ⚠️ areas for improvement
                </h4>
                <ul className="space-y-2">
                  {descriptionData.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span 
                        className="text-gray-700 dark:text-gray-300 text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: renderFormattedText(typeof weakness === 'string' ? weakness : weakness.description || weakness.name || 'Weakness identified') 
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {descriptionData.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold gradient-text mb-4">
                💡 optimization recommendations
              </h4>
              <div className="space-y-3">
                {descriptionData.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm">
                        {rec.category}
                      </h5>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                        {rec.priority}
                      </span>
                    </div>
                    <p 
                      className="text-sm leading-relaxed mb-2"
                      dangerouslySetInnerHTML={{ __html: renderFormattedText(rec.description) }}
                    />
                    {rec.impact && (
                      <p className="text-xs opacity-75">
                        <strong>expected impact:</strong> <span dangerouslySetInnerHTML={{ __html: renderFormattedText(rec.impact) }} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default CustomLayoutDescription;
