/**
 * Advanced Keyboard Layout Analyzer
 * Based on cyanophage's sophisticated analysis methodology
 * 
 * Key Features:
 * - Bigram effort matrix with precise transition costs
 * - Comprehensive trigram analysis (rolls, alternation, redirects)
 * - Multiple penalty systems (SFB, skip bigrams, lateral stretches, scissors)
 * - Finger position tracking and distance calculations
 * - Same hand string analysis
 * - Real-time statistical computation
 */

// Standard QWERTY key positions and finger assignments
const keyPositions = {
  // Row 0 (number row)
  '`': { row: 0, col: 0, finger: 1 }, '1': { row: 0, col: 1, finger: 1 }, 
  '2': { row: 0, col: 2, finger: 2 }, '3': { row: 0, col: 3, finger: 3 }, 
  '4': { row: 0, col: 4, finger: 4 }, '5': { row: 0, col: 5, finger: 4 }, 
  '6': { row: 0, col: 6, finger: 7 }, '7': { row: 0, col: 7, finger: 7 }, 
  '8': { row: 0, col: 8, finger: 8 }, '9': { row: 0, col: 9, finger: 9 }, 
  '0': { row: 0, col: 10, finger: 10 }, '-': { row: 0, col: 11, finger: 10 }, 
  '=': { row: 0, col: 12, finger: 10 },
  
  // Row 1 (QWERTY top row)
  'q': { row: 1, col: 1, finger: 1 }, 'w': { row: 1, col: 2, finger: 2 }, 
  'e': { row: 1, col: 3, finger: 3 }, 'r': { row: 1, col: 4, finger: 4 }, 
  't': { row: 1, col: 5, finger: 4 }, 'y': { row: 1, col: 6, finger: 7 }, 
  'u': { row: 1, col: 7, finger: 7 }, 'i': { row: 1, col: 8, finger: 8 }, 
  'o': { row: 1, col: 9, finger: 9 }, 'p': { row: 1, col: 10, finger: 10 }, 
  '[': { row: 1, col: 11, finger: 10 }, ']': { row: 1, col: 12, finger: 10 },
  
  // Row 2 (ASDF home row)
  'a': { row: 2, col: 1, finger: 1 }, 's': { row: 2, col: 2, finger: 2 }, 
  'd': { row: 2, col: 3, finger: 3 }, 'f': { row: 2, col: 4, finger: 4 }, 
  'g': { row: 2, col: 5, finger: 4 }, 'h': { row: 2, col: 6, finger: 7 }, 
  'j': { row: 2, col: 7, finger: 7 }, 'k': { row: 2, col: 8, finger: 8 }, 
  'l': { row: 2, col: 9, finger: 9 }, ';': { row: 2, col: 10, finger: 10 }, 
  "'": { row: 2, col: 11, finger: 10 },
  
  // Row 3 (ZXCV bottom row)
  'z': { row: 3, col: 1, finger: 1 }, 'x': { row: 3, col: 2, finger: 2 }, 
  'c': { row: 3, col: 3, finger: 3 }, 'v': { row: 3, col: 4, finger: 4 }, 
  'b': { row: 3, col: 5, finger: 4 }, 'n': { row: 3, col: 6, finger: 7 }, 
  'm': { row: 3, col: 7, finger: 7 }, ',': { row: 3, col: 8, finger: 8 }, 
  '.': { row: 3, col: 9, finger: 9 }, '/': { row: 3, col: 10, finger: 10 }
};

// Finger assignments: 1-4 = left hand (pinky to index), 7-10 = right hand (index to pinky)
const fingerNames = {
  1: 'Left Pinky', 2: 'Left Ring', 3: 'Left Middle', 4: 'Left Index',
  7: 'Right Index', 8: 'Right Middle', 9: 'Right Ring', 10: 'Right Pinky'
};

// Hand assignments
const getHand = (finger) => finger <= 4 ? 'left' : 'right';

// Physical key coordinates for distance calculation (in mm, approximate)
const keyCoords = {
  // Row 0
  '`': [0, 0], '1': [19.05, 0], '2': [38.1, 0], '3': [57.15, 0], 
  '4': [76.2, 0], '5': [95.25, 0], '6': [114.3, 0], '7': [133.35, 0], 
  '8': [152.4, 0], '9': [171.45, 0], '0': [190.5, 0], '-': [209.55, 0], 
  '=': [228.6, 0],
  
  // Row 1 (QWERTY)
  'q': [28.575, 19.05], 'w': [47.625, 19.05], 'e': [66.675, 19.05], 
  'r': [85.725, 19.05], 't': [104.775, 19.05], 'y': [123.825, 19.05], 
  'u': [142.875, 19.05], 'i': [161.925, 19.05], 'o': [180.975, 19.05], 
  'p': [200.025, 19.05], '[': [219.075, 19.05], ']': [238.125, 19.05],
  
  // Row 2 (ASDF home row)
  'a': [33.3375, 38.1], 's': [52.3875, 38.1], 'd': [71.4375, 38.1], 
  'f': [90.4875, 38.1], 'g': [109.5375, 38.1], 'h': [128.5875, 38.1], 
  'j': [147.6375, 38.1], 'k': [166.6875, 38.1], 'l': [185.7375, 38.1], 
  ';': [204.7875, 38.1], "'": [223.8375, 38.1],
  
  // Row 3 (ZXCV)
  'z': [42.8625, 57.15], 'x': [61.9125, 57.15], 'c': [80.9625, 57.15], 
  'v': [100.0125, 57.15], 'b': [119.0625, 57.15], 'n': [138.1125, 57.15], 
  'm': [157.1625, 57.15], ',': [176.2125, 57.15], '.': [195.2625, 57.15], 
  '/': [214.3125, 57.15]
};

// Base effort values for individual keys (based on finger strength and position)
const baseEffort = {
  // Left hand (fingers 1-4)
  1: { 0: 4.2, 1: 3.5, 2: 2.4, 3: 3.4 }, // Pinky
  2: { 0: 3.8, 1: 3.0, 2: 1.8, 3: 2.8 }, // Ring  
  3: { 0: 3.5, 1: 2.7, 2: 1.6, 3: 2.6 }, // Middle
  4: { 0: 3.3, 1: 2.5, 2: 1.4, 3: 2.4 }, // Index
  
  // Right hand (fingers 7-10)
  7: { 0: 3.3, 1: 2.5, 2: 1.4, 3: 2.4 }, // Index
  8: { 0: 3.5, 1: 2.7, 2: 1.6, 3: 2.6 }, // Middle
  9: { 0: 3.8, 1: 3.0, 2: 1.8, 3: 2.8 }, // Ring
  10: { 0: 4.2, 1: 3.5, 2: 2.4, 3: 3.4 } // Pinky
};

// Bigram effort penalties (simplified version of cyanophage's matrix)
const bigramEffortMultipliers = {
  sameFinger: 8.0,      // Same finger bigrams
  skipBigram: 4.0,      // Skip bigrams (same finger, 2+ rows apart)
  lateralStretch: 3.5,  // Lateral stretches
  scissors: 2.8,        // Scissors (adjacent fingers, 2+ rows apart)
  pinkeyScissors: 3.2,  // Pinky scissors
  homeRow: 1.0,         // Home row is baseline
  adjacentFinger: 1.2,  // Adjacent fingers
  handAlternation: 0.9  // Different hands (bonus)
};

// Calculate distance between two keys
const getDistance = (key1, key2) => {
  const coord1 = keyCoords[key1];
  const coord2 = keyCoords[key2];
  if (!coord1 || !coord2) return 0;
  
  const dx = coord1[0] - coord2[0];
  const dy = coord1[1] - coord2[1];
  return Math.sqrt(dx * dx + dy * dy);
};

// Get bigram effort based on key transition
const getBigramEffort = (key1, key2) => {
  const pos1 = keyPositions[key1];
  const pos2 = keyPositions[key2];
  
  if (!pos1 || !pos2) return 5.0; // Default penalty for unknown keys
  
  const finger1 = pos1.finger;
  const finger2 = pos2.finger;
  const row1 = pos1.row;
  const row2 = pos2.row;
  const col1 = pos1.col;
  const col2 = pos2.col;
  
  // Base effort from individual key presses
  let effort = (baseEffort[finger1]?.[row1] || 3.0) + (baseEffort[finger2]?.[row2] || 3.0);
  
  // Same finger penalties
  if (finger1 === finger2) {
    const rowDiff = Math.abs(row1 - row2);
    if (rowDiff >= 2) {
      effort *= bigramEffortMultipliers.skipBigram; // Skip bigram
    } else if (rowDiff >= 1) {
      effort *= bigramEffortMultipliers.sameFinger; // Same finger bigram
    }
  }
  
  // Lateral stretch penalties
  const isLateralStretch = (
    (col1 === 3 && col2 === 5) || (col1 === 8 && col2 === 6) ||
    (col1 === 5 && col2 === 3) || (col1 === 6 && col2 === 8) ||
    (col1 === 2 && col2 === 5) || (col1 === 9 && col2 === 6) ||
    (col1 === 5 && col2 === 2) || (col1 === 6 && col2 === 9)
  );
  if (isLateralStretch) {
    effort *= bigramEffortMultipliers.lateralStretch;
  }
  
  // Scissors (adjacent fingers, 2+ rows apart, same hand)
  const hand1 = getHand(finger1);
  const hand2 = getHand(finger2);
  if (hand1 === hand2 && Math.abs(finger1 - finger2) === 1 && Math.abs(row1 - row2) >= 2) {
    effort *= bigramEffortMultipliers.scissors;
  }
  
  // Hand alternation bonus
  if (hand1 !== hand2) {
    effort *= bigramEffortMultipliers.handAlternation;
  }
  
  return effort;
};

// Classify trigram patterns (rolls, alternation, redirects)
const classifyTrigram = (key1, key2, key3) => {
  const pos1 = keyPositions[key1];
  const pos2 = keyPositions[key2];
  const pos3 = keyPositions[key3];
  
  if (!pos1 || !pos2 || !pos3) return 'other';
  
  const finger1 = pos1.finger;
  const finger2 = pos2.finger;
  const finger3 = pos3.finger;
  const hand1 = getHand(finger1);
  const hand2 = getHand(finger2);
  const hand3 = getHand(finger3);
  
  // Alternation pattern (Left-Right-Left or Right-Left-Right)
  if ((hand1 === 'left' && hand2 === 'right' && hand3 === 'left') ||
      (hand1 === 'right' && hand2 === 'left' && hand3 === 'right')) {
    // Check for alternation same finger
    if (finger1 === finger3) {
      return 'alt sfs';
    }
    return 'alt';
  }
  
  // Same hand patterns
  if (hand1 === hand2 && hand2 === hand3) {
    // Roll in (fingers moving inward)
    if (hand1 === 'left') {
      if (finger1 < finger2 && finger2 < finger3) {
        return 'roll in';
      } else if (finger1 > finger2 && finger2 > finger3) {
        return 'roll out';
      }
    } else { // right hand
      if (finger1 > finger2 && finger2 > finger3) {
        return 'roll in';
      } else if (finger1 < finger2 && finger2 < finger3) {
        return 'roll out';
      }
    }
    
    // Redirect pattern
    if ((finger1 < finger2 && finger3 < finger2 && finger3 !== finger1) ||
        (finger1 > finger2 && finger3 > finger2 && finger3 !== finger1)) {
      // Weak redirect if no index finger involved
      if (finger1 !== 4 && finger2 !== 4 && finger3 !== 4 && 
          finger1 !== 7 && finger2 !== 7 && finger3 !== 7) {
        return 'weak redirect';
      }
      return 'redirect';
    }
  }
  
  // Bigram rolls (two keys same hand, third different hand)
  if (hand1 === hand2 && hand3 !== hand1) {
    if ((hand1 === 'left' && finger1 < finger2) || 
        (hand1 === 'right' && finger1 > finger2)) {
      return 'bigram roll in';
    } else {
      return 'bigram roll out';
    }
  } else if (hand1 !== hand2 && hand2 === hand3) {
    if ((hand2 === 'left' && finger2 > finger3) || 
        (hand2 === 'right' && finger2 < finger3)) {
      return 'bigram roll in';
    } else {
      return 'bigram roll out';
    }
  }
  
  return 'other';
};

// Main analysis function
const analyzeLayout = (layout, text = null) => {
  // Use default English text corpus if none provided - more representative sample
  const corpus = text || `the quick brown fox jumps over the lazy dog the five boxing wizards jump quickly pack my box with five dozen liquor jugs how vexingly quick daft zebras jump sphinx of black quartz judge my vow waltz bad nymph for quick jigs vex bright vixens jump dozy fowl quack amazingly few discotheques provide jukeboxes but zip drives may crash when subject to heavy jolt fixing sewers requires power and heavy equipment that may cost many grand the early morning mist hung over the meadow like a soft gray blanket birds chirped merrily in the oak trees that dotted the landscape while streams bubbled gently through the grass children played games near the school building teachers prepared lessons for the day students walked quickly down the hallway carrying books and papers the sun shone brightly through the windows casting long shadows across the floor computers hummed quietly in the library where people read books and researched topics of interest technology has changed how we communicate work and learn in modern society`;
  
  // Create reverse mapping: character -> QWERTY position where it appears
  // layout maps QWERTY positions to characters, we need character -> position
  const charToPosition = {};
  for (const [qwertyKey, layoutChar] of Object.entries(layout)) {
    if (layoutChar && keyPositions[qwertyKey]) {
      charToPosition[layoutChar.toLowerCase()] = qwertyKey;
    }
  }
  
  // Initialize statistics
  const stats = {
    // Basic metrics
    totalCharacters: 0,
    totalEffort: 0,
    totalDistance: 0,
    
    // Finger usage and distance tracking
    fingerUsage: {},
    fingerDistance: {},
    pinkyDistance: 0,
    
    // Pinky tracking
    pinkyKeystrokes: 0,
    pinkyOffHome: 0,
    
    // Bigram analysis
    sameFingerBigrams: {},
    sameFingerBigramCount: 0,
    skipBigrams: {},
    skipBigramCount: 0,
    skipBigrams2: {},
    skipBigrams2Count: 0,
    lateralStretches: {},
    lateralStretchCount: 0,
    scissors: {},
    scissorsCount: 0,
    pinkyScissors: {},
    pinkyScissorsCount: 0,
    twoRowJumps: {},
    twoRowJumpsCount: 0,
    twoRowSfb: {},
    twoRowSfbCount: 0,
    
    // Trigram analysis
    trigramCount: {
      'alt': 0,
      'alt sfs': 0,
      'roll in': 0,
      'roll out': 0,
      'redirect': 0,
      'weak redirect': 0,
      'bigram roll in': 0,
      'bigram roll out': 0,
      'other': 0
    },
    
    // Same hand strings
    sameHandStrings: {},
    sameHandCount: {},
    
    // Row usage
    rowUsage: { 0: 0, 1: 0, 2: 0, 3: 0 },
    
    // Column usage  
    columnUsage: {},
    
    // Center columns (4,5) usage
    col56Usage: 0
  };
  
  // Track finger positions for distance calculation
  const fingerPositions = {
    1: [2, 1], 2: [2, 2], 3: [2, 3], 4: [2, 4],   // Left hand home positions
    7: [2, 7], 8: [2, 8], 9: [2, 9], 10: [2, 10]  // Right hand home positions
  };
  
  const text_clean = corpus.toLowerCase().replace(/[^a-z]/g, '');
  let sameHandString = '';
  let prevPhysicalKey = null;
  let prevPrevPhysicalKey = null;
  let prevFinger = null;
  let prevHand = null;
  
  // Analyze each character
  for (let i = 0; i < text_clean.length; i++) {
    const char = text_clean[i];
    // Find the physical key position where this character would be typed
    const physicalKey = charToPosition[char] || char; // Map character to physical position
    const pos = keyPositions[physicalKey]; // Use the physical position for analysis
    
    if (!pos) continue;
    
    const finger = pos.finger;
    const hand = getHand(finger);
    const row = pos.row;
    const col = pos.col;
    
    stats.totalCharacters++;
    
    // Individual key effort
    const keyEffort = baseEffort[finger]?.[row] || 3.0;
    stats.totalEffort += keyEffort;
    
    // Finger usage
    stats.fingerUsage[finger] = (stats.fingerUsage[finger] || 0) + 1;
    
    // Finger distance
    const prevPos = fingerPositions[finger];
    const currentCoord = keyCoords[physicalKey]; // Use physical key for coordinates
    const prevCoord = [prevPos[1] * 19.05, prevPos[0] * 19.05]; // Convert to coordinates
    
    if (currentCoord) {
      const distance = Math.sqrt(
        Math.pow(currentCoord[0] - prevCoord[0], 2) + 
        Math.pow(currentCoord[1] - prevCoord[1], 2)
      );
      stats.totalDistance += distance;
      stats.fingerDistance[finger] = (stats.fingerDistance[finger] || 0) + distance;
      
      // Track pinky distance separately
      if (finger === 1 || finger === 10) { // Left or right pinky
        stats.pinkyDistance += distance;
      }
    }
    
    // Pinky tracking
    if (finger === 1 || finger === 10) { // Pinky fingers
      stats.pinkyKeystrokes++;
      // Check if pinky is off home row (home positions: LP=[2,1], RP=[2,10])
      const homeRow = 2;
      const homeCol = finger === 1 ? 1 : 10;
      if (row !== homeRow || col !== homeCol) {
        stats.pinkyOffHome++;
      }
    }
    
    // Column 5,6 tracking (center columns, 0-indexed: col 4 and 5 = T,G and Y,H positions)
    if (col === 4 || col === 5) {
      stats.col56Usage++;
    }
    
    // Update finger position
    fingerPositions[finger] = [row, col];
    
    // Row and column usage
    stats.rowUsage[row]++;
    stats.columnUsage[col] = (stats.columnUsage[col] || 0) + 1;
    
    // Bigram analysis
    if (prevPhysicalKey) {
      const bigram = prevPhysicalKey + physicalKey;
      const bigramEffort = getBigramEffort(prevPhysicalKey, physicalKey);
      stats.totalEffort += bigramEffort;
      
      const prevPos = keyPositions[prevPhysicalKey];
      const rowDiff = prevPos ? Math.abs(row - prevPos.row) : 0;
      const colDiff = prevPos ? Math.abs(col - prevPos.col) : 0;
      
      // Same finger bigram
      if (finger === prevFinger && prevPhysicalKey !== physicalKey) {
        stats.sameFingerBigrams[bigram] = (stats.sameFingerBigrams[bigram] || 0) + 1;
        stats.sameFingerBigramCount++;
        
        // Two row SFB (same finger + 2+ rows apart) - worst case
        if (rowDiff >= 2) {
          stats.twoRowSfb[bigram] = (stats.twoRowSfb[bigram] || 0) + 1;
          stats.twoRowSfbCount++;
        }
      }
      
      // Skip bigrams (same row, different columns)
      if (prevPos && prevPos.row === row) {
        // Skip bigrams (2 column gap)
        if (colDiff === 2) {
          stats.skipBigrams[bigram] = (stats.skipBigrams[bigram] || 0) + 1;
          stats.skipBigramCount++;
        }
        // Skip bigrams 2u (3 column gap)
        if (colDiff === 3) {
          stats.skipBigrams2[bigram] = (stats.skipBigrams2[bigram] || 0) + 1;
          stats.skipBigrams2Count++;
        }
      }
      
      // Two row jumps (any fingers, 2+ rows apart)
      if (rowDiff >= 2) {
        stats.twoRowJumps[bigram] = (stats.twoRowJumps[bigram] || 0) + 1;
        stats.twoRowJumpsCount++;
      }
      
      // Lateral stretch
      const prevCol = keyPositions[prevPhysicalKey]?.col;
      if (prevCol && (
        (prevCol === 3 && col === 5) || (prevCol === 8 && col === 6) ||
        (prevCol === 5 && col === 3) || (prevCol === 6 && col === 8) ||
        (prevCol === 2 && col === 5) || (prevCol === 9 && col === 6) ||
        (prevCol === 5 && col === 2) || (prevCol === 6 && col === 9)
      )) {
        stats.lateralStretches[bigram] = (stats.lateralStretches[bigram] || 0) + 1;
        stats.lateralStretchCount++;
      }
      
      // Scissors
      if (prevHand === hand && Math.abs(finger - prevFinger) === 1) {
        const prevRow = keyPositions[prevPhysicalKey]?.row;
        if (prevRow && Math.abs(row - prevRow) >= 2) {
          stats.scissors[bigram] = (stats.scissors[bigram] || 0) + 1;
          stats.scissorsCount++;
          
          // Pinky scissors (involving pinky finger)
          if (finger === 1 || finger === 10 || prevFinger === 1 || prevFinger === 10) {
            stats.pinkyScissors[bigram] = (stats.pinkyScissors[bigram] || 0) + 1;
            stats.pinkyScissorsCount++;
          }
        }
      }
      
      // Same hand strings
      if (prevHand === hand) {
        sameHandString += char;
      } else {
        if (sameHandString.length >= 4) {
          stats.sameHandStrings[sameHandString] = (stats.sameHandStrings[sameHandString] || 0) + 1;
        }
        const length = sameHandString.length;
        stats.sameHandCount[length] = (stats.sameHandCount[length] || 0) + 1;
        sameHandString = char;
      }
    }
    
    // Trigram analysis
    if (prevPrevPhysicalKey && prevPhysicalKey) {
      const trigram = prevPrevPhysicalKey + prevPhysicalKey + physicalKey;
      const category = classifyTrigram(prevPrevPhysicalKey, prevPhysicalKey, physicalKey);
      stats.trigramCount[category]++;
    }
    
    // Update tracking variables
    prevPrevPhysicalKey = prevPhysicalKey;
    prevPhysicalKey = physicalKey;
    prevFinger = finger;
    prevHand = hand;
  }
  
  // Calculate final percentages
  const totalTrigrams = Object.values(stats.trigramCount).reduce((a, b) => a + b, 0);
  const totalBigrams = stats.totalCharacters - 1;
  
  // Convert to percentages and final metrics
  const results = {
    // 1. Effort metrics (normalized)
    effort: (stats.totalEffort / stats.totalCharacters).toFixed(2),
    distance: (stats.totalDistance / stats.totalCharacters).toFixed(2),
    
    // 2. Pinky distance (proportion of total distance)
    pinky_distance: stats.totalDistance > 0 ?
      (stats.pinkyDistance / stats.totalDistance).toFixed(4) : 0,
      
    // 3. Pinky off-home percentage
    pinky_off_home_pct: stats.pinkyKeystrokes > 0 ?
      ((stats.pinkyOffHome / stats.pinkyKeystrokes) * 100).toFixed(2) : 0,
    
    // 4. Same finger bigram percentage
    same_finger_bigrams_pct: totalBigrams > 0 ? 
      ((stats.sameFingerBigramCount / totalBigrams) * 100).toFixed(2) : 0,
      
    // 5. Skip bigram percentage  
    skip_bigrams_pct: totalBigrams > 0 ?
      ((stats.skipBigramCount / totalBigrams) * 100).toFixed(2) : 0,
      
    // 6. Skip bigrams 2u percentage (3-key gaps)
    skip_bigrams2_pct: totalBigrams > 0 ?
      ((stats.skipBigrams2Count / totalBigrams) * 100).toFixed(2) : 0,
      
    // 7. Lateral stretch percentage
    lateral_stretch_pct: totalBigrams > 0 ?
      ((stats.lateralStretchCount / totalBigrams) * 100).toFixed(2) : 0,
      
    // 8. Pinky scissors percentage
    pinky_scissors_pct: totalBigrams > 0 ?
      ((stats.pinkyScissorsCount / totalBigrams) * 100).toFixed(2) : 0,
      
    // 8b. Total scissors percentage  
    scissors_pct: totalBigrams > 0 ?
      ((stats.scissorsCount / totalBigrams) * 100).toFixed(2) : 0,
      
    // 9. Two row SFB percentage (worst case SFBs)
    two_row_sfb_pct: stats.sameFingerBigramCount > 0 ?
      ((stats.twoRowSfbCount / stats.sameFingerBigramCount) * 100).toFixed(2) : 0,
      
    // 10. Two row jumps percentage
    two_row_jumps_pct: totalBigrams > 0 ?
      ((stats.twoRowJumpsCount / totalBigrams) * 100).toFixed(2) : 0,
    
    // 11. Trigram alternation percentage
    trigram_alt_pct: totalTrigrams > 0 ?
      (((stats.trigramCount.alt + stats.trigramCount['alt sfs']) / totalTrigrams) * 100).toFixed(2) : 0,
      
    // 12. Trigram redirect percentage
    tri_redirect_pct: totalTrigrams > 0 ?
      (((stats.trigramCount.redirect + stats.trigramCount['weak redirect']) / totalTrigrams) * 100).toFixed(2) : 0,
      
    // 13. Roll in percentage
    roll_in_pct: totalTrigrams > 0 ?
      (((stats.trigramCount['roll in'] + stats.trigramCount['bigram roll in']) / totalTrigrams) * 100).toFixed(2) : 0,
      
    // 14. Roll out percentage
    roll_out_pct: totalTrigrams > 0 ?
      (((stats.trigramCount['roll out'] + stats.trigramCount['bigram roll out']) / totalTrigrams) * 100).toFixed(2) : 0,
      
    // 15. Column 5,6 usage percentage (center columns)
    col5_6_pct: stats.totalCharacters > 0 ?
      ((stats.col56Usage / stats.totalCharacters) * 100).toFixed(2) : 0,
      
    // Legacy redirect field (maps to tri_redirect_pct)
    redirect_pct: totalTrigrams > 0 ?
      (((stats.trigramCount.redirect + stats.trigramCount['weak redirect']) / totalTrigrams) * 100).toFixed(2) : 0,
    
    // Finger usage (top fingers)
    finger_usage: Object.entries(stats.fingerUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([finger, count]) => ({
        finger: fingerNames[finger],
        usage_pct: ((count / stats.totalCharacters) * 100).toFixed(1)
      })),
      
    // Row usage
    row_usage: Object.entries(stats.rowUsage).map(([row, count]) => ({
      row: parseInt(row),
      usage_pct: ((count / stats.totalCharacters) * 100).toFixed(1)
    })),
    
    // Detailed breakdown for debugging
    raw_stats: {
      totalCharacters: stats.totalCharacters,
      totalEffort: stats.totalEffort.toFixed(2),
      totalDistance: stats.totalDistance.toFixed(2),
      sameFingerBigramCount: stats.sameFingerBigramCount,
      skipBigramCount: stats.skipBigramCount,
      lateralStretchCount: stats.lateralStretchCount,
      scissorsCount: stats.scissorsCount,
      totalBigrams,
      totalTrigrams,
      trigramBreakdown: stats.trigramCount
    }
  };
  
  return results;
};

module.exports = {
  analyzeLayout,
  keyPositions,
  fingerNames,
  getBigramEffort,
  classifyTrigram,
  getDistance
};
