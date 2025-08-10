import React, { useState, useEffect } from 'react';
import { Settings, Upload, Download, RotateCcw, Search } from 'lucide-react';
import CustomLayoutDescription from '../components/CustomLayoutDescription';
import { renderFormattedText } from '../utils/textFormatting';

interface LayoutStats {
  effort: number;
  distance: number;
  same_finger_bigrams_pct: number;
  roll_in_pct: number;
  roll_out_pct: number;
  trigram_alt_pct: number;
  pinky_distance?: number;
  pinky_off_home_pct?: number;
  skip_bigrams_pct?: number;
  skip_bigrams2_pct?: number;
  lateral_stretch_pct?: number;
  pinky_scissors_pct?: number;
  two_row_sfb_pct?: number;
  two_row_jumps_pct?: number;
  tri_redirect_pct?: number;
  col5_6_pct?: number;
  live_recommendations?: string[];
}

const DesignerPage: React.FC = () => {
  const [textContent, setTextContent] = useState('` 1 2 3 4 5 6 7 8 9 0 - =\nq w e r t y u i o p [ ]\na s d f g h j k l ; \'\nz x c v b n m , . /');
  const [currentLayout, setCurrentLayout] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<LayoutStats | null>(null);
  const [showFingerColors, setShowFingerColors] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [availableLayouts, setAvailableLayouts] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loadingLayouts, setLoadingLayouts] = useState(false);
  const [currentLayoutName, setCurrentLayoutName] = useState('QWERTY (Default)');
  const [originalLayoutName, setOriginalLayoutName] = useState('QWERTY (Default)');
  const [originalLayout, setOriginalLayout] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Finger color mapping (consistent with KeyboardVisualization)
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

  // Finger mapping for standard QWERTY positions (consistent with KeyboardVisualization)
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

  // Parse text content into layout object
  const parseTextToLayout = (text: string): Record<string, string> => {
    const lines = text.split('\n');
    const layout: Record<string, string> = {};
    
    const keyPositions = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];
    
    lines.forEach((line, rowIndex) => {
      if (rowIndex < keyPositions.length) {
        const chars = line.trim().split(/\s+/).filter(char => char);
        const positions = keyPositions[rowIndex];
        
        chars.forEach((char, charIndex) => {
          if (charIndex < positions.length) {
            layout[positions[charIndex]] = char;
          }
        });
      }
    });
    
    return layout;
  };

  // Analyze layout function using advanced cyanophage-based analysis
  const analyzeLayout = async (layout: Record<string, string>) => {
    if (Object.keys(layout).length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ layout_data: { keys: layout } }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analysis result:', data); // Debug log
        
        // Parse all available metrics from backend
        setStats({
          effort: parseFloat(data.effort) || 0,
          distance: parseFloat(data.distance) || 0,
          same_finger_bigrams_pct: parseFloat(data.same_finger_bigrams_pct) || 0,
          roll_in_pct: parseFloat(data.roll_in_pct) || 0,
          roll_out_pct: parseFloat(data.roll_out_pct) || 0,
          trigram_alt_pct: parseFloat(data.trigram_alt_pct) || 0,
          pinky_distance: parseFloat(data.pinky_distance) || 0,
          pinky_off_home_pct: parseFloat(data.pinky_off_home_pct) || 0,
          skip_bigrams_pct: parseFloat(data.skip_bigrams_pct) || 0,
          skip_bigrams2_pct: parseFloat(data.skip_bigrams2_pct) || 0,
          lateral_stretch_pct: parseFloat(data.lateral_stretch_pct) || 0,
          pinky_scissors_pct: parseFloat(data.pinky_scissors_pct) || 0,
          two_row_sfb_pct: parseFloat(data.two_row_sfb_pct) || 0,
          two_row_jumps_pct: parseFloat(data.two_row_jumps_pct) || 0,
          tri_redirect_pct: parseFloat(data.tri_redirect_pct) || 0,
          col5_6_pct: parseFloat(data.col5_6_pct) || 0,
          live_recommendations: data.live_recommendations || []
        });
      } else {
        console.error('Analysis API error:', response.status, response.statusText);
        // Set stats to null to indicate no analysis available
        setStats(null);
      }
    } catch (error) {
      console.error('Error analyzing layout:', error);
      // Set stats to null to indicate analysis failed
      setStats(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  };

  // Load available layouts for import
  const loadAvailableLayouts = async () => {
    setLoadingLayouts(true);
    try {
      const response = await fetch('/api/layouts?limit=100');
      if (response.ok) {
        const layouts = await response.json();
        setAvailableLayouts(layouts);
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    } finally {
      setLoadingLayouts(false);
    }
  };

  // Convert layout keys to text format
  const layoutToText = (layoutKeys: Record<string, string>): string => {
    const rows = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];

    return rows.map(row => 
      row.map(key => layoutKeys[key] || key).join(' ')
    ).join('\n');
  };

  // Check if layouts are equal
  const layoutsAreEqual = (layout1: Record<string, string>, layout2: Record<string, string>): boolean => {
    // Get all possible key positions
    const allKeys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
                     'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                     'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'",
                     'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];
    
    // Compare each key position, treating missing keys as the key itself
    for (const key of allKeys) {
      const char1 = layout1[key] || key;
      const char2 = layout2[key] || key;
      if (char1 !== char2) {
        return false;
      }
    }
    
    return true;
  };

  // Import selected layout
  const importLayout = (layout: any) => {
    const layoutKeys = layout.visual_data?.keys || {};
    const newTextContent = layoutToText(layoutKeys);
    setTextContent(newTextContent);
    setCurrentLayoutName(layout.name);
    setOriginalLayoutName(layout.name);
    setOriginalLayout(layoutKeys);
    setShowImportModal(false);
  };

  // Reset to QWERTY default
  const resetToQwerty = () => {
    const qwertyText = '` 1 2 3 4 5 6 7 8 9 0 - =\nq w e r t y u i o p [ ]\na s d f g h j k l ; \'\nz x c v b n m , . /';
    const qwertyLayout = parseTextToLayout(qwertyText);
    setTextContent(qwertyText);
    setCurrentLayoutName('QWERTY (Default)');
    setOriginalLayoutName('QWERTY (Default)');
    setOriginalLayout(qwertyLayout);
  };

  // Export layout functions
  const exportLayoutJSON = () => {
    const layoutData = {
      name: currentLayoutName,
      keys: currentLayout,
      textFormat: textContent,
      stats: stats,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(layoutData, null, 2);
    downloadFile(dataStr, `${sanitizeFilename(currentLayoutName)}_layout.json`, 'application/json');
    setShowExportMenu(false);
  };

  // Generate KLC (Microsoft Keyboard Layout Creator) format
  const exportLayoutKLC = () => {
    const sanitizedName = sanitizeFilename(currentLayoutName);
    const klcContent = generateKLCContent(currentLayout, currentLayoutName);
    downloadFile(klcContent, `${sanitizedName}.klc`, 'text/plain');
    setShowExportMenu(false);
  };

  // Generate XKB (X Keyboard Extension) format  
  const exportLayoutXKB = () => {
    const sanitizedName = sanitizeFilename(currentLayoutName);
    const xkbContent = generateXKBContent(currentLayout, currentLayoutName);
    downloadFile(xkbContent, `${sanitizedName}.xkb`, 'text/plain');
    setShowExportMenu(false);
  };

  // Utility functions for export
  const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const dataBlob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate KLC format content
  const generateKLCContent = (layout: Record<string, string>, layoutName: string): string => {
    const klcHeader = `KBD\t${sanitizeFilename(layoutName).toUpperCase()}\t"${layoutName}"\n\n`;
    
    const copyrightSection = `COPYRIGHT\t"(c) ${new Date().getFullYear()} Generated by layoutgod"\n\n`;
    
    const companySection = `COMPANY\t"layoutgod"\n\n`;
    
    const localeSection = `LOCALENAME\t"en-US"\n\n`;
    
    const versionSection = `VERSION\t1.0\n\n`;
    
    // KLC scan code to key mapping
    const scancodeMap: { [key: string]: string } = {
      '`': '29', '1': '02', '2': '03', '3': '04', '4': '05', '5': '06',
      '6': '07', '7': '08', '8': '09', '9': '0a', '0': '0b', '-': '0c', '=': '0d',
      'q': '10', 'w': '11', 'e': '12', 'r': '13', 't': '14', 'y': '15',
      'u': '16', 'i': '17', 'o': '18', 'p': '19', '[': '1a', ']': '1b',
      'a': '1e', 's': '1f', 'd': '20', 'f': '21', 'g': '22', 'h': '23',
      'j': '24', 'k': '25', 'l': '26', ';': '27', "'": '28',
      'z': '2c', 'x': '2d', 'c': '2e', 'v': '2f', 'b': '30', 'n': '31',
      'm': '32', ',': '33', '.': '34', '/': '35'
    };

    let layoutSection = 'LAYOUT\n\n//SC\tVK_\t\tCap\tSc0\tSc1\tSc2\tSc3\n';
    
    Object.entries(scancodeMap).forEach(([key, scancode]) => {
      const char = layout[key] || key;
      const charCode = char.charCodeAt(0).toString(16).padStart(4, '0');
      const upperChar = char.toUpperCase();
      const upperCode = upperChar.charCodeAt(0).toString(16).padStart(4, '0');
      
      layoutSection += `${scancode}\tT\t\t0\t${charCode}\t${upperCode}\t-1\t\t-1\t\t// ${key.toUpperCase()} -> ${char}\n`;
    });

    layoutSection += '\nDESCRIPTIONS\n\n';
    layoutSection += `0409\t${layoutName}\n\n`;
    
    layoutSection += 'LANGUAGENAMES\n\n';
    layoutSection += '0409\tEnglish (United States)\n\n';
    
    layoutSection += 'ENDKBD\n';

    return klcHeader + copyrightSection + companySection + localeSection + versionSection + layoutSection;
  };

  // Generate XKB format content
  const generateXKBContent = (layout: Record<string, string>, layoutName: string): string => {
    const sanitizedName = sanitizeFilename(layoutName);
    
    let xkbContent = `// Generated XKB layout for ${layoutName}\n`;
    xkbContent += `// Created by layoutgod on ${new Date().toISOString()}\n\n`;
    
    xkbContent += `partial alphanumeric_keys\n`;
    xkbContent += `xkb_symbols "${sanitizedName}" {\n\n`;
    xkbContent += `    name[Group1]="${layoutName}";\n\n`;
    
    // XKB key mappings
    const xkbKeyMap: { [key: string]: string } = {
      '`': 'TLDE', '1': 'AE01', '2': 'AE02', '3': 'AE03', '4': 'AE04', '5': 'AE05',
      '6': 'AE06', '7': 'AE07', '8': 'AE08', '9': 'AE09', '0': 'AE10', '-': 'AE11', '=': 'AE12',
      'q': 'AD01', 'w': 'AD02', 'e': 'AD03', 'r': 'AD04', 't': 'AD05', 'y': 'AD06',
      'u': 'AD07', 'i': 'AD08', 'o': 'AD09', 'p': 'AD10', '[': 'AD11', ']': 'AD12',
      'a': 'AC01', 's': 'AC02', 'd': 'AC03', 'f': 'AC04', 'g': 'AC05', 'h': 'AC06',
      'j': 'AC07', 'k': 'AC08', 'l': 'AC09', ';': 'AC10', "'": 'AC11',
      'z': 'AB01', 'x': 'AB02', 'c': 'AB03', 'v': 'AB04', 'b': 'AB05', 'n': 'AB06',
      'm': 'AB07', ',': 'AB08', '.': 'AB09', '/': 'AB10'
    };

    Object.entries(xkbKeyMap).forEach(([key, xkbKey]) => {
      const char = layout[key] || key;
      const upperChar = char.toUpperCase();
      
      // Handle special characters that need escaping or special treatment
      let keySymbol = char;
      let upperSymbol = upperChar;
      
      // Map common special characters to XKB symbols
      const symbolMap: { [key: string]: string } = {
        ' ': 'space',
        "'": 'apostrophe',
        '"': 'quotedbl',
        ';': 'semicolon',
        ':': 'colon',
        ',': 'comma',
        '.': 'period',
        '/': 'slash',
        '\\': 'backslash',
        '[': 'bracketleft',
        ']': 'bracketright',
        '{': 'braceleft',
        '}': 'braceright',
        '`': 'grave',
        '~': 'asciitilde',
        '!': 'exclam',
        '@': 'at',
        '#': 'numbersign',
        '$': 'dollar',
        '%': 'percent',
        '^': 'asciicircum',
        '&': 'ampersand',
        '*': 'asterisk',
        '(': 'parenleft',
        ')': 'parenright',
        '-': 'minus',
        '_': 'underscore',
        '=': 'equal',
        '+': 'plus',
        '|': 'bar',
        '<': 'less',
        '>': 'greater',
        '?': 'question'
      };
      
      keySymbol = symbolMap[keySymbol] || keySymbol;
      upperSymbol = symbolMap[upperSymbol] || upperSymbol;
      
      xkbContent += `    key <${xkbKey}> { [${keySymbol}, ${upperSymbol}] }; // ${key} -> ${char}\n`;
    });

    xkbContent += `\n    include "level3(ralt_switch)"\n`;
    xkbContent += `};\n`;

    return xkbContent;
  };

  // Filter layouts based on search query
  const filteredLayouts = availableLayouts.filter(layout => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      layout.name.toLowerCase().includes(query) ||
      layout.type?.toLowerCase().includes(query) ||
      layout.description?.toLowerCase().includes(query)
    );
  });

  // Open import modal and load layouts
  const openImportModal = () => {
    setShowImportModal(true);
    loadAvailableLayouts();
  };

  // Initialize original layout on component mount
  useEffect(() => {
    const initialLayout = parseTextToLayout(textContent);
    // Ensure QWERTY keys are properly set as the original layout
    const normalizedLayout = {
      '`': '`', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
      'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't', 'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p', '[': '[', ']': ']',
      'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', ';': ';', "'": "'",
      'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'n', 'm': 'm', ',': ',', '.': '.', '/': '/'
    };
    setOriginalLayout(normalizedLayout);
  }, []);

  // Update layout when text changes
  useEffect(() => {
    const layout = parseTextToLayout(textContent);
    setCurrentLayout(layout);
    // Debounce analysis
    const timeoutId = setTimeout(() => {
      analyzeLayout(layout);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [textContent]);

  // Update layout name when layout changes from original
  useEffect(() => {
    if (Object.keys(currentLayout).length > 0 && Object.keys(originalLayout).length > 0) {
      const isModified = !layoutsAreEqual(currentLayout, originalLayout);
      if (isModified && !currentLayoutName.endsWith('(custom)')) {
        // Extract base name without (Default) or (custom) suffix
        const baseName = originalLayoutName.replace(/\s*\((Default|custom)\)$/, '');
        setCurrentLayoutName(`${baseName} (custom)`);
      } else if (!isModified && currentLayoutName.endsWith('(custom)')) {
        // Restore original name if layout matches original
        setCurrentLayoutName(originalLayoutName);
      }
    }
  }, [currentLayout, originalLayout, originalLayoutName, currentLayoutName, layoutsAreEqual]);

  // Generate text visual with finger colors (consistent with KeyboardVisualization)
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
          const finger = getFingerForKey(key);
          const textColor = showFingerColors ? getFingerTextColor(finger) : 'text-gray-700 dark:text-gray-300';
          
          return (
            <span 
              key={keyIndex}
              className={`font-mono text-lg font-semibold px-1 ${textColor}`}
              title={`${key.toUpperCase()} → ${char} (Finger ${finger + 1})`}
            >
              {` ${char} `}
            </span>
          );
        })}
      </div>
    ));
  };

  // Get metric color based on value - consistent with LayoutAnalytics and LayoutListPage
  const getMetricColor = (value: number | undefined, good: number, bad: number, lowerIsBetter: boolean = true) => {
    if (value === undefined) return 'text-gray-400';
    if (lowerIsBetter) {
      return value <= good ? 'text-green-600 dark:text-green-400' : value >= bad ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
    } else {
      return value >= good ? 'text-green-600 dark:text-green-400' : value <= bad ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
    }
  };

  // Calculate overall layout score and assessment
  const getLayoutAssessment = (stats: LayoutStats) => {
    let score = 0;
    let factors = 0;
    
    // Effort (weight: 25%) - updated thresholds
    if (stats.effort <= 8.5) score += 25;
    else if (stats.effort <= 10.0) score += 15;
    else if (stats.effort <= 12.0) score += 8;
    factors++;
    
    // Same finger bigrams (weight: 20%) - updated thresholds
    if (stats.same_finger_bigrams_pct <= 4.0) score += 20;
    else if (stats.same_finger_bigrams_pct <= 7.0) score += 12;
    else if (stats.same_finger_bigrams_pct <= 10.0) score += 5;
    factors++;
    
    // Roll quality (weight: 15%) - updated thresholds
    const totalRolls = stats.roll_in_pct + stats.roll_out_pct;
    if (totalRolls >= 40) score += 15;
    else if (totalRolls >= 25) score += 10;
    else if (totalRolls >= 15) score += 5;
    factors++;
    
    // Alternation (weight: 10%) - updated thresholds
    if (stats.trigram_alt_pct >= 35) score += 10;
    else if (stats.trigram_alt_pct >= 27) score += 6;
    else if (stats.trigram_alt_pct >= 20) score += 3;
    factors++;
    
    // Distance (weight: 10%) - updated thresholds
    if (stats.distance <= 18.0) score += 10;
    else if (stats.distance <= 22.0) score += 6;
    else if (stats.distance <= 25.0) score += 3;
    factors++;
    
    // Problem patterns penalty (weight: 20%) - updated thresholds
    let problemScore = 20;
    if (stats.lateral_stretch_pct && stats.lateral_stretch_pct > 5.0) problemScore -= 8;
    else if (stats.lateral_stretch_pct && stats.lateral_stretch_pct > 3.0) problemScore -= 4;
    
    if (stats.pinky_scissors_pct && stats.pinky_scissors_pct > 2.0) problemScore -= 6;
    else if (stats.pinky_scissors_pct && stats.pinky_scissors_pct > 0.5) problemScore -= 3;
    
    if (stats.skip_bigrams_pct && stats.skip_bigrams_pct > 6.0) problemScore -= 4;
    else if (stats.skip_bigrams_pct && stats.skip_bigrams_pct > 3.0) problemScore -= 2;
    
    if (stats.two_row_jumps_pct && stats.two_row_jumps_pct > 15.0) problemScore -= 2;
    
    score += Math.max(0, problemScore);
    
    const totalScore = Math.round(score);
    
    let rating = '';
    let color = '';
    if (totalScore >= 85) {
      rating = 'Excellent';
      color = 'text-green-600';
    } else if (totalScore >= 70) {
      rating = 'Good';
      color = 'text-blue-600';
    } else if (totalScore >= 55) {
      rating = 'Fair';
      color = 'text-yellow-600';
    } else if (totalScore >= 40) {
      rating = 'Poor';
      color = 'text-orange-600';
    } else {
      rating = 'Very Poor';
      color = 'text-red-600';
    }
    
    return { score: totalScore, rating, color };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Settings className="w-12 h-12 text-purple-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">
            layoutgod designer
          </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Edit your keyboard layout as text and see a live preview with finger colors and analysis.
          </p>
          
          {/* Layout Actions */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={openImportModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import Layout
            </button>
            <button
              onClick={resetToQwerty}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to QWERTY
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Layout
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-10 min-w-48">
                  <button
                    onClick={exportLayoutJSON}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    JSON Format (.json)
                    <div className="text-xs text-gray-500 dark:text-gray-400">Standard data format</div>
                  </button>
                  <button
                    onClick={exportLayoutKLC}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    KLC Format (.klc)
                    <div className="text-xs text-gray-500 dark:text-gray-400">Microsoft Keyboard Layout Creator</div>
                  </button>
                  <button
                    onClick={exportLayoutXKB}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    XKB Format (.xkb)
                    <div className="text-xs text-gray-500 dark:text-gray-400">X Keyboard Extension for Linux</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visual Keyboard Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Keyboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Preview</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current: {currentLayoutName}</p>
                </div>
                <button
                  onClick={() => setShowFingerColors(!showFingerColors)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showFingerColors
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {showFingerColors ? 'Hide' : 'Show'} Finger Colors
                </button>
              </div>
              
              {/* Keyboard Layout */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <div className="leading-relaxed space-y-2">
                    {generateTextVisualWithColors(currentLayout)}
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                  Visual representation of your keyboard layout with finger color coding
                </div>
              </div>
              
              {/* Finger Assignment Legend - moved from right sidebar */}
              {showFingerColors && (
                <div className="mt-6">
                  <div className="text-center mb-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Finger Assignment Legend</span>
                  </div>
                  
                  {/* Finger color legend matching KeyboardVisualization */}
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
            
            {/* Text Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Layout Editor</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Edit your keyboard layout
                  </label>
                  <div className="relative">
                    <textarea
                      value={textContent}
                      onChange={handleTextChange}
                      className="w-full h-40 p-6 font-mono text-base leading-relaxed border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none transition-all duration-200"
                      placeholder="` 1 2 3 4 5 6 7 8 9 0 - =\nq w e r t y u i o p [ ]\na s d f g h j k l ; '\nz x c v b n m , . /"
                    />
                    <div className="absolute top-3 right-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                      Live Preview
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-purple-600 dark:text-purple-400 mb-2">✨ Instructions:</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                        <span>Each line represents a row on the keyboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                        <span>Separate characters with spaces</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                        <span>Changes appear instantly in the preview above</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Analysis and Legend */}
          <div className="space-y-6">
            {/* Live Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Analysis</h3>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing...</span>
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  {/* Overall Assessment */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">{getLayoutAssessment(stats).score}/100</div>
                      <div className={`text-lg font-semibold ${getLayoutAssessment(stats).color}`}>
                        {getLayoutAssessment(stats).rating}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Overall Layout Quality</div>
                    </div>
                  </div>
                  
                  
                  {/* Core Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Core Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Effort</span>
                        <span className={`font-bold ${getMetricColor(stats.effort, 8.5, 12.0)}`}>
                          {stats.effort.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Distance</span>
                        <span className={`font-bold ${getMetricColor(stats.distance, 18.0, 25.0)}`}>
                          {stats.distance.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Same Finger %</span>
                        <span className={`font-bold ${getMetricColor(stats.same_finger_bigrams_pct, 4.0, 10.0)}`}>
                          {stats.same_finger_bigrams_pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Flow Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Flow Patterns</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Roll In %</span>
                        <span className={`font-bold ${getMetricColor(stats.roll_in_pct, 25, 15, false)}`}>
                          {stats.roll_in_pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Roll Out %</span>
                        <span className={`font-bold ${getMetricColor(stats.roll_out_pct, 25, 15, false)}`}>
                          {stats.roll_out_pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Alternation %</span>
                        <span className={`font-bold ${getMetricColor(stats.trigram_alt_pct, 35, 25, false)}`}>
                          {stats.trigram_alt_pct.toFixed(1)}%
                        </span>
                      </div>
                      {stats.tri_redirect_pct !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Redirects %</span>
                          <span className={`font-bold ${getMetricColor(stats.tri_redirect_pct, 10, 20)}`}>
                            {stats.tri_redirect_pct.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Problem Patterns */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Problem Patterns</h4>
                    <div className="space-y-2">
                      {stats.skip_bigrams_pct !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Skip Bigrams %</span>
                          <span className={`font-bold ${getMetricColor(stats.skip_bigrams_pct, 3, 6)}`}>
                            {stats.skip_bigrams_pct.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {stats.lateral_stretch_pct !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Lateral Stretch %</span>
                          <span className={`font-bold ${getMetricColor(stats.lateral_stretch_pct, 3, 5)}`}>
                            {stats.lateral_stretch_pct.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {stats.pinky_scissors_pct !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Pinky Scissors %</span>
                          <span className={`font-bold ${getMetricColor(stats.pinky_scissors_pct, 0.5, 2)}`}>
                            {stats.pinky_scissors_pct.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {stats.two_row_jumps_pct !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Two Row Jumps %</span>
                          <span className={`font-bold ${getMetricColor(stats.two_row_jumps_pct, 8, 15)}`}>
                            {stats.two_row_jumps_pct.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pinky Metrics */}
                  {(stats.pinky_distance !== undefined || stats.pinky_off_home_pct !== undefined) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pinky Usage</h4>
                      <div className="space-y-2">
                        {stats.pinky_distance !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pinky Distance</span>
                            <span className={`font-bold ${getMetricColor(stats.pinky_distance, 0.15, 0.25)}`}>
                              {(stats.pinky_distance * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {stats.pinky_off_home_pct !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pinky Off Home %</span>
                            <span className={`font-bold ${getMetricColor(stats.pinky_off_home_pct, 30, 50)}`}>
                              {stats.pinky_off_home_pct.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Edit your layout above to see live analysis results
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Custom Layout Description - Full Width */}
        <div className="mt-8">
          <CustomLayoutDescription 
            key={`${currentLayoutName}-${JSON.stringify(currentLayout)}`}
            layoutData={{ keys: currentLayout }}
            layoutName={currentLayoutName}
            className=""
          />
        </div>
        
        {/* Import Layout Modal */}
        {showImportModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowImportModal(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import Layout</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search layouts by name, type, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {filteredLayouts.length} of {availableLayouts.length} layouts
                </div>
              </div>

              {loadingLayouts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading layouts...</span>
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLayouts.map((layout) => (
                      <div
                        key={layout.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-lg cursor-pointer transition-all duration-200"
                        onClick={() => importLayout(layout)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-2">{layout.name}</h3>
                        </div>
                        
                        {/* Quick Stats */}
                        {(layout.effort || layout.same_finger_bigrams_pct) && (
                          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {layout.effort && (
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Effort: {parseFloat(layout.effort).toFixed(1)}</span>
                            )}
                            {layout.same_finger_bigrams_pct && (
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SFB: {parseFloat(layout.same_finger_bigrams_pct).toFixed(1)}%</span>
                            )}
                          </div>
                        )}
                        
                        {/* Layout Preview */}
                        {layout.visual_data?.keys && (
                          <div className="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                            <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-600">
                              <div className="text-xs font-mono leading-relaxed space-y-1">
                                {[
                                  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                                  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                                  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
                                ].map((row, i) => (
                                  <div key={i} className="text-center text-gray-900 dark:text-gray-100">
                                    {row.map(key => layout.visual_data.keys[key] || key).join(' ')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Click to import</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {filteredLayouts.length === 0 && !loadingLayouts && (
                    <div className="text-center py-12">
                      {searchQuery.trim() ? (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 mb-2">No layouts match your search</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Try a different search term or clear the search</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No layouts available to import.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerPage;
