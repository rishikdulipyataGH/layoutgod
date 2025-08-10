const fs = require('fs');
const path = require('path');

// Standard keyboard physical coordinates and finger assignments
const FINGER_MAP = {
  // Left hand
  'q': 'LP', 'w': 'LR', 'e': 'LM', 'r': 'LI', 't': 'LI',
  'a': 'LP', 's': 'LR', 'd': 'LM', 'f': 'LI', 'g': 'LI',
  'z': 'LP', 'x': 'LR', 'c': 'LM', 'v': 'LI', 'b': 'LI',
  // Right hand
  'y': 'RI', 'u': 'RI', 'i': 'RM', 'o': 'RR', 'p': 'RP',
  'h': 'RI', 'j': 'RI', 'k': 'RM', 'l': 'RR', ';': 'RP',
  'n': 'RI', 'm': 'RI', ',': 'RM', '.': 'RR', '/': 'RP'
};

// Physical key positions (row, column) for QWERTY reference
const KEY_POSITIONS = {
  'q': [0, 0], 'w': [0, 1], 'e': [0, 2], 'r': [0, 3], 't': [0, 4],
  'y': [0, 5], 'u': [0, 6], 'i': [0, 7], 'o': [0, 8], 'p': [0, 9],
  'a': [1, 0], 's': [1, 1], 'd': [1, 2], 'f': [1, 3], 'g': [1, 4],
  'h': [1, 5], 'j': [1, 6], 'k': [1, 7], 'l': [1, 8], ';': [1, 9],
  'z': [2, 0], 'x': [2, 1], 'c': [2, 2], 'v': [2, 3], 'b': [2, 4],
  'n': [2, 5], 'm': [2, 6], ',': [2, 7], '.': [2, 8], '/': [2, 9]
};

// Home row positions for each finger
const HOME_POSITIONS = {
  'LP': [1, 0], 'LR': [1, 1], 'LM': [1, 2], 'LI': [1, 3],
  'RI': [1, 6], 'RM': [1, 7], 'RR': [1, 8], 'RP': [1, 9]
};

// Key difficulty multipliers based on position
const KEY_DIFFICULTY = {
  // Row difficulty
  0: 1.3, // Top row
  1: 1.0, // Home row
  2: 1.2  // Bottom row
};

// Column difficulty (columns 5 and 6 are harder to reach)
const COLUMN_DIFFICULTY = {
  0: 1.1, 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.1,
  5: 1.4, 6: 1.4, 7: 1.0, 8: 1.0, 9: 1.1
};

class LayoutAnalyzer {
  constructor() {
    // Load common English text corpus for analysis
    this.corpus = this.loadCorpus();
    this.bigramFreqs = this.calculateBigramFreqs(this.corpus);
    this.trigramFreqs = this.calculateTrigramFreqs(this.corpus);
  }

  loadCorpus() {
    // Default corpus - in production, load from a larger text file
    return `the quick brown fox jumps over the lazy dog the five boxing wizards jump quickly pack my box with five dozen liquor jugs how vexingly quick daft zebras jump sphinx of black quartz judge my vow waltz bad nymph for quick jigs vex bright vixens jump dozy fowl quack`.toLowerCase();
  }

  calculateBigramFreqs(text) {
    const bigrams = {};
    let total = 0;
    
    for (let i = 0; i < text.length - 1; i++) {
      const bigram = text[i] + text[i + 1];
      if (/^[a-z]{2}$/.test(bigram)) {
        bigrams[bigram] = (bigrams[bigram] || 0) + 1;
        total++;
      }
    }
    
    // Convert to frequencies
    for (let bigram in bigrams) {
      bigrams[bigram] = bigrams[bigram] / total;
    }
    
    return bigrams;
  }

  calculateTrigramFreqs(text) {
    const trigrams = {};
    let total = 0;
    
    for (let i = 0; i < text.length - 2; i++) {
      const trigram = text[i] + text[i + 1] + text[i + 2];
      if (/^[a-z]{3}$/.test(trigram)) {
        trigrams[trigram] = (trigrams[trigram] || 0) + 1;
        total++;
      }
    }
    
    // Convert to frequencies
    for (let trigram in trigrams) {
      trigrams[trigram] = trigrams[trigram] / total;
    }
    
    return trigrams;
  }

  analyzeLayout(layoutData) {
    // layoutData should have structure: { keys: { 'q': 'q', 'w': 'w', ... } }
    const keyMap = layoutData.keys || layoutData;
    
    // Create reverse mapping for analysis
    const charToPosition = {};
    for (let pos in keyMap) {
      if (keyMap[pos] && KEY_POSITIONS[pos]) {
        charToPosition[keyMap[pos].toLowerCase()] = pos;
      }
    }

    const stats = {
      effort: this.calculateEffort(charToPosition),
      distance: this.calculateDistance(charToPosition),
      pinky_distance: this.calculatePinkyDistance(charToPosition),
      pinky_off_home_pct: this.calculatePinkyOffHomePct(charToPosition),
      same_finger_bigrams_pct: this.calculateSameFingerBigramsPct(charToPosition),
      skip_bigrams_pct: this.calculateSkipBigramsPct(charToPosition),
      skip_bigrams2_pct: this.calculateSkipBigrams2Pct(charToPosition),
      lateral_stretch_pct: this.calculateLateralStretchPct(charToPosition),
      pinky_scissors_pct: this.calculatePinkyScissorsPct(charToPosition),
      two_row_sfb_pct: this.calculateTwoRowSfbPct(charToPosition),
      two_row_jumps_pct: this.calculateTwoRowJumpsPct(charToPosition),
      trigram_alt_pct: this.calculateTrigramAltPct(charToPosition),
      tri_redirect_pct: this.calculateTriRedirectPct(charToPosition),
      roll_in_pct: this.calculateRollInPct(charToPosition),
      roll_out_pct: this.calculateRollOutPct(charToPosition),
      col5_6_pct: this.calculateCol56Pct(charToPosition)
    };

    return stats;
  }

  calculateEffort(charToPosition) {
    let totalEffort = 0;
    let totalChars = 0;

    for (let char of this.corpus) {
      if (charToPosition[char] && KEY_POSITIONS[charToPosition[char]]) {
        const pos = KEY_POSITIONS[charToPosition[char]];
        const rowDifficulty = KEY_DIFFICULTY[pos[0]] || 1.0;
        const colDifficulty = COLUMN_DIFFICULTY[pos[1]] || 1.0;
        totalEffort += rowDifficulty * colDifficulty;
        totalChars++;
      }
    }

    return totalChars > 0 ? parseFloat((totalEffort / totalChars).toFixed(4)) : 0;
  }

  calculateDistance(charToPosition) {
    let totalDistance = 0;
    let totalTransitions = 0;
    let prevPos = null;

    for (let char of this.corpus) {
      if (charToPosition[char] && KEY_POSITIONS[charToPosition[char]]) {
        const currentPos = KEY_POSITIONS[charToPosition[char]];
        
        if (prevPos) {
          const distance = Math.sqrt(
            Math.pow(currentPos[0] - prevPos[0], 2) + 
            Math.pow(currentPos[1] - prevPos[1], 2)
          );
          totalDistance += distance;
          totalTransitions++;
        }
        
        prevPos = currentPos;
      }
    }

    return totalTransitions > 0 ? parseFloat((totalDistance / totalTransitions).toFixed(4)) : 0;
  }

  calculatePinkyDistance(charToPosition) {
    let pinkyDistance = 0;
    let totalDistance = 0;
    let prevPos = null;

    for (let char of this.corpus) {
      if (charToPosition[char] && KEY_POSITIONS[charToPosition[char]]) {
        const currentPos = KEY_POSITIONS[charToPosition[char]];
        const finger = FINGER_MAP[charToPosition[char]];
        
        if (prevPos) {
          const distance = Math.sqrt(
            Math.pow(currentPos[0] - prevPos[0], 2) + 
            Math.pow(currentPos[1] - prevPos[1], 2)
          );
          
          totalDistance += distance;
          
          if (finger === 'LP' || finger === 'RP') {
            pinkyDistance += distance;
          }
        }
        
        prevPos = currentPos;
      }
    }

    return totalDistance > 0 ? parseFloat((pinkyDistance / totalDistance).toFixed(4)) : 0;
  }

  calculatePinkyOffHomePct(charToPosition) {
    let pinkyKeystrokes = 0;
    let pinkyOffHome = 0;

    for (let char of this.corpus) {
      if (charToPosition[char] && KEY_POSITIONS[charToPosition[char]]) {
        const finger = FINGER_MAP[charToPosition[char]];
        
        if (finger === 'LP' || finger === 'RP') {
          pinkyKeystrokes++;
          const pos = KEY_POSITIONS[charToPosition[char]];
          const homePos = HOME_POSITIONS[finger];
          
          if (pos[0] !== homePos[0] || pos[1] !== homePos[1]) {
            pinkyOffHome++;
          }
        }
      }
    }

    return pinkyKeystrokes > 0 ? parseFloat(((pinkyOffHome / pinkyKeystrokes) * 100).toFixed(2)) : 0;
  }

  calculateSameFingerBigramsPct(charToPosition) {
    let totalBigrams = 0;
    let sameFingerBigrams = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        
        totalBigrams++;
        if (finger1 === finger2) {
          sameFingerBigrams++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((sameFingerBigrams / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateSkipBigramsPct(charToPosition) {
    let totalBigrams = 0;
    let skipBigrams = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        // Same row, skip one key
        if (pos1[0] === pos2[0] && Math.abs(pos1[1] - pos2[1]) === 2) {
          skipBigrams++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((skipBigrams / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateSkipBigrams2Pct(charToPosition) {
    let totalBigrams = 0;
    let skipBigrams2 = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        // Same row, skip two keys
        if (pos1[0] === pos2[0] && Math.abs(pos1[1] - pos2[1]) === 3) {
          skipBigrams2++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((skipBigrams2 / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateLateralStretchPct(charToPosition) {
    let totalBigrams = 0;
    let lateralStretch = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        // Same hand, different fingers, requiring stretch
        const sameHand = (finger1[0] === finger2[0]);
        const differentFingers = finger1 !== finger2;
        const requiresStretch = Math.abs(pos1[1] - pos2[1]) > 2;
        
        if (sameHand && differentFingers && requiresStretch) {
          lateralStretch++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((lateralStretch / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculatePinkyScissorsPct(charToPosition) {
    let totalBigrams = 0;
    let pinkyScissors = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        // Pinky and ring finger crossing awkwardly
        const isPinkyRing = (finger1.endsWith('P') && finger2.endsWith('R')) || 
                          (finger1.endsWith('R') && finger2.endsWith('P'));
        const sameHand = finger1[0] === finger2[0];
        const crossing = (pos1[1] > pos2[1] && finger1.endsWith('R')) || 
                        (pos2[1] > pos1[1] && finger2.endsWith('R'));
        
        if (isPinkyRing && sameHand && crossing) {
          pinkyScissors++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((pinkyScissors / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateTwoRowSfbPct(charToPosition) {
    let totalSfb = 0;
    let twoRowSfb = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        
        if (finger1 === finger2) {
          totalSfb++;
          
          const pos1 = KEY_POSITIONS[charToPosition[char1]];
          const pos2 = KEY_POSITIONS[charToPosition[char2]];
          
          if (Math.abs(pos1[0] - pos2[0]) >= 2) {
            twoRowSfb++;
          }
        }
      }
    }

    return totalSfb > 0 ? parseFloat(((twoRowSfb / totalSfb) * 100).toFixed(2)) : 0;
  }

  calculateTwoRowJumpsPct(charToPosition) {
    let totalBigrams = 0;
    let twoRowJumps = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        if (Math.abs(pos1[0] - pos2[0]) >= 2) {
          twoRowJumps++;
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((twoRowJumps / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateTrigramAltPct(charToPosition) {
    let totalTrigrams = 0;
    let altTrigrams = 0;

    for (let trigram in this.trigramFreqs) {
      const char1 = trigram[0];
      const char2 = trigram[1];
      const char3 = trigram[2];
      
      if (charToPosition[char1] && charToPosition[char2] && charToPosition[char3]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        const finger3 = FINGER_MAP[charToPosition[char3]];
        
        const hand1 = finger1[0];
        const hand2 = finger2[0];
        const hand3 = finger3[0];
        
        totalTrigrams++;
        
        // Alternating hands pattern
        if (hand1 !== hand2 && hand2 !== hand3) {
          altTrigrams++;
        }
      }
    }

    return totalTrigrams > 0 ? parseFloat(((altTrigrams / totalTrigrams) * 100).toFixed(2)) : 0;
  }

  calculateTriRedirectPct(charToPosition) {
    let totalTrigrams = 0;
    let redirectTrigrams = 0;

    for (let trigram in this.trigramFreqs) {
      const char1 = trigram[0];
      const char2 = trigram[1];
      const char3 = trigram[2];
      
      if (charToPosition[char1] && charToPosition[char2] && charToPosition[char3]) {
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        const pos3 = KEY_POSITIONS[charToPosition[char3]];
        
        totalTrigrams++;
        
        // Direction change detection
        const dir1 = pos2[1] - pos1[1]; // Left-right movement
        const dir2 = pos3[1] - pos2[1];
        
        // Redirect if direction changes significantly
        if ((dir1 > 0 && dir2 < 0) || (dir1 < 0 && dir2 > 0)) {
          redirectTrigrams++;
        }
      }
    }

    return totalTrigrams > 0 ? parseFloat(((redirectTrigrams / totalTrigrams) * 100).toFixed(2)) : 0;
  }

  calculateRollInPct(charToPosition) {
    let totalBigrams = 0;
    let rollInBigrams = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        const sameHand = finger1[0] === finger2[0];
        const sameRow = pos1[0] === pos2[0];
        
        if (sameHand && sameRow) {
          // Rolling inward toward center
          const leftHand = finger1[0] === 'L';
          const rollingIn = leftHand ? (pos2[1] > pos1[1]) : (pos2[1] < pos1[1]);
          
          if (rollingIn) {
            rollInBigrams++;
          }
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((rollInBigrams / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateRollOutPct(charToPosition) {
    let totalBigrams = 0;
    let rollOutBigrams = 0;

    for (let bigram in this.bigramFreqs) {
      const char1 = bigram[0];
      const char2 = bigram[1];
      
      if (charToPosition[char1] && charToPosition[char2]) {
        const finger1 = FINGER_MAP[charToPosition[char1]];
        const finger2 = FINGER_MAP[charToPosition[char2]];
        const pos1 = KEY_POSITIONS[charToPosition[char1]];
        const pos2 = KEY_POSITIONS[charToPosition[char2]];
        
        totalBigrams++;
        
        const sameHand = finger1[0] === finger2[0];
        const sameRow = pos1[0] === pos2[0];
        
        if (sameHand && sameRow) {
          // Rolling outward toward pinkies
          const leftHand = finger1[0] === 'L';
          const rollingOut = leftHand ? (pos2[1] < pos1[1]) : (pos2[1] > pos1[1]);
          
          if (rollingOut) {
            rollOutBigrams++;
          }
        }
      }
    }

    return totalBigrams > 0 ? parseFloat(((rollOutBigrams / totalBigrams) * 100).toFixed(2)) : 0;
  }

  calculateCol56Pct(charToPosition) {
    let totalKeystrokes = 0;
    let col56Keystrokes = 0;

    for (let char of this.corpus) {
      if (charToPosition[char] && KEY_POSITIONS[charToPosition[char]]) {
        const pos = KEY_POSITIONS[charToPosition[char]];
        totalKeystrokes++;
        
        // Columns 5 and 6 (0-indexed: 4 and 5)
        if (pos[1] === 4 || pos[1] === 5) {
          col56Keystrokes++;
        }
      }
    }

    return totalKeystrokes > 0 ? parseFloat(((col56Keystrokes / totalKeystrokes) * 100).toFixed(2)) : 0;
  }
}

module.exports = LayoutAnalyzer;
