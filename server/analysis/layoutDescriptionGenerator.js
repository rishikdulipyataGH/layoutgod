/**
 * Layout Description Generator and Recommendation System
 * 
 * This module uses the advanced analyzer engine to create sophisticated, informative
 * descriptions for keyboard layouts along with actionable recommendations for improvement.
 * 
 * Features:
 * - Intelligent layout assessment based on multiple metrics
 * - Contextual descriptions highlighting strengths and weaknesses
 * - Specific, actionable recommendations for layout optimization
 * - Comparative analysis against layout archetypes
 * - User-friendly explanations of complex metrics
 */

const { analyzeLayout, keyPositions, fingerNames } = require('./advancedAnalyzer');

// Layout archetype definitions for comparative analysis
const LAYOUT_ARCHETYPES = {
  qwerty: {
    name: 'QWERTY',
    category: 'Traditional',
    strengths: ['familiarity', 'widespread adoption', 'easy transition'],
    weaknesses: ['high same finger bigrams', 'poor finger balance', 'weak alternation'],
    typicalMetrics: {
      effort: 12.5,
      same_finger_bigrams_pct: 6.8,
      roll_in_pct: 15.2,
      roll_out_pct: 12.8,
      trigram_alt_pct: 22.1
    }
  },
  dvorak: {
    name: 'Dvorak',
    category: 'Alternating',
    strengths: ['high alternation', 'vowel-consonant separation', 'home row focus'],
    weaknesses: ['learning curve', 'some awkward bigrams', 'software compatibility'],
    typicalMetrics: {
      effort: 9.2,
      same_finger_bigrams_pct: 2.8,
      roll_in_pct: 18.5,
      roll_out_pct: 16.3,
      trigram_alt_pct: 42.7
    }
  },
  colemak: {
    name: 'Colemak',
    category: 'Balanced',
    strengths: ['good rolls', 'balanced hands', 'moderate learning curve'],
    weaknesses: ['some lateral stretches', 'HE bigram on same finger'],
    typicalMetrics: {
      effort: 8.9,
      same_finger_bigrams_pct: 1.8,
      roll_in_pct: 24.6,
      roll_out_pct: 20.1,
      trigram_alt_pct: 28.4
    }
  },
  workman: {
    name: 'Workman',
    category: 'Comfort-focused',
    strengths: ['reduced lateral movement', 'strong finger prioritization', 'good bigram flow'],
    weaknesses: ['complex learning curve', 'some awkward sequences'],
    typicalMetrics: {
      effort: 8.4,
      same_finger_bigrams_pct: 2.1,
      roll_in_pct: 21.3,
      roll_out_pct: 19.7,
      trigram_alt_pct: 31.2
    }
  }
};

// Metric explanations and thresholds
const METRIC_INFO = {
  effort: {
    name: 'Typing Effort',
    description: 'Overall physical effort required to type, considering finger strength and key positions',
    excellent: 8.5,
    good: 10.0,
    poor: 12.0,
    unit: '',
    lowerIsBetter: true,
    explanation: 'Lower effort means less physical strain and faster typing potential'
  },
  distance: {
    name: 'Finger Travel Distance',
    description: 'Average distance fingers must travel between keystrokes',
    excellent: 18.0,
    good: 22.0,
    poor: 25.0,
    unit: 'mm',
    lowerIsBetter: true,
    explanation: 'Reduced finger travel improves speed and reduces fatigue'
  },
  same_finger_bigrams_pct: {
    name: 'Same Finger Bigrams',
    description: 'Percentage of common letter pairs that require the same finger',
    excellent: 4.0,
    good: 7.0,
    poor: 10.0,
    unit: '%',
    lowerIsBetter: true,
    explanation: 'Same finger bigrams slow down typing and increase errors'
  },
  roll_in_pct: {
    name: 'Inward Rolls',
    description: 'Percentage of comfortable inward rolling motions',
    excellent: 25.0,
    good: 20.0,
    poor: 15.0,
    unit: '%',
    lowerIsBetter: false,
    explanation: 'Inward rolls feel natural and enable fast, flowing typing'
  },
  roll_out_pct: {
    name: 'Outward Rolls',
    description: 'Percentage of outward rolling motions',
    excellent: 25.0,
    good: 20.0,
    poor: 15.0,
    unit: '%',
    lowerIsBetter: false,
    explanation: 'Outward rolls are less comfortable than inward rolls but still efficient'
  },
  trigram_alt_pct: {
    name: 'Hand Alternation',
    description: 'Percentage of three-letter sequences that alternate between hands',
    excellent: 35.0,
    good: 27.0,
    poor: 20.0,
    unit: '%',
    lowerIsBetter: false,
    explanation: 'Hand alternation allows one hand to rest while the other types'
  },
  lateral_stretch_pct: {
    name: 'Lateral Stretches',
    description: 'Percentage of uncomfortable lateral finger stretches',
    excellent: 3.0,
    good: 5.0,
    poor: 8.0,
    unit: '%',
    lowerIsBetter: true,
    explanation: 'Lateral stretches are uncomfortable and can cause strain over time'
  },
  pinky_scissors_pct: {
    name: 'Pinky Scissors',
    description: 'Percentage of awkward pinky scissor motions',
    excellent: 0.5,
    good: 2.0,
    poor: 4.0,
    unit: '%',
    lowerIsBetter: true,
    explanation: 'Pinky scissors are particularly uncomfortable due to weak pinky strength'
  },
  two_row_jumps_pct: {
    name: 'Two Row Jumps',
    description: 'Percentage of bigrams requiring jumps across two or more rows',
    excellent: 8.0,
    good: 15.0,
    poor: 25.0,
    unit: '%',
    lowerIsBetter: true,
    explanation: 'Large row jumps slow down typing and increase error rates'
  },
  skip_bigrams_pct: {
    name: 'Skip Bigrams',
    description: 'Percentage of bigrams that skip over adjacent keys',
    excellent: 3.0,
    good: 6.0,
    poor: 10.0,
    unit: '%',
    lowerIsBetter: true,
    explanation: 'Skip bigrams require less precise finger coordination'
  }
};

// Category definitions for layout classification
const LAYOUT_CATEGORIES = {
  traditional: {
    name: 'Traditional',
    description: 'Layouts that prioritize familiarity and ease of transition',
    characteristics: ['moderate effort', 'familiar key positions', 'gradual learning curve']
  },
  alternating: {
    name: 'Alternating',
    description: 'Layouts optimized for hand alternation and rhythm',
    characteristics: ['high alternation', 'vowel-consonant separation', 'rhythmic flow']
  },
  rolling: {
    name: 'Rolling',
    description: 'Layouts designed for smooth finger rolling motions',
    characteristics: ['high roll percentages', 'directional flow', 'same-hand efficiency']
  },
  comfort: {
    name: 'Comfort-focused',
    description: 'Layouts prioritizing ergonomics and reduced strain',
    characteristics: ['low effort', 'reduced stretches', 'strong finger emphasis']
  },
  balanced: {
    name: 'Balanced',
    description: 'Layouts that balance multiple optimization criteria',
    characteristics: ['good overall metrics', 'few major weaknesses', 'versatile performance']
  },
  experimental: {
    name: 'Experimental',
    description: 'Layouts with unique or unconventional approaches',
    characteristics: ['novel key arrangements', 'specialized optimizations', 'research-based']
  }
};

class LayoutDescriptionGenerator {
  constructor() {
    this.analysisCache = new Map();
  }

  /**
   * Generate a comprehensive description for a layout
   */
  async generateDescription(layout, layoutName = 'Custom Layout') {
    // Get analysis results
    const analysis = this.getAnalysis(layout);
    
    // Classify the layout
    const category = this.classifyLayout(analysis);
    
    // Generate description components
    const overview = this.generateOverview(analysis, layoutName, category);
    const strengths = this.identifyStrengths(analysis);
    const weaknesses = this.identifyWeaknesses(analysis);
    const comparison = this.compareToArchetypes(analysis);
    
    // Combine into comprehensive description
    const description = this.formatDescription({
      overview,
      strengths,
      weaknesses,
      comparison,
      category
    });

    return {
      description,
      category: category.name,
      strengths,
      weaknesses,
      recommendations: this.generateRecommendations(analysis, weaknesses),
      analysis
    };
  }

  /**
   * Generate specific recommendations for layout improvement
   */
  generateRecommendations(analysis, weaknesses) {
    const recommendations = [];

    // Same finger bigram recommendations
    if (analysis.same_finger_bigrams_pct > 6.0) {
      recommendations.push({
        priority: 'high',
        category: 'Bigram Optimization',
        issue: 'High same finger bigrams',
        description: `At ${analysis.same_finger_bigrams_pct}%, your layout has too many common letter pairs on the same finger.`,
        suggestions: [
          'Separate common bigrams like "th", "he", "er", "in" to different fingers',
          'Move frequently used vowels away from common consonants on the same finger',
          'Consider alternating hand patterns for high-frequency bigrams'
        ],
        impact: 'Reducing same finger bigrams by 2-3% can increase typing speed by 8-15%'
      });
    }

    // Effort recommendations
    if (analysis.effort > 10.0) {
      recommendations.push({
        priority: 'high',
        category: 'Typing Effort',
        issue: 'High typing effort',
        description: `With an effort score of ${analysis.effort}, your layout requires more physical strain than optimal.`,
        suggestions: [
          'Move common letters to home row positions (a, s, d, f, j, k, l)',
          'Prioritize strong fingers (index and middle) for frequent letters',
          'Reduce pinky usage for high-frequency characters',
          'Minimize bottom row usage for common letters'
        ],
        impact: 'Optimizing effort can reduce typing fatigue and increase endurance'
      });
    }

    // Roll recommendations
    const totalRolls = parseFloat(analysis.roll_in_pct) + parseFloat(analysis.roll_out_pct);
    if (totalRolls < 30.0) {
      recommendations.push({
        priority: 'medium',
        category: 'Finger Flow',
        issue: 'Low rolling percentage',
        description: `With only ${totalRolls.toFixed(1)}% rolls, your layout misses opportunities for smooth finger flow.`,
        suggestions: [
          'Group related letters to enable inward rolls (stronger → weaker fingers)',
          'Place common trigrams like "tion", "ight", "ough" on the same hand',
          'Optimize letter sequences for natural finger progression',
          'Prioritize inward rolls over outward rolls when possible'
        ],
        impact: 'Increasing rolls improves typing rhythm and can boost speed by 10-20%'
      });
    }

    // Alternation recommendations
    if (analysis.trigram_alt_pct < 25.0) {
      recommendations.push({
        priority: 'medium',
        category: 'Hand Balance',
        issue: 'Low hand alternation',
        description: `At ${analysis.trigram_alt_pct}% alternation, your layout may cause one hand to work harder than the other.`,
        suggestions: [
          'Separate vowels and consonants between hands when possible',
          'Balance high-frequency letters between left and right hands',
          'Ensure common words don\'t overuse one hand',
          'Test with real text to verify balanced hand usage'
        ],
        impact: 'Better alternation reduces fatigue and enables more consistent typing rhythm'
      });
    }

    // Problem pattern recommendations
    if (analysis.lateral_stretch_pct > 4.0) {
      recommendations.push({
        priority: 'high',
        category: 'Ergonomics',
        issue: 'High lateral stretches',
        description: `With ${analysis.lateral_stretch_pct}% lateral stretches, your layout may cause finger strain.`,
        suggestions: [
          'Avoid placing common bigrams on index finger + outer columns',
          'Redesign center column usage to minimize stretching',
          'Move problematic combinations to more comfortable positions',
          'Test stretches with different hand sizes and positions'
        ],
        impact: 'Reducing stretches prevents RSI and improves long-term typing comfort'
      });
    }

    // Pinky optimization recommendations
    if (analysis.pinky_scissors_pct > 1.5 || analysis.pinky_off_home_pct > 40) {
      recommendations.push({
        priority: 'medium',
        category: 'Pinky Optimization',
        issue: 'Pinky overuse or awkward motions',
        description: `Your layout may be overworking the pinky fingers with ${analysis.pinky_scissors_pct}% scissors and ${analysis.pinky_off_home_pct}% off-home usage.`,
        suggestions: [
          'Limit pinky usage to home positions and common punctuation',
          'Avoid placing high-frequency letters on pinky columns',
          'Minimize pinky row jumping and awkward stretches',
          'Consider moving some pinky letters to stronger fingers'
        ],
        impact: 'Optimizing pinky usage reduces the most common source of typing fatigue'
      });
    }

    // Distance optimization
    if (analysis.distance > 22.0) {
      recommendations.push({
        priority: 'medium',
        category: 'Efficiency',
        issue: 'High finger travel distance',
        description: `With ${analysis.distance}mm average travel, fingers move more than necessary.`,
        suggestions: [
          'Prioritize home row for the most common letters',
          'Cluster related letters near strong finger positions',
          'Minimize usage of top and bottom rows for frequent characters',
          'Optimize bigram distances for common letter pairs'
        ],
        impact: 'Reduced finger travel directly translates to faster typing speeds'
      });
    }

    // General layout recommendations
    recommendations.push({
      priority: 'low',
      category: 'General Optimization',
      issue: 'Layout refinement opportunities',
      description: 'Every layout can benefit from fine-tuning based on personal typing patterns.',
      suggestions: [
        'Test your layout with diverse text types (prose, code, data)',
        'Track personal bigram frequencies to optimize for your usage',
        'Consider adaptive layouts that change based on context',
        'Regular analysis and adjustment leads to continuous improvement'
      ],
      impact: 'Personalized optimization can provide 5-10% additional efficiency gains'
    });

    return recommendations;
  }

  /**
   * Get or compute analysis for a layout
   */
  getAnalysis(layout) {
    const layoutKey = JSON.stringify(layout);
    
    if (this.analysisCache.has(layoutKey)) {
      return this.analysisCache.get(layoutKey);
    }

    const analysis = analyzeLayout(layout);
    this.analysisCache.set(layoutKey, analysis);
    return analysis;
  }

  /**
   * Classify layout into categories
   */
  classifyLayout(analysis) {
    const metrics = {
      effort: parseFloat(analysis.effort),
      sfb: parseFloat(analysis.same_finger_bigrams_pct),
      rollIn: parseFloat(analysis.roll_in_pct),
      rollOut: parseFloat(analysis.roll_out_pct),
      alternation: parseFloat(analysis.trigram_alt_pct),
      stretches: parseFloat(analysis.lateral_stretch_pct || 0)
    };

    // Classification logic based on metric patterns
    if (metrics.alternation > 35) {
      return LAYOUT_CATEGORIES.alternating;
    } else if (metrics.rollIn + metrics.rollOut > 35) {
      return LAYOUT_CATEGORIES.rolling;
    } else if (metrics.effort < 9 && metrics.stretches < 3) {
      return LAYOUT_CATEGORIES.comfort;
    } else if (metrics.effort > 11 && metrics.sfb > 6) {
      return LAYOUT_CATEGORIES.traditional;
    } else if (this.isWellBalanced(metrics)) {
      return LAYOUT_CATEGORIES.balanced;
    } else {
      return LAYOUT_CATEGORIES.experimental;
    }
  }

  /**
   * Check if layout is well-balanced across metrics
   */
  isWellBalanced(metrics) {
    const scores = [
      metrics.effort < 10 ? 1 : 0,
      metrics.sfb < 5 ? 1 : 0,
      metrics.rollIn + metrics.rollOut > 25 ? 1 : 0,
      metrics.alternation > 25 ? 1 : 0,
      metrics.stretches < 4 ? 1 : 0
    ];
    return scores.reduce((a, b) => a + b, 0) >= 3;
  }

  /**
   * Generate overview description
   */
  generateOverview(analysis, layoutName, category) {
    const effort = parseFloat(analysis.effort);
    const sfb = parseFloat(analysis.same_finger_bigrams_pct);
    
    let effortDesc = effort < 9 ? 'low' : effort < 11 ? 'moderate' : 'high';
    let sfbDesc = sfb < 4 ? 'excellent' : sfb < 7 ? 'good' : 'problematic';
    
    return `${layoutName} is a ${category.name.toLowerCase()} keyboard layout with ${effortDesc} typing effort (${effort}) and ${sfbDesc} same finger bigram frequency (${sfb}%). This layout ${category.description.toLowerCase()} and exhibits ${category.characteristics.join(', ')}.`;
  }

  /**
   * Identify layout strengths
   */
  identifyStrengths(analysis) {
    const strengths = [];
    
    Object.entries(METRIC_INFO).forEach(([key, info]) => {
      const value = parseFloat(analysis[key] || 0);
      
      if (info.lowerIsBetter && value <= info.excellent) {
        strengths.push(`Excellent ${info.name.toLowerCase()} (${value}${info.unit})`);
      } else if (!info.lowerIsBetter && value >= info.excellent) {
        strengths.push(`Excellent ${info.name.toLowerCase()} (${value}${info.unit})`);
      }
    });

    // Add specific strengths based on combinations
    const rollTotal = parseFloat(analysis.roll_in_pct) + parseFloat(analysis.roll_out_pct);
    if (rollTotal > 40) {
      strengths.push('Outstanding finger flow and rolling motions');
    }

    if (parseFloat(analysis.trigram_alt_pct) > 35) {
      strengths.push('Superior hand alternation and balance');
    }

    return strengths.length > 0 ? strengths : ['Functional basic layout'];
  }

  /**
   * Identify layout weaknesses
   */
  identifyWeaknesses(analysis) {
    const weaknesses = [];
    
    Object.entries(METRIC_INFO).forEach(([key, info]) => {
      const value = parseFloat(analysis[key] || 0);
      
      if (info.lowerIsBetter && value >= info.poor) {
        weaknesses.push({
          metric: key,
          name: info.name,
          value: value,
          description: `High ${info.name.toLowerCase()} (${value}${info.unit}) may cause ${info.lowerIsBetter ? 'strain and reduced speed' : 'inefficient typing patterns'}`
        });
      } else if (!info.lowerIsBetter && value <= info.poor) {
        weaknesses.push({
          metric: key,
          name: info.name,
          value: value,
          description: `Low ${info.name.toLowerCase()} (${value}${info.unit}) limits typing ${info.lowerIsBetter ? 'efficiency' : 'flow and rhythm'}`
        });
      }
    });

    return weaknesses;
  }

  /**
   * Compare to known layout archetypes
   */
  compareToArchetypes(analysis) {
    const comparisons = {};
    
    Object.entries(LAYOUT_ARCHETYPES).forEach(([key, archetype]) => {
      let similarity = 0;
      let comparisons_count = 0;
      
      Object.entries(archetype.typicalMetrics).forEach(([metric, expected]) => {
        const actual = parseFloat(analysis[metric] || 0);
        const diff = Math.abs(actual - expected) / expected;
        similarity += Math.max(0, 1 - diff);
        comparisons_count++;
      });
      
      comparisons[archetype.name] = {
        similarity: (similarity / comparisons_count) * 100,
        strengths: archetype.strengths,
        weaknesses: archetype.weaknesses
      };
    });

    // Find best match
    const bestMatch = Object.entries(comparisons).reduce((best, [name, data]) => 
      data.similarity > best.similarity ? { name, ...data } : best, 
      { similarity: 0, name: 'Unknown' }
    );

    return {
      bestMatch: bestMatch.name,
      similarity: bestMatch.similarity.toFixed(1),
      allComparisons: comparisons
    };
  }

  /**
   * Format final description
   */
  formatDescription({ overview, strengths, weaknesses, comparison, category }) {
    let description = overview + '\n\n';
    
    // Add comparison
    if (comparison.similarity > 60) {
      description += `This layout is most similar to ${comparison.bestMatch} (${comparison.similarity}% match), sharing characteristics like ${comparison.allComparisons[comparison.bestMatch].strengths.join(' and ')}.`;
    } else {
      description += `This layout represents a unique approach that doesn't closely match traditional archetypes, making it an ${category.name.toLowerCase()} design.`;
    }
    
    description += '\n\n';
    
    // Add strengths
    if (strengths.length > 0) {
      description += `**Key Strengths:** ${strengths.join(', ')}.`;
    }
    
    description += '\n\n';
    
    // Add primary weaknesses
    if (weaknesses.length > 0) {
      const primaryWeaknesses = weaknesses.slice(0, 3).map(w => w.description);
      description += `**Areas for Improvement:** ${primaryWeaknesses.join(', ')}.`;
    }

    return description.trim();
  }

  /**
   * Generate recommendations for live analysis (shorter, more focused)
   */
  generateLiveRecommendations(analysis) {
    const recs = [];
    const effort = parseFloat(analysis.effort);
    const sfb = parseFloat(analysis.same_finger_bigrams_pct);
    const totalRolls = parseFloat(analysis.roll_in_pct) + parseFloat(analysis.roll_out_pct);

    if (sfb > 7) {
      recs.push('🔧 **High Same Finger Bigrams**: Separate common pairs like "th", "he", "er" to different fingers');
    }

    if (effort > 11) {
      recs.push('💪 **Reduce Effort**: Move common letters to home row and stronger fingers');
    }

    if (totalRolls < 25) {
      recs.push('🌊 **Improve Flow**: Group related letters for smooth finger rolls');
    }

    if (parseFloat(analysis.trigram_alt_pct) < 25) {
      recs.push('⚖️ **Balance Hands**: Distribute common letters more evenly between hands');
    }

    if (parseFloat(analysis.lateral_stretch_pct) > 5) {
      recs.push('🤏 **Reduce Stretches**: Avoid uncomfortable finger extensions to outer columns');
    }

    if (recs.length === 0) {
      recs.push('✅ **Well Optimized**: Your layout shows good balance across key metrics');
    }

    return recs;
  }
}

// Export singleton instance
const layoutDescriptionGenerator = new LayoutDescriptionGenerator();

module.exports = {
  LayoutDescriptionGenerator,
  layoutDescriptionGenerator,
  METRIC_INFO,
  LAYOUT_CATEGORIES,
  LAYOUT_ARCHETYPES
};
