const { analyzeLayout } = require('../analysis/advancedAnalyzer');

// Test the analyzer with a simple layout to debug pinky scissors
const testLayout = {
  // QWERTY layout keys
  'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't',
  'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
  'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', ';': ';',
  'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
  'n': 'n', 'm': 'm', ',': ',', '.': '.', '/': '/'
};

// Test corpus with potential pinky scissors patterns
// Pinky-ring combinations that span 2+ rows:
// Left hand: A-W, W-A, A-S, S-A (if they span rows)
// Right hand: ;-O, O-;, ;-L, L-; (if they span rows)
const testCorpus = "aw wa as sa ol lo sl ls qs sq pl lp az za ax xa";

console.log('🔍 Testing pinky scissors detection...');
console.log('Test corpus:', testCorpus);

const stats = analyzeLayout(testLayout, testCorpus);

console.log('\n📊 Results:');
console.log(`Pinky Scissors: ${stats.pinky_scissors_pct}%`);
console.log(`Total Scissors: ${stats.scissors_pct}%`);
console.log(`Same Finger Bigrams: ${stats.same_finger_bigrams_pct}%`);
console.log(`Total Bigrams analyzed: ${stats.raw_stats.totalBigrams}`);

console.log('\n🔬 Raw debug info:');
console.log('Raw stats breakdown:', {
  totalCharacters: stats.raw_stats.totalCharacters,
  totalBigrams: stats.raw_stats.totalBigrams,
  sameFingerBigramCount: stats.raw_stats.sameFingerBigramCount,
  skipBigramCount: stats.raw_stats.skipBigramCount,
  lateralStretchCount: stats.raw_stats.lateralStretchCount,
  scissorsCount: stats.raw_stats.scissorsCount
});

// Test Caster layout specifically
console.log('\n\n🎯 Testing Caster layout...');

const casterLayout = {
  'q': 'w', 'w': 'f', 'e': 'p', 'r': 'b', 't': ';',
  'y': 'j', 'u': 'l', 'i': 'u', 'o': 'y', 'p': "'",
  'a': 'a', 's': 'r', 'd': 's', 'f': 't', 'g': 'g',
  'h': 'm', 'j': 'n', 'k': 'e', 'l': 'i', ';': 'o',
  'z': 'z', 'x': 'x', 'c': 'c', 'v': 'd', 'b': 'v',
  'n': 'k', 'm': 'h', ',': ',', '.': '.', '/': '/'
};

const casterStats = analyzeLayout(casterLayout);
console.log('Caster Pinky Scissors:', casterStats.pinky_scissors_pct + '%');
console.log('Caster Total Scissors:', casterStats.scissors_pct + '%');
