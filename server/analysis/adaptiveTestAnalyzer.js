/**
 * Adaptive Typing Test Analyzer
 * 
 * This module implements an intelligent adaptive typing test system that:
 * 1. Analyzes typing performance across 5 sequential tests
 * 2. Generates progressively targeted text based on identified weaknesses
 * 3. Uses the layout analyzer to recommend optimal layouts
 * 4. Focuses on weak fingers, problematic bigrams, and error patterns
 */

const { analyzeLayout } = require('./advancedAnalyzer');
const database = require('../utils/database');

// Finger mapping for analysis
const FINGER_MAP = {
  'q': 'LP', 'w': 'LR', 'e': 'LM', 'r': 'LI', 't': 'LI', 
  'y': 'RI', 'u': 'RI', 'i': 'RM', 'o': 'RR', 'p': 'RP',
  'a': 'LP', 's': 'LR', 'd': 'LM', 'f': 'LI', 'g': 'LI', 
  'h': 'RI', 'j': 'RI', 'k': 'RM', 'l': 'RR', ';': 'RP',
  'z': 'LP', 'x': 'LR', 'c': 'LM', 'v': 'LI', 'b': 'LI', 
  'n': 'RI', 'm': 'RI', ',': 'RM', '.': 'RR', '/': 'RP',
  ' ': 'thumb'
};

// Common English words organized by which fingers are heavily used
const FINGER_FOCUSED_WORDS = {
  'LP': ['apple', 'quiz', 'plaza', 'pizza', 'aqua', 'equal', 'square', 'quilt', 'quiet', 'zebra', 'zero', 'zone', 'azure', 'waltz', 'aztec', 'quake'],
  'LR': ['words', 'sword', 'sweet', 'sweat', 'wrist', 'worst', 'worse', 'waste', 'swing', 'swirl', 'sweep', 'swift', 'swamp', 'swell', 'swiss', 'swish'],
  'LM': ['dance', 'decide', 'device', 'demand', 'defend', 'develop', 'dense', 'debate', 'decode', 'delete', 'decide', 'decade', 'deeper', 'detail', 'desert', 'defeat'],
  'LI': ['right', 'fight', 'tight', 'light', 'might', 'sight', 'bright', 'flight', 'freight', 'tiger', 'tower', 'frost', 'first', 'treat', 'forty', 'fruit'],
  'RI': ['unity', 'youth', 'young', 'yours', 'yield', 'yummy', 'unique', 'until', 'under', 'unity', 'usual', 'ultra', 'urban', 'uncle', 'usage', 'users'],
  'RM': ['image', 'music', 'magic', 'quick', 'major', 'minor', 'mixer', 'micro', 'middle', 'mouse', 'movie', 'mouth', 'month', 'money', 'model', 'mixed'],
  'RR': ['order', 'other', 'offer', 'owner', 'older', 'outer', 'opera', 'occur', 'ocean', 'orbit', 'organ', 'olive', 'orbit', 'overt', 'onion', 'often'],
  'RP': ['people', 'purple', 'pepper', 'proper', 'paper', 'power', 'point', 'place', 'please', 'phone', 'photo', 'polar', 'price', 'prime', 'proof', 'plain']
};

// Bigram patterns that commonly cause issues
const PROBLEMATIC_BIGRAMS = [
  'th', 'he', 'in', 'er', 'an', 're', 'ed', 'nd', 'ou', 'ea', 'ni', 'se', 'on', 'al', 
  'le', 'ti', 'ng', 'ar', 'or', 'it', 'en', 'st', 'es', 'of', 'te', 'ha', 'as', 'nt'
];

// Common words containing challenging bigrams
const BIGRAM_WORDS = {
  'th': ['think', 'there', 'three', 'through', 'throw', 'thick', 'thumb', 'theater', 'thread', 'thrill', 'thanks', 'theory'],
  'he': ['here', 'help', 'heart', 'heavy', 'health', 'heaven', 'heater', 'height', 'helicopter', 'heritage', 'hemisphere', 'herbal'],
  'in': ['into', 'inside', 'income', 'indeed', 'inform', 'inner', 'invite', 'index', 'inquiry', 'initial', 'insight', 'instant'],
  'er': ['never', 'error', 'other', 'water', 'after', 'under', 'power', 'center', 'energy', 'emerge', 'expert', 'entire'],
  'ou': ['house', 'mouse', 'sound', 'found', 'round', 'group', 'young', 'double', 'around', 'course', 'source', 'though'],
  'ng': ['things', 'strong', 'spring', 'finger', 'single', 'jungle', 'angle', 'longer', 'hunger', 'danger', 'stranger', 'arrange'],
  'ed': ['ended', 'needed', 'worked', 'played', 'helped', 'called', 'moved', 'turned', 'opened', 'closed', 'walked', 'talked'],
  'nd': ['ground', 'found', 'second', 'kind', 'hand', 'land', 'stand', 'understand', 'around', 'behind', 'friend', 'trend'],
  'st': ['first', 'last', 'most', 'fast', 'best', 'just', 'start', 'stop', 'story', 'system', 'trust', 'exist'],
  'le': ['table', 'people', 'little', 'able', 'simple', 'example', 'middle', 'single', 'title', 'noble', 'gentle', 'circle']
};

class AdaptiveTestAnalyzer {
  constructor() {
    this.testResults = [];
    this.weaknessProfile = {
      weakFingers: {},
      weakBigrams: {},
      errorPatterns: {},
      commonMistakes: {},
      overallTrends: {}
    };
  }

  /**
   * Analyze a completed test and update weakness profile
   */
  analyzeTestResult(testData) {
    const {
      userInput,
      targetText,
      keyStats,
      fingerStats,
      wpm,
      accuracy,
      testNumber
    } = testData;

    // Store test result
    this.testResults.push({
      testNumber,
      wpm,
      accuracy,
      keyStats,
      fingerStats,
      timestamp: Date.now()
    });

    // Update weakness analysis
    this.updateWeaknessProfile(testData);
    
    return {
      weaknessProfile: this.weaknessProfile,
      testSummary: {
        wpm,
        accuracy,
        weakestFingers: this.getWeakestFingers(),
        mostMissedBigrams: this.getMostMissedBigrams(),
        improvementAreas: this.getImprovementAreas()
      }
    };
  }

  /**
   * Generate targeted text for the next test based on current weaknesses
   */
  generateAdaptiveText(testNumber, previousResults = []) {
    if (testNumber === 1) {
      // First test: baseline assessment with common English
      return this.generateBaselineText();
    }
    
    if (testNumber === 2) {
      // Second test: focus on identified weak fingers
      return this.generateFingerTargetedText();
    }
    
    if (testNumber === 3) {
      // Third test: focus on problematic bigrams
      return this.generateBigramTargetedText();
    }
    
    if (testNumber === 4) {
      // Fourth test: challenging sequences and flow
      return this.generateFlowTargetedText();
    }
    
    if (testNumber === 5) {
      // Fifth test: comprehensive challenge combining all weak areas
      return this.generateComprehensiveText();
    }

    return this.generateBaselineText();
  }

  /**
   * Generate baseline text for initial assessment
   */
  generateBaselineText() {
    const commonWords = [
      'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
      'his', 'from', 'they', 'she', 'her', 'been', 'than', 'its', 'who', 'did',
      'yes', 'has', 'had', 'let', 'put', 'too', 'old', 'any', 'may', 'can',
      'say', 'use', 'how', 'our', 'out', 'day', 'get', 'man', 'new', 'now',
      'way', 'see', 'him', 'two', 'all', 'were', 'one', 'are', 'was', 'will',
      'time', 'work', 'life', 'year', 'back', 'call', 'come', 'each', 'first',
      'good', 'great', 'know', 'last', 'long', 'make', 'part', 'place', 'right',
      'take', 'think', 'want', 'water', 'well', 'where', 'world', 'would', 'write'
    ];

    return this.shuffleAndJoin(commonWords, 45);
  }

  /**
   * Generate text targeting weak fingers
   */
  generateFingerTargetedText() {
    const weakFingers = this.getWeakestFingers();
    let targetWords = [];

    // Include words that heavily use the weakest fingers
    weakFingers.forEach(finger => {
      if (FINGER_FOCUSED_WORDS[finger]) {
        targetWords.push(...FINGER_FOCUSED_WORDS[finger].slice(0, 8));
      }
    });

    // Fill remaining with general words if needed
    if (targetWords.length < 30) {
      const fillerWords = ['time', 'work', 'life', 'year', 'back', 'call', 'come', 'each'];
      targetWords.push(...fillerWords);
    }

    return this.shuffleAndJoin(targetWords, 35);
  }

  /**
   * Generate text focusing on problematic bigrams
   */
  generateBigramTargetedText() {
    const weakBigrams = this.getMostMissedBigrams();
    let targetWords = [];

    // Include words containing problematic bigrams
    weakBigrams.forEach(bigram => {
      if (BIGRAM_WORDS[bigram]) {
        targetWords.push(...BIGRAM_WORDS[bigram].slice(0, 6));
      }
    });

    // Add general bigram-heavy words
    const challengingWords = [
      'through', 'thought', 'strength', 'together', 'another', 'nothing', 
      'everything', 'something', 'anything', 'everything', 'everyone'
    ];
    targetWords.push(...challengingWords);

    return this.shuffleAndJoin(targetWords, 35);
  }

  /**
   * Generate text focusing on typing flow and rhythm
   */
  generateFlowTargetedText() {
    // Words that test hand alternation and rolls
    const flowWords = [
      'keyboard', 'layout', 'finger', 'typing', 'rhythm', 'flowing', 'smooth',
      'balance', 'comfort', 'natural', 'effortless', 'graceful', 'seamless',
      'harmonious', 'coordinated', 'synchronized', 'optimized', 'efficient'
    ];

    // Add some challenging sequences
    const challengingSequences = [
      'quick brown fox jumps over lazy dog',
      'pack my box with five dozen liquor jugs',
      'the five boxing wizards jump quickly'
    ];

    const combined = [...flowWords, ...challengingSequences.join(' ').split(' ')];
    return this.shuffleAndJoin(combined, 40);
  }

  /**
   * Generate comprehensive test combining all identified weaknesses
   */
  generateComprehensiveText() {
    const weakFingers = this.getWeakestFingers();
    const weakBigrams = this.getMostMissedBigrams();
    
    let comprehensiveWords = [];

    // Add words targeting weak fingers
    weakFingers.slice(0, 3).forEach(finger => {
      if (FINGER_FOCUSED_WORDS[finger]) {
        comprehensiveWords.push(...FINGER_FOCUSED_WORDS[finger].slice(0, 5));
      }
    });

    // Add words targeting weak bigrams
    weakBigrams.slice(0, 3).forEach(bigram => {
      if (BIGRAM_WORDS[bigram]) {
        comprehensiveWords.push(...BIGRAM_WORDS[bigram].slice(0, 4));
      }
    });

    // Add some flow-challenging words
    const flowChallenges = [
      'extraordinary', 'incomprehensible', 'straightforward', 'overwhelming',
      'understanding', 'revolutionary', 'sophisticated', 'comprehensive'
    ];
    comprehensiveWords.push(...flowChallenges);

    return this.shuffleAndJoin(comprehensiveWords, 45);
  }

  /**
   * Update weakness profile based on test results
   */
  updateWeaknessProfile(testData) {
    const { keyStats, fingerStats } = testData;

    // Update finger weaknesses
    Object.entries(fingerStats).forEach(([finger, stats]) => {
      if (!this.weaknessProfile.weakFingers[finger]) {
        this.weaknessProfile.weakFingers[finger] = { errors: 0, total: 0 };
      }
      
      this.weaknessProfile.weakFingers[finger].errors += stats.incorrect;
      this.weaknessProfile.weakFingers[finger].total += stats.correct + stats.incorrect;
    });

    // Analyze bigrams for weaknesses
    this.analyzeBigrams(testData.userInput, testData.targetText);
  }

  /**
   * Analyze bigram performance
   */
  analyzeBigrams(userInput, targetText) {
    for (let i = 0; i < Math.min(userInput.length - 1, targetText.length - 1); i++) {
      const targetBigram = targetText.slice(i, i + 2);
      const userBigram = userInput.slice(i, i + 2);
      
      if (!this.weaknessProfile.weakBigrams[targetBigram]) {
        this.weaknessProfile.weakBigrams[targetBigram] = { errors: 0, total: 0 };
      }
      
      this.weaknessProfile.weakBigrams[targetBigram].total++;
      if (targetBigram !== userBigram) {
        this.weaknessProfile.weakBigrams[targetBigram].errors++;
      }
    }
  }

  /**
   * Get the weakest fingers based on error rate
   */
  getWeakestFingers() {
    const fingerScores = Object.entries(this.weaknessProfile.weakFingers)
      .map(([finger, stats]) => ({
        finger,
        errorRate: stats.total > 0 ? stats.errors / stats.total : 0,
        total: stats.total
      }))
      .filter(f => f.total >= 5) // Only consider fingers with enough data
      .sort((a, b) => b.errorRate - a.errorRate);

    return fingerScores.slice(0, 3).map(f => f.finger);
  }

  /**
   * Get the most problematic bigrams
   */
  getMostMissedBigrams() {
    const bigramScores = Object.entries(this.weaknessProfile.weakBigrams)
      .map(([bigram, stats]) => ({
        bigram,
        errorRate: stats.total > 0 ? stats.errors / stats.total : 0,
        total: stats.total
      }))
      .filter(b => b.total >= 3) // Only consider bigrams with enough data
      .sort((a, b) => b.errorRate - a.errorRate);

    return bigramScores.slice(0, 5).map(b => b.bigram);
  }

  /**
   * Get areas needing improvement
   */
  getImprovementAreas() {
    const areas = [];
    
    const weakFingers = this.getWeakestFingers();
    if (weakFingers.length > 0) {
      areas.push({
        type: 'fingers',
        description: `Weak fingers: ${weakFingers.join(', ')}`,
        severity: 'high'
      });
    }

    const weakBigrams = this.getMostMissedBigrams();
    if (weakBigrams.length > 0) {
      areas.push({
        type: 'bigrams',
        description: `Problematic letter combinations: ${weakBigrams.join(', ')}`,
        severity: 'medium'
      });
    }

    // Analyze overall trends
    const recentTests = this.testResults.slice(-3);
    if (recentTests.length >= 2) {
      const wpmTrend = recentTests[recentTests.length - 1].wpm - recentTests[0].wpm;
      const accuracyTrend = recentTests[recentTests.length - 1].accuracy - recentTests[0].accuracy;
      
      if (wpmTrend < -5) {
        areas.push({
          type: 'speed',
          description: 'Speed declining during test sequence',
          severity: 'medium'
        });
      }
      
      if (accuracyTrend < -5) {
        areas.push({
          type: 'accuracy',
          description: 'Accuracy declining during test sequence',
          severity: 'high'
        });
      }
    }

    return areas;
  }

  /**
   * Recommend layouts based on identified weaknesses
   */
  async recommendLayouts() {
    try {
      // Get all available layouts
      const layoutsResult = await database.query(`
        SELECT l.*, ls.* FROM layouts l
        LEFT JOIN layout_stats ls ON l.id = ls.layout_id
        WHERE ls.effort IS NOT NULL
        ORDER BY ls.effort ASC, ls.same_finger_bigrams_pct ASC
      `);

      const layouts = layoutsResult.rows.map(layout => ({
        ...layout,
        visual_data: JSON.parse(layout.visual_data || '{"keys": {}}')
      }));

      // Analyze each layout for the user's specific weaknesses
      const recommendations = [];
      const weakFingers = this.getWeakestFingers();
      const weakBigrams = this.getMostMissedBigrams();

      for (const layout of layouts) {
        const score = this.calculateLayoutScore(layout, weakFingers, weakBigrams);
        recommendations.push({
          layout: {
            id: layout.id,
            name: layout.name,
            slug: layout.slug,
            description: layout.description
          },
          score,
          stats: {
            effort: layout.effort,
            same_finger_bigrams_pct: layout.same_finger_bigrams_pct,
            pinky_scissors_pct: layout.pinky_scissors_pct,
            roll_in_pct: layout.roll_in_pct,
            trigram_alt_pct: layout.trigram_alt_pct
          },
          reasoning: this.generateRecommendationReasoning(layout, weakFingers, weakBigrams, score)
        });
      }

      // Sort by score and return top 5
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    } catch (error) {
      console.error('Error recommending layouts:', error);
      throw error;
    }
  }

  /**
   * Calculate a layout score based on user weaknesses
   */
  calculateLayoutScore(layout, weakFingers, weakBigrams) {
    let score = 100; // Base score

    // Penalize based on overall metrics (updated thresholds)
    score -= Math.max(0, (layout.effort - 8.0) * 5); // Prefer effort < 8.0
    score -= layout.same_finger_bigrams_pct * 8; // Heavily penalize SFBs
    score -= layout.pinky_scissors_pct * 10; // Penalize pinky scissors
    score += Math.min(layout.roll_in_pct * 0.8, 20); // Bonus for good inward flow
    score += Math.min(layout.trigram_alt_pct * 0.4, 15); // Bonus for hand alternation
    score -= Math.max(0, (layout.lateral_stretch_pct - 5.0) * 3); // Penalize excessive stretches
    
    // Distance penalty (prefer distance < 22)
    score -= Math.max(0, (layout.distance - 22.0) * 2);
    
    // Two-row jump penalty
    score -= layout.two_row_jumps_pct * 5;

    // Specific adjustments based on user weaknesses
    if (weakFingers.includes('LP') || weakFingers.includes('RP')) {
      // User has weak pinkies - prefer layouts with less pinky usage
      score += Math.max(0, (50 - layout.pinky_off_home_pct) * 0.3);
      score -= layout.pinky_distance * 2; // Extra penalty for pinky distance
    }
    
    if (weakFingers.includes('LI') || weakFingers.includes('RI')) {
      // User has weak index fingers - bonus for layouts that don't overuse them
      score += Math.min(10, Math.max(0, (40 - layout.col5_6_pct) * 0.2));
    }
    
    // Bonus for layouts with good balance
    if (layout.roll_out_pct && layout.roll_in_pct) {
      const rollBalance = Math.min(layout.roll_in_pct, layout.roll_out_pct) / Math.max(layout.roll_in_pct, layout.roll_out_pct);
      score += rollBalance * 5; // Bonus for balanced rolls
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate reasoning for layout recommendation
   */
  generateRecommendationReasoning(layout, weakFingers, weakBigrams, score) {
    const reasons = [];

    if (layout.effort < 8.5) {
      reasons.push('Low overall typing effort');
    }

    if (layout.same_finger_bigrams_pct < 4.0) {
      reasons.push('Minimal same-finger bigrams');
    }

    if (layout.roll_in_pct > 25) {
      reasons.push('Excellent inward roll flow');
    }

    if (layout.trigram_alt_pct > 35) {
      reasons.push('Strong hand alternation');
    }

    if (layout.distance < 22) {
      reasons.push('Reduced finger travel distance');
    }

    if (layout.lateral_stretch_pct < 5.0) {
      reasons.push('Minimal lateral finger stretches');
    }

    if (weakFingers.includes('LP') || weakFingers.includes('RP')) {
      if (layout.pinky_off_home_pct < 30) {
        reasons.push('Reduced pinky usage');
      }
      if (layout.pinky_scissors_pct < 2.0) {
        reasons.push('Low pinky strain');
      }
    }
    
    if (weakFingers.includes('LI') || weakFingers.includes('RI')) {
      if (layout.col5_6_pct < 35) {
        reasons.push('Balanced index finger load');
      }
    }
    
    // Add specific weakness targeting
    if (weakBigrams.length > 0) {
      reasons.push(`Addresses problematic ${weakBigrams.slice(0, 2).join(', ')} combinations`);
    }

    if (reasons.length === 0) {
      reasons.push('Well-balanced ergonomic design');
    }

    return reasons.join(', ');
  }

  /**
   * Utility function to shuffle and join words
   */
  shuffleAndJoin(words, count) {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    return selected.join(' ');
  }

  /**
   * Get comprehensive results after all tests
   */
  getFinalResults() {
    return {
      testResults: this.testResults,
      weaknessProfile: this.weaknessProfile,
      overallTrends: this.calculateOverallTrends(),
      improvementPlan: this.generateImprovementPlan()
    };
  }

  /**
   * Calculate overall performance trends
   */
  calculateOverallTrends() {
    if (this.testResults.length < 2) return null;

    const firstTest = this.testResults[0];
    const lastTest = this.testResults[this.testResults.length - 1];

    return {
      wpmChange: lastTest.wpm - firstTest.wpm,
      accuracyChange: lastTest.accuracy - firstTest.accuracy,
      consistency: this.calculateConsistency(),
      learningRate: this.calculateLearningRate()
    };
  }

  /**
   * Calculate typing consistency across tests
   */
  calculateConsistency() {
    if (this.testResults.length < 3) return null;

    const wpms = this.testResults.map(t => t.wpm);
    const mean = wpms.reduce((sum, wpm) => sum + wpm, 0) / wpms.length;
    const variance = wpms.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpms.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Consistency score (lower standard deviation = higher consistency)
    return Math.max(0, 100 - (standardDeviation / mean * 100));
  }

  /**
   * Calculate learning rate during the test sequence
   */
  calculateLearningRate() {
    if (this.testResults.length < 3) return 0;

    const improvements = [];
    for (let i = 1; i < this.testResults.length; i++) {
      const improvement = this.testResults[i].wpm - this.testResults[i-1].wpm;
      improvements.push(improvement);
    }

    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  }

  /**
   * Generate improvement plan based on results
   */
  generateImprovementPlan() {
    const plan = [];
    const weakFingers = this.getWeakestFingers();
    const weakBigrams = this.getMostMissedBigrams();

    if (weakFingers.length > 0) {
      plan.push({
        focus: 'Finger Strength',
        description: `Practice exercises targeting ${weakFingers.join(', ')} fingers`,
        exercises: this.generateFingerExercises(weakFingers)
      });
    }

    if (weakBigrams.length > 0) {
      plan.push({
        focus: 'Letter Combinations',
        description: `Work on ${weakBigrams.join(', ')} bigram patterns`,
        exercises: this.generateBigramExercises(weakBigrams)
      });
    }

    const trends = this.calculateOverallTrends();
    if (trends && trends.consistency < 80) {
      plan.push({
        focus: 'Consistency',
        description: 'Work on maintaining steady typing rhythm',
        exercises: ['Practice with metronome', 'Focus on smooth finger movements', 'Regular short practice sessions']
      });
    }

    return plan;
  }

  /**
   * Generate finger-specific exercises
   */
  generateFingerExercises(weakFingers) {
    const exercises = [];
    
    weakFingers.forEach(finger => {
      if (FINGER_FOCUSED_WORDS[finger]) {
        const words = FINGER_FOCUSED_WORDS[finger].slice(0, 5).join(' ');
        exercises.push(`${finger} finger: "${words}"`);
      }
    });

    return exercises;
  }

  /**
   * Generate bigram-specific exercises
   */
  generateBigramExercises(weakBigrams) {
    const exercises = [];
    
    weakBigrams.forEach(bigram => {
      if (BIGRAM_WORDS[bigram]) {
        const words = BIGRAM_WORDS[bigram].slice(0, 3).join(' ');
        exercises.push(`"${bigram}" pattern: "${words}"`);
      }
    });

    return exercises;
  }
}

module.exports = AdaptiveTestAnalyzer;
