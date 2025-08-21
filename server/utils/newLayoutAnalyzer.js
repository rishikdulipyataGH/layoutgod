const fs = require('fs');
const path = require('path');

class LayoutAnalyzer {
  constructor() {
    this.baseEffort = {
      // Base effort values for each key position (row, col)
      // Lower values are better (less effort)
      0: { // Top row
        1: 3.6, 2: 2.4, 3: 2.0, 4: 2.2, 5: 3.5,
        6: 3.5, 7: 2.2, 8: 2.0, 9: 2.4, 10: 3.6, 11: 5.0
      },
      1: { // Home row (best)
        1: 2.4, 2: 1.6, 3: 1.3, 4: 1.1, 5: 2.6,
        6: 2.6, 7: 1.1, 8: 1.3, 9: 1.6, 10: 2.4, 11: 3.9
      },
      2: { // Bottom row
        1: 3.4, 2: 2.6, 3: 2.3, 4: 2.1, 5: 3.7,
        6: 3.7, 7: 2.1, 8: 2.3, 9: 2.6, 10: 3.4, 11: 4.8
      },
      3: { // Space/modifier row
        4: 1.0, 5: 1.0 // Thumbs
      }
    };

    this.fingerAssignment = [
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10]
    ];

    // English letter frequencies (from cyanophage data)
    this.letterFreq = {
      'e': 11.870939, 't': 9.547406, 'a': 7.466138, 'o': 7.664354, 'i': 6.177734,
      'n': 6.144698, 'h': 6.519106, 's': 5.572074, 'r': 4.988437, 'l': 4.603017,
      'd': 4.261645, 'c': 1.883053, 'u': 2.741989, 'm': 1.585728, 'p': 1.442572,
      'f': 2.048233, 'g': 2.224425, 'w': 2.775025, 'y': 1.794956, 'b': 1.552692,
      'v': 0.748816, 'k': 1.057152, 'x': 0.077084, 'j': 0.066072, 'q': 0.066072,
      'z': 0.044048, ';': 0.418456, '\'': 0.352384, ',': 2.000000, '.': 1.500000,
      '/': 0.100000, '-': 0.275300, '\\': 0.050000
    };

    // Load word lists and bigram frequencies
    this.wordLists = this.loadWordLists();
    this.bigramFreq = this.loadBigramFreq();
  }

  loadWordLists() {
    try {
      const wordlistPath = path.join(__dirname, '..', 'data', 'wordlists.json');
      if (fs.existsSync(wordlistPath)) {
        const data = JSON.parse(fs.readFileSync(wordlistPath, 'utf8'));
        return data;
      }
    } catch (error) {
      console.warn('Could not load wordlists:', error.message);
    }
    return {};
  }

  loadBigramFreq() {
    // Note: Bigram frequency data would be loaded from a data file if available
    // For now, returning empty object - could be populated with frequency data later
    return {};
  }

  // Get key position from layout
  getKeyPosition(char, visualData) {
    if (!visualData || !visualData.keys) return null;
    
    const key = visualData.keys.find(k => k.char === char);
    return key ? { row: key.row, col: key.col, finger: key.finger, hand: key.hand } : null;
  }

  // Get finger assignment for position
  getFinger(row, col) {
    if (row > 2) {
      return col <= 4 ? 5 : 6; // Thumbs
    }
    return this.fingerAssignment[row]?.[col] || 1;
  }

  // Calculate base effort for a position
  getEffort(row, col) {
    return this.baseEffort[row]?.[col] || 5.0; // High penalty for undefined positions
  }

  // Calculate distance between two positions
  getDistance(pos1, pos2) {
    if (!pos1 || !pos2) return 0;
    return Math.sqrt(Math.pow(pos1.col - pos2.col, 2) + Math.pow(pos1.row - pos2.row, 2));
  }

  // Main analysis function - implements cyanophage's methodology
  analyzeLayout(visualData, options = {}) {
    const wordList = options.wordList || 'english_1k';
    const words = this.wordLists[wordList]?.words || [];
    
    if (!visualData || !visualData.keys || words.length === 0) {
      return this.getDefaultStats();
    }

    // Initialize metrics
    const metrics = {
      effort: 0,
      distance: 0,
      pinky_distance: 0,
      pinky_off_home_pct: 0,
      same_finger_bigrams_pct: 0,
      skip_bigrams_pct: 0,
      skip_bigrams2_pct: 0,
      lateral_stretch_pct: 0,
      pinky_scissors_pct: 0,
      two_row_sfb_pct: 0,
      two_row_jumps_pct: 0,
      trigram_alt_pct: 0,
      tri_redirect_pct: 0,
      roll_in_pct: 0,
      roll_out_pct: 0,
      col5_6_pct: 0
    };

    // Analysis counters
    let totalChars = 0;
    let totalBigrams = 0;
    let totalTrigrams = 0;
    let sfbCount = 0;
    let skipBigramCount = 0;
    let skipBigram2Count = 0;
    let lateralStretchCount = 0;
    let pinkyScissorsCount = 0;
    let twoRowSfbCount = 0;
    let twoRowJumpsCount = 0;
    let trigramAltCount = 0;
    let triRedirectCount = 0;
    let rollInCount = 0;
    let rollOutCount = 0;
    let col56Count = 0;
    let pinkyOffHomeCount = 0;
    let totalPinkyStrokes = 0;

    // Process each word
    for (let w = 0; w < Math.min(words.length, 10000); w++) {
      const word = words[w];
      if (typeof word !== 'string' || word.length < 2) continue;

      const wordCount = this.getWordFrequency(word);
      
      // Initialize finger positions (home row)
      const fingerPos = {};
      for (let f = 1; f <= 10; f++) {
        fingerPos[f] = this.getHomePosition(f, visualData);
      }

      let prevPos = null;
      let prevFinger = null;
      let ppPos = null; // previous-previous position

      for (let i = 0; i < word.length; i++) {
        const char = word[i].toLowerCase();
        const pos = this.getKeyPosition(char, visualData);
        
        if (!pos) continue; // Skip unknown characters

        const finger = pos.finger;
        totalChars += wordCount;

        // Calculate effort
        metrics.effort += wordCount * this.getEffort(pos.row, pos.col);

        // Calculate distance
        if (fingerPos[finger]) {
          const distance = this.getDistance(pos, fingerPos[finger]);
          metrics.distance += wordCount * distance;
          
          if (finger === 1 || finger === 10) { // Pinky fingers
            metrics.pinky_distance += wordCount * distance;
            totalPinkyStrokes += wordCount;
            
            if (pos.row !== 1) { // Not on home row
              pinkyOffHomeCount += wordCount;
            }
          }
        }

        // Update finger position
        fingerPos[finger] = pos;

        // Column 5 & 6 usage (center columns)
        if (pos.col === 5 || pos.col === 6) {
          col56Count += wordCount;
        }

        // Bigram analysis
        if (prevPos && i > 0) {
          totalBigrams += wordCount;
          const bigram = word[i-1] + char;

          // Same finger bigrams
          if (finger === prevFinger && pos.row !== prevPos.row) {
            sfbCount += wordCount;
            
            // Two row SFB (2u jumps)
            if (Math.abs(pos.row - prevPos.row) >= 2) {
              twoRowSfbCount += wordCount;
            }
          }

          // Skip bigrams (finger skipping)
          if (this.isSkipBigram(prevPos, pos)) {
            skipBigramCount += wordCount;
          }
          if (this.isSkipBigram2(prevPos, pos)) {
            skipBigram2Count += wordCount;
          }

          // Lateral stretch
          if (this.isLateralStretch(prevPos, pos)) {
            lateralStretchCount += wordCount;
          }

          // Pinky scissors
          if (this.isPinkyScissors(prevPos, pos, prevFinger, finger)) {
            pinkyScissorsCount += wordCount;
          }

          // Two row jumps
          if (this.isTwoRowJump(prevPos, pos)) {
            twoRowJumpsCount += wordCount;
          }

          // Roll analysis
          if (this.isRollIn(prevPos, pos)) {
            rollInCount += wordCount;
          }
          if (this.isRollOut(prevPos, pos)) {
            rollOutCount += wordCount;
          }
        }

        // Trigram analysis
        if (ppPos && prevPos && i > 1) {
          totalTrigrams += wordCount;
          
          if (this.isTrigramAlternating(ppPos, prevPos, pos)) {
            trigramAltCount += wordCount;
          }
          if (this.isTrigramRedirect(ppPos, prevPos, pos)) {
            triRedirectCount += wordCount;
          }
        }

        // Update positions
        ppPos = prevPos;
        prevPos = pos;
        prevFinger = finger;
      }
    }

    // Calculate percentages and normalize
    if (totalChars > 0) {
      metrics.effort = metrics.effort / totalChars;
      metrics.distance = metrics.distance / totalChars;
      metrics.pinky_distance = metrics.pinky_distance / Math.max(totalPinkyStrokes, 1);
    }

    if (totalBigrams > 0) {
      metrics.same_finger_bigrams_pct = (sfbCount / totalBigrams) * 100;
      metrics.skip_bigrams_pct = (skipBigramCount / totalBigrams) * 100;
      metrics.skip_bigrams2_pct = (skipBigram2Count / totalBigrams) * 100;
      metrics.lateral_stretch_pct = (lateralStretchCount / totalBigrams) * 100;
      metrics.pinky_scissors_pct = (pinkyScissorsCount / totalBigrams) * 100;
      metrics.two_row_sfb_pct = (twoRowSfbCount / totalBigrams) * 100;
      metrics.two_row_jumps_pct = (twoRowJumpsCount / totalBigrams) * 100;
      metrics.roll_in_pct = (rollInCount / totalBigrams) * 100;
      metrics.roll_out_pct = (rollOutCount / totalBigrams) * 100;
    }

    if (totalTrigrams > 0) {
      metrics.trigram_alt_pct = (trigramAltCount / totalTrigrams) * 100;
      metrics.tri_redirect_pct = (triRedirectCount / totalTrigrams) * 100;
    }

    if (totalChars > 0) {
      metrics.col5_6_pct = (col56Count / totalChars) * 100;
      metrics.pinky_off_home_pct = (pinkyOffHomeCount / Math.max(totalPinkyStrokes, 1)) * 100;
    }

    return metrics;
  }

  // Helper methods for bigram/trigram analysis
  isSkipBigram(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    // Check if fingers skip over each other
    const colDiff = Math.abs(pos1.col - pos2.col);
    return colDiff >= 2 && pos1.hand === pos2.hand;
  }

  isSkipBigram2(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    // More restrictive skip bigram
    const colDiff = Math.abs(pos1.col - pos2.col);
    return colDiff >= 3 && pos1.hand === pos2.hand;
  }

  isLateralStretch(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    // Lateral stretch: index-pinky stretch
    return (pos1.col === 3 && pos2.col === 5) || 
           (pos1.col === 8 && pos2.col === 6) ||
           (pos1.col === 5 && pos2.col === 3) ||
           (pos1.col === 6 && pos2.col === 8);
  }

  isPinkyScissors(pos1, pos2, finger1, finger2) {
    if (!pos1 || !pos2) return false;
    // Pinky scissors: adjacent fingers with 2+ row difference
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    const isPinky = finger1 === 1 || finger1 === 10 || finger2 === 1 || finger2 === 10;
    
    return isPinky && colDiff === 1 && rowDiff >= 2;
  }

  isTwoRowJump(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    return Math.abs(pos1.row - pos2.row) >= 2;
  }

  isRollIn(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    // Inward roll: right hand goes left, left hand goes right
    if (pos1.hand === 'L' && pos2.hand === 'L') {
      return pos2.col > pos1.col;
    }
    if (pos1.hand === 'R' && pos2.hand === 'R') {
      return pos2.col < pos1.col;
    }
    return false;
  }

  isRollOut(pos1, pos2) {
    if (!pos1 || !pos2) return false;
    // Outward roll: left hand goes left, right hand goes right
    if (pos1.hand === 'L' && pos2.hand === 'L') {
      return pos2.col < pos1.col;
    }
    if (pos1.hand === 'R' && pos2.hand === 'R') {
      return pos2.col > pos1.col;
    }
    return false;
  }

  isTrigramAlternating(pos1, pos2, pos3) {
    if (!pos1 || !pos2 || !pos3) return false;
    // Alternating hands
    return pos1.hand !== pos2.hand && pos2.hand !== pos3.hand;
  }

  isTrigramRedirect(pos1, pos2, pos3) {
    if (!pos1 || !pos2 || !pos3) return false;
    // Redirect: same hand changes direction
    if (pos1.hand === pos2.hand && pos2.hand === pos3.hand) {
      const dir1 = pos2.col - pos1.col;
      const dir2 = pos3.col - pos2.col;
      return dir1 * dir2 < 0; // Opposite directions
    }
    return false;
  }

  getHomePosition(finger, visualData) {
    // Return home row position for each finger
    const homePositions = {
      1: { row: 1, col: 1 },   // Left pinky
      2: { row: 1, col: 2 },   // Left ring
      3: { row: 1, col: 3 },   // Left middle
      4: { row: 1, col: 4 },   // Left index
      5: { row: 3, col: 4 },   // Left thumb
      6: { row: 3, col: 7 },   // Right thumb
      7: { row: 1, col: 7 },   // Right index
      8: { row: 1, col: 8 },   // Right middle
      9: { row: 1, col: 9 },   // Right ring
      10: { row: 1, col: 10 }  // Right pinky
    };
    
    return homePositions[finger] || { row: 1, col: 5 };
  }

  getWordFrequency(word) {
    // Simple frequency model - in real implementation, this would use actual word frequencies
    const baseFreq = 1;
    const length = word.length;
    
    // Common words get higher frequency
    const commonWords = {
      'the': 100, 'and': 80, 'for': 60, 'are': 50, 'but': 40,
      'not': 45, 'you': 55, 'all': 35, 'can': 40, 'had': 30
    };
    
    return commonWords[word.toLowerCase()] || Math.max(1, Math.floor(10 / length));
  }

  getDefaultStats() {
    return {
      effort: 0,
      distance: 0,
      pinky_distance: 0,
      pinky_off_home_pct: 0,
      same_finger_bigrams_pct: 0,
      skip_bigrams_pct: 0,
      skip_bigrams2_pct: 0,
      lateral_stretch_pct: 0,
      pinky_scissors_pct: 0,
      two_row_sfb_pct: 0,
      two_row_jumps_pct: 0,
      trigram_alt_pct: 0,
      tri_redirect_pct: 0,
      roll_in_pct: 0,
      roll_out_pct: 0,
      col5_6_pct: 0
    };
  }

  // Analyze typing test results to identify weak areas
  analyzeTypingTest(testResults, layoutData) {
    const analysis = {
      weak_fingers: [],
      problem_bigrams: [],
      recommended_practice: [],
      layout_suggestions: []
    };

    if (!testResults || !testResults.errors_by_key) {
      return analysis;
    }

    // Find fingers with high error rates
    const fingerErrors = {};
    const fingerUsage = {};
    
    for (const [key, errorCount] of Object.entries(testResults.errors_by_key)) {
      const pos = this.getKeyPosition(key, layoutData);
      if (pos) {
        const finger = pos.finger;
        fingerErrors[finger] = (fingerErrors[finger] || 0) + errorCount;
        fingerUsage[finger] = (fingerUsage[finger] || 0) + 1;
      }
    }

    // Calculate error rates by finger
    for (const [finger, errors] of Object.entries(fingerErrors)) {
      const usage = fingerUsage[finger] || 1;
      const errorRate = errors / usage;
      
      if (errorRate > 0.05) { // 5% error rate threshold
        analysis.weak_fingers.push({
          finger: parseInt(finger),
          error_rate: errorRate,
          total_errors: errors
        });
      }
    }

    // Sort weak fingers by error rate
    analysis.weak_fingers.sort((a, b) => b.error_rate - a.error_rate);

    return analysis;
  }

  // Generate layout recommendations based on user profile
  recommendLayouts(userProfile, availableLayouts) {
    const recommendations = [];
    
    if (!userProfile || !availableLayouts || availableLayouts.length === 0) {
      return recommendations;
    }

    // Define scoring weights based on user profile
    const weights = this.getProfileWeights(userProfile);
    
    // Score each layout
    for (const layout of availableLayouts) {
      if (!layout.stats) continue;
      
      let score = 0;
      let weightSum = 0;
      
      for (const [metric, weight] of Object.entries(weights)) {
        if (layout.stats[metric] !== undefined) {
          // Lower is better for most metrics (convert to score where higher is better)
          const normalizedValue = this.normalizeMetric(metric, layout.stats[metric]);
          score += normalizedValue * weight;
          weightSum += Math.abs(weight);
        }
      }
      
      if (weightSum > 0) {
        score = score / weightSum;
        recommendations.push({
          ...layout,
          recommendation_score: score,
          reasons: this.getRecommendationReasons(layout, userProfile)
        });
      }
    }
    
    // Sort by score (higher is better)
    recommendations.sort((a, b) => b.recommendation_score - a.recommendation_score);
    
    return recommendations.slice(0, 10); // Return top 10
  }

  getProfileWeights(profile) {
    const baseWeights = {
      effort: 0.2,
      distance: 0.15,
      same_finger_bigrams_pct: -0.2,
      lateral_stretch_pct: -0.15,
      roll_in_pct: 0.15,
      roll_out_pct: 0.1
    };

    switch (profile.type) {
      case 'developer':
        return {
          ...baseWeights,
          lateral_stretch_pct: -0.25,
          same_finger_bigrams_pct: -0.25,
          skip_bigrams_pct: -0.15
        };
      
      case 'writer':
        return {
          ...baseWeights,
          effort: 0.3,
          roll_in_pct: 0.25,
          trigram_alt_pct: 0.15
        };
      
      case 'gamer':
        return {
          ...baseWeights,
          distance: 0.25,
          effort: 0.2,
          col5_6_pct: -0.15
        };
      
      case 'casual':
      default:
        return baseWeights;
    }
  }

  normalizeMetric(metric, value) {
    // Normalize metrics to 0-1 scale where 1 is best
    const ranges = {
      effort: { min: 300, max: 1500 },
      distance: { min: 150, max: 400 },
      same_finger_bigrams_pct: { min: 0, max: 10 },
      lateral_stretch_pct: { min: 0, max: 8 },
      roll_in_pct: { min: 10, max: 40 },
      roll_out_pct: { min: 5, max: 30 }
    };
    
    const range = ranges[metric];
    if (!range) return 0;
    
    // Clamp value to range
    const clampedValue = Math.max(range.min, Math.min(range.max, value));
    
    // For metrics where lower is better, invert the scale
    const badMetrics = ['effort', 'distance', 'same_finger_bigrams_pct', 'lateral_stretch_pct'];
    if (badMetrics.includes(metric)) {
      return 1 - (clampedValue - range.min) / (range.max - range.min);
    } else {
      return (clampedValue - range.min) / (range.max - range.min);
    }
  }

  getRecommendationReasons(layout, profile) {
    const reasons = [];
    const stats = layout.stats;
    
    if (stats.same_finger_bigrams_pct < 2) {
      reasons.push('Very low same-finger bigrams');
    }
    if (stats.effort < 500) {
      reasons.push('Low typing effort required');
    }
    if (stats.roll_in_pct > 25) {
      reasons.push('High inward roll percentage');
    }
    if (stats.lateral_stretch_pct < 3) {
      reasons.push('Minimal lateral stretching');
    }
    
    return reasons;
  }
}

module.exports = LayoutAnalyzer;
