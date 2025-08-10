import React, { useState } from 'react';
import { LayoutVisualData } from '../types';

type LayoutType = 'staggered';

interface KeyboardVisualizationProps {
  layoutData: LayoutVisualData;
  highlightedKeys?: string[];
  className?: string;
  onKeyHover?: (key: string) => void;
  showFingerColors?: boolean;
}

interface KeyProps {
  char: string;
  position: string;
  finger?: number;
  isHighlighted?: boolean;
  className?: string;
  onHover?: (key: string) => void;
  showFingerColors?: boolean;
}

const Key: React.FC<KeyProps> = ({ 
  char, 
  position, 
  finger = 0,
  isHighlighted = false, 
  className = "",
  onHover,
  showFingerColors = true
}) => {
  const getFingerColor = (finger: number) => {
    const colors = [
      'bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700', // LP (0)
      'bg-orange-200 dark:bg-orange-800 hover:bg-orange-300 dark:hover:bg-orange-700', // LR (1)
      'bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-700', // LM (2)
      'bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700', // LI (3)
      'bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-600', // RI (4)
      'bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-400 dark:hover:bg-yellow-600', // RM (5)
      'bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600', // RR (6)
      'bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600', // RP (7)
    ];
    return colors[finger] || 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600';
  };

  const getKeySize = (pos: string) => {
    // HHKB-specific key sizes
    if (pos === 'tab') return 'w-16';
    if (pos === 'ctrl') return 'w-18';
    if (pos === 'shift') return 'w-24';
    if (pos === 'shift-r') return 'w-20';
    if (pos === 'enter') return 'w-18';
    if (pos === 'space') return 'w-32';
    if (pos === 'backspace') return 'w-16';
    if (pos === 'meta-l' || pos === 'meta-r' || pos === 'alt-l' || pos === 'alt-r' || pos === 'fn') return 'w-12';
    return 'w-12';
  };

  return (
    <div
      className={`
        flex 
        items-center 
        justify-center 
        font-mono 
        text-sm 
        font-semibold
        text-gray-800 
        dark:text-gray-200
        cursor-pointer
        transition-all
        duration-150
        rounded-lg 
        border-2 
        border-gray-300
        dark:border-gray-600
        ${showFingerColors ? getFingerColor(finger) : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}
        ${isHighlighted ? 'ring-4 ring-purple-500 ring-opacity-50 scale-105' : ''}
        ${className}
      `}
      onMouseEnter={() => onHover?.(char)}
      title={`${char.toUpperCase()} - Finger ${finger + 1}`}
    >
      {char}
    </div>
  );
};

// Define finger assignments for keys (0-7 mapping to LP, LR, LM, LI, RI, RM, RR, RP)
const getFingerForKey = (key: string): number => {
  const fingerMap: { [key: string]: number } = {
    // Number row
    '`': 0, '1': 0, '2': 1, '3': 2, '4': 3, '5': 3, '6': 4, '7': 4, '8': 5, '9': 6, '0': 7, '-': 7, '=': 7,
    // Top row  
    'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 3, 'y': 4, 'u': 4, 'i': 5, 'o': 6, 'p': 7, '[': 7, ']': 7,
    // Home row
    'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 3, 'h': 4, 'j': 4, 'k': 5, 'l': 6, ';': 7, "'": 7,
    // Bottom row
    'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 3, 'n': 4, 'm': 4, ',': 5, '.': 6, '/': 7
  };
  return fingerMap[key.toLowerCase()] ?? 3;
};

const KeyboardVisualization: React.FC<KeyboardVisualizationProps> = ({
  layoutData,
  highlightedKeys = [],
  className = "",
  onKeyHover,
  showFingerColors = true
}) => {
  const [layoutType, setLayoutType] = useState<LayoutType>('staggered');
  const keys = layoutData.keys || {};

  const getFingerTextColor = (finger: number) => {
    const textColors = [
      'text-red-600 dark:text-red-400', // LP (0)
      'text-orange-600 dark:text-orange-400', // LR (1)
      'text-yellow-600 dark:text-yellow-400', // LM (2)
      'text-green-600 dark:text-green-400', // LI (3)
      'text-green-700 dark:text-green-300', // RI (4)
      'text-yellow-700 dark:text-yellow-300', // RM (5)
      'text-orange-700 dark:text-orange-300', // RR (6)
      'text-red-700 dark:text-red-300', // RP (7)
    ];
    return textColors[finger] || 'text-gray-600 dark:text-gray-400';
  };

  const generateTextVisualWithColors = (layoutKeys: Record<string, string>) => {
    const rows = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];
    
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="text-center">
        {row.map((key, keyIndex) => {
          const char = layoutKeys[key] || key;
          const isHighlighted = highlightedKeys.includes(key);
          const finger = getFingerForKey(key);
          const textColor = showFingerColors ? getFingerTextColor(finger) : 'text-gray-700 dark:text-gray-300';
          
          return (
            <span 
              key={keyIndex}
              className={`font-mono text-lg font-semibold px-1 ${
                isHighlighted 
                  ? 'bg-purple-500/30 ring-2 ring-purple-500 rounded'
                  : ''
              } ${textColor}`}
              title={`${key.toUpperCase()} → ${char} (Finger ${finger + 1})`}
            >
              {isHighlighted ? `[${char}]` : ` ${char} `}
            </span>
          );
        })}
      </div>
    ));
  };

  const renderStaggeredLayout = () => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
        <div className="leading-relaxed space-y-2">
          {generateTextVisualWithColors(keys)}
        </div>
      </div>
    </div>
  );



  const getCurrentLayout = () => {
    return renderStaggeredLayout();
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 ${className}`}>

      {/* Keyboard Layout */}
      <div className="keyboard-container flex justify-center">
        {getCurrentLayout()}
      </div>
      
      {/* Legend - 8 Main Fingers */}
      {showFingerColors && (
        <div className="mt-6">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Finger Assignment Legend</span>
          </div>
          
          {/* Finger color legend matching actual text colors used in visualizer */}
          <div className="flex justify-center gap-4 text-xs mb-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded"></div>
              <span>Left Pinky</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-600 dark:bg-orange-400 rounded"></div>
              <span>Left Ring</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-400 rounded"></div>
              <span>Left Middle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded"></div>
              <span>Left Index</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-700 dark:bg-green-300 rounded"></div>
              <span>Right Index</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-700 dark:bg-yellow-300 rounded"></div>
              <span>Right Middle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-700 dark:bg-orange-300 rounded"></div>
              <span>Right Ring</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-700 dark:bg-red-300 rounded"></div>
              <span>Right Pinky</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardVisualization;
