/**
 * Intelligent Text Generator for Typing Tests
 * 
 * This module generates typing test content using the layout analysis engine to create:
 * 1. Natural language quotes with varying difficulty levels
 * 2. Programming language code snippets with proper syntax
 * 3. Content optimized for specific layout analysis (bigrams, fingers, flow)
 * 4. Adaptive difficulty based on user performance
 */

const { analyzeLayout } = require('./advancedAnalyzer');

// Programming language templates and patterns
const PROGRAMMING_TEMPLATES = {
  javascript: {
    patterns: [
      'function {name}({params}) { return {expression}; }',
      'const {name} = ({params}) => { {body} };',
      'class {className} { constructor({params}) { {body} } }',
      'import { {imports} } from "{module}";',
      'export const {name} = {value};',
      'if ({condition}) { {body} } else { {elseBody} }',
      'for (let {var} = 0; {var} < {limit}; {var}++) { {body} }',
      'const {name} = await fetch("{url}").then(res => res.json());',
      'try { {body} } catch (error) { {errorBody} }',
      'const {object} = { {properties} };'
    ],
    vocabulary: {
      names: ['user', 'data', 'item', 'result', 'value', 'response', 'config', 'options', 'element', 'component'],
      params: ['id', 'name', 'options', 'callback', 'data', 'index', 'item', 'props', 'state', 'event'],
      expressions: ['item.value', 'data.length', 'result || null', 'options.enabled', 'Math.random()', 'Date.now()'],
      classNames: ['User', 'Component', 'Service', 'Handler', 'Manager', 'Controller', 'Model', 'View'],
      imports: ['useState', 'useEffect', 'Component', 'render', 'connect', 'dispatch', 'axios', 'lodash'],
      modules: ['react', 'lodash', 'axios', 'moment', './utils', './config', '../components', './services'],
      conditions: ['user.active', 'data.length > 0', 'result !== null', 'options.debug', 'item.visible'],
      properties: ['id: 1', 'name: "test"', 'active: true', 'data: []', 'count: 0', 'visible: false']
    }
  },
  python: {
    patterns: [
      'def {name}({params}): return {expression}',
      'class {className}: def __init__(self, {params}): {body}',
      'import {module}',
      'from {module} import {imports}',
      'if {condition}: {body}',
      'for {var} in {iterable}: {body}',
      'try: {body} except {exception}: {errorBody}',
      'with open("{file}") as f: {body}',
      '{name} = [{items}]',
      '{name} = {{{properties}}}'
    ],
    vocabulary: {
      names: ['user', 'data', 'item', 'result', 'value', 'response', 'config', 'options', 'element', 'handler'],
      params: ['self', 'data', 'item', 'index', 'name', 'value', 'options', 'callback', 'args', 'kwargs'],
      expressions: ['len(data)', 'item.value', 'result or None', 'str(value)', 'int(item)', 'bool(result)'],
      classNames: ['User', 'Handler', 'Manager', 'Service', 'Controller', 'Model', 'Parser', 'Validator'],
      modules: ['os', 'sys', 'json', 'datetime', 'requests', 'pandas', 'numpy', 'matplotlib'],
      imports: ['json', 'datetime', 'requests', 'pandas as pd', 'numpy as np', 'os', 'sys'],
      conditions: ['user.is_active', 'len(data) > 0', 'result is not None', 'item in list', 'value > 0'],
      items: ['1', '2', '3', '"item"', 'True', 'None', 'result', 'value'],
      properties: ['"name": "test"', '"id": 1', '"active": True', '"data": []', '"count": 0'],
      files: ['data.json', 'config.py', 'results.txt', 'input.csv', 'output.log'],
      exceptions: ['Exception', 'ValueError', 'TypeError', 'KeyError', 'IndexError', 'FileNotFoundError']
    }
  },
  typescript: {
    patterns: [
      'interface {name} { {properties} }',
      'type {name} = {type};',
      'function {name}({params}): {returnType} { return {expression}; }',
      'const {name}: {type} = {value};',
      'class {className} implements {interface} { {body} }',
      'export type {name} = {type};',
      'import type { {imports} } from "{module}";',
      'async function {name}({params}): Promise<{type}> { {body} }',
      'enum {name} { {enumValues} }',
      'namespace {name} { {body} }'
    ],
    vocabulary: {
      names: ['User', 'Data', 'Response', 'Config', 'Options', 'Result', 'Item', 'Element', 'Component', 'Service'],
      properties: ['id: number', 'name: string', 'active: boolean', 'data: any[]', 'callback: () => void'],
      types: ['string', 'number', 'boolean', 'any[]', 'Record<string, any>', 'Promise<void>', 'User | null'],
      params: ['id: number', 'name: string', 'options?: Options', 'callback: Function', 'data: any[]'],
      returnTypes: ['void', 'string', 'number', 'boolean', 'Promise<any>', 'User | null', 'Result'],
      expressions: ['data.length', 'user?.name', 'options || {}', 'await service.get()', 'result as User'],
      classNames: ['UserService', 'DataHandler', 'ConfigManager', 'ComponentProps', 'ApiResponse'],
      interfaces: ['IUser', 'IService', 'IHandler', 'IComponent', 'IConfig', 'IResponse'],
      imports: ['User', 'Service', 'Handler', 'Component', 'Config', 'Response', 'Options'],
      modules: ['./types', './services', '../utils', './config', '@types/node', 'react'],
      enumValues: ['ACTIVE = "active"', 'INACTIVE = "inactive"', 'PENDING = "pending"']
    }
  },
  java: {
    patterns: [
      'public class {className} { {body} }',
      'public {returnType} {name}({params}) { return {expression}; }',
      'private {type} {name} = {value};',
      'public static void main(String[] args) { {body} }',
      'import {package}.{className};',
      'if ({condition}) { {body} } else { {elseBody} }',
      'for ({type} {var} : {collection}) { {body} }',
      'try { {body} } catch ({exception} e) { {errorBody} }',
      'List<{type}> {name} = new ArrayList<>();',
      'Map<String, {type}> {name} = new HashMap<>();'
    ],
    vocabulary: {
      classNames: ['User', 'Service', 'Handler', 'Manager', 'Controller', 'Model', 'Utility', 'Helper'],
      returnTypes: ['String', 'int', 'boolean', 'void', 'List<String>', 'User', 'Object'],
      names: ['user', 'data', 'item', 'result', 'value', 'response', 'config', 'service', 'handler'],
      params: ['String name', 'int id', 'boolean active', 'User user', 'List<String> data'],
      types: ['String', 'int', 'boolean', 'User', 'List<String>', 'Object', 'Map<String, Object>'],
      values: ['"default"', '0', 'true', 'null', 'new ArrayList<>()', 'new HashMap<>()'],
      expressions: ['user.getName()', 'data.size()', 'result != null', 'value.toString()', 'item.getId()'],
      packages: ['java.util', 'java.io', 'java.lang', 'com.example', 'org.springframework'],
      conditions: ['user != null', 'data.isEmpty()', 'result.isPresent()', 'value > 0', 'name.equals("test")'],
      collections: ['users', 'items', 'data', 'results', 'values', 'elements'],
      exceptions: ['Exception', 'IOException', 'SQLException', 'RuntimeException', 'IllegalArgumentException']
    }
  },
  rust: {
    patterns: [
      'fn {name}({params}) -> {returnType} { {body} }',
      'struct {name} { {fields} }',
      'impl {name} { {body} }',
      'enum {name} { {variants} }',
      'use {module}::{items};',
      'let {name}: {type} = {value};',
      'match {expr} { {patterns} }',
      'if let {pattern} = {expr} { {body} }',
      'for {item} in {iter} { {body} }',
      'pub fn {name}({params}) -> Result<{type}, {error}> { {body} }'
    ],
    vocabulary: {
      names: ['user', 'data', 'item', 'result', 'value', 'response', 'config', 'handler', 'service'],
      params: ['data: &str', 'item: &User', 'id: u32', 'name: String', 'options: &Options'],
      returnTypes: ['String', 'u32', 'bool', '&str', 'Vec<String>', 'Option<User>', 'Result<(), Error>'],
      fields: ['id: u32', 'name: String', 'active: bool', 'data: Vec<String>', 'count: usize'],
      variants: ['Active', 'Inactive', 'Pending', 'Success(String)', 'Error(String)', 'None'],
      modules: ['std::collections', 'std::io', 'serde', 'tokio', 'actix_web', 'clap'],
      items: ['HashMap', 'Vec', 'String', 'Result', 'Option', 'Error'],
      types: ['String', 'u32', 'bool', 'Vec<String>', 'Option<User>', '&str', 'Result<(), Error>'],
      values: ['String::new()', '0', 'true', 'Vec::new()', 'None', 'Ok(())', '"default".to_string()'],
      patterns: ['Ok(value) => value', 'Err(e) => return Err(e)', 'Some(item) => item', 'None => default'],
      errors: ['Error', 'std::io::Error', 'Box<dyn std::error::Error>', 'anyhow::Error']
    }
  }
};

// Quote categories with varying complexity
const QUOTE_CATEGORIES = {
  inspirational: [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.", 
    "Your time is limited, don't waste it living someone else's life.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
  ],
  literature: [
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "In three words I can sum up everything I've learned about life: it goes on.",
    "Be who you are and say what you feel, because those who mind don't matter and those who matter don't mind.",
    "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present."
  ],
  philosophy: [
    "The unexamined life is not worth living.",
    "I think, therefore I am.",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "The only true wisdom is in knowing you know nothing."
  ],
  technology: [
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "First, solve the problem. Then, write the code.",
    "Experience is the name everyone gives to their mistakes.",
    "Programs must be written for people to read, and only incidentally for machines to execute."
  ]
};

// Difficulty-based text patterns
const DIFFICULTY_PATTERNS = {
  easy: {
    avgWordLength: 4,
    commonBigrams: ['th', 'he', 'in', 'er', 'an', 're'],
    avoidPatterns: ['q', 'x', 'z', 'uncommon']
  },
  medium: {
    avgWordLength: 6,
    mixedPatterns: true,
    includeNumbers: false
  },
  hard: {
    avgWordLength: 8,
    complexBigrams: ['qu', 'xt', 'gh', 'ph'],
    includeNumbers: true,
    includePunctuation: true
  }
};

class TextGenerator {
  constructor() {
    this.cache = new Map();
    this.difficulty = 'medium';
  }

  /**
   * Generate programming language code snippet
   */
  generateProgrammingText(language, complexity = 'medium', lineCount = 3) {
    const templates = PROGRAMMING_TEMPLATES[language];
    if (!templates) {
      throw new Error(`Unsupported programming language: ${language}`);
    }

    const lines = [];
    const usedNames = new Set();

    for (let i = 0; i < lineCount; i++) {
      const pattern = this.getRandomItem(templates.patterns);
      const generatedLine = this.fillTemplate(pattern, templates.vocabulary, usedNames);
      lines.push(generatedLine);
    }

    return lines.join(' ');
  }

  /**
   * Generate quote-based text
   */
  generateQuoteText(category = 'mixed', difficulty = 'medium', targetLength = 200) {
    let sourceQuotes = [];
    
    if (category === 'mixed') {
      // Mix quotes from all categories
      Object.values(QUOTE_CATEGORIES).forEach(quotes => {
        sourceQuotes.push(...quotes);
      });
    } else if (QUOTE_CATEGORIES[category]) {
      sourceQuotes = QUOTE_CATEGORIES[category];
    } else {
      sourceQuotes = QUOTE_CATEGORIES.inspirational;
    }

    // Select quotes based on difficulty and target length
    const selectedQuotes = this.selectQuotesByDifficulty(sourceQuotes, difficulty, targetLength);
    return selectedQuotes.join(' ');
  }

  /**
   * Generate adaptive text based on user weaknesses
   */
  generateAdaptiveText(weaknesses = {}, targetLength = 200) {
    const { weakFingers = [], weakBigrams = [], errorPatterns = {} } = weaknesses;
    
    let text = '';
    let attempts = 0;
    const maxAttempts = 10;

    while (text.length < targetLength && attempts < maxAttempts) {
      // Generate text targeting specific weaknesses
      if (weakFingers.length > 0) {
        text += this.generateFingerTargetedText(weakFingers) + ' ';
      }
      
      if (weakBigrams.length > 0) {
        text += this.generateBigramTargetedText(weakBigrams) + ' ';
      }
      
      // Fill remaining with balanced content
      if (text.length < targetLength * 0.8) {
        text += this.generateQuoteText('mixed', 'medium', targetLength - text.length) + ' ';
      }
      
      attempts++;
    }

    return text.trim().substring(0, targetLength);
  }

  /**
   * Generate text targeting specific fingers
   */
  generateFingerTargetedText(weakFingers) {
    const fingerWords = {
      'LP': ['apple', 'plaza', 'quartz', 'square', 'aqua'],
      'LR': ['sweet', 'sword', 'swirl', 'swing', 'swept'],
      'LM': ['dance', 'decide', 'defend', 'demand', 'device'],
      'LI': ['right', 'fight', 'light', 'bright', 'sight'],
      'RI': ['unity', 'young', 'yours', 'youth', 'unique'],
      'RM': ['image', 'music', 'magic', 'major', 'micro'],
      'RR': ['order', 'other', 'offer', 'owner', 'outer'],
      'RP': ['people', 'purple', 'proper', 'paper', 'power']
    };

    let targetWords = [];
    weakFingers.forEach(finger => {
      if (fingerWords[finger]) {
        targetWords.push(...fingerWords[finger].slice(0, 3));
      }
    });

    return targetWords.join(' ');
  }

  /**
   * Generate text targeting specific bigrams
   */
  generateBigramTargetedText(weakBigrams) {
    const bigramWords = {
      'th': ['think', 'through', 'throw', 'thick'],
      'he': ['help', 'heart', 'heavy', 'health'],
      'er': ['never', 'error', 'water', 'center'],
      'in': ['inside', 'income', 'indeed', 'invite'],
      'ou': ['house', 'sound', 'group', 'double'],
      'ng': ['strong', 'finger', 'single', 'angle']
    };

    let targetWords = [];
    weakBigrams.forEach(bigram => {
      if (bigramWords[bigram]) {
        targetWords.push(...bigramWords[bigram].slice(0, 2));
      }
    });

    return targetWords.join(' ');
  }

  /**
   * Fill template with vocabulary items
   */
  fillTemplate(template, vocabulary, usedNames) {
    let result = template;
    
    const placeholders = template.match(/{(\w+)}/g) || [];
    placeholders.forEach(placeholder => {
      const key = placeholder.slice(1, -1); // Remove { }
      if (vocabulary[key]) {
        let value;
        if (key === 'name' || key === 'className') {
          // Ensure unique names to avoid conflicts
          do {
            value = this.getRandomItem(vocabulary[key]);
          } while (usedNames.has(value));
          usedNames.add(value);
        } else {
          value = this.getRandomItem(vocabulary[key]);
        }
        result = result.replace(placeholder, value);
      }
    });

    return result;
  }

  /**
   * Select quotes based on difficulty level
   */
  selectQuotesByDifficulty(quotes, difficulty, targetLength) {
    const difficultySettings = DIFFICULTY_PATTERNS[difficulty] || DIFFICULTY_PATTERNS.medium;
    
    const selectedQuotes = [];
    let currentLength = 0;
    
    // Sort quotes by complexity if needed
    const sortedQuotes = quotes.sort((a, b) => {
      const aComplexity = this.calculateTextComplexity(a);
      const bComplexity = this.calculateTextComplexity(b);
      
      if (difficulty === 'easy') return aComplexity - bComplexity;
      if (difficulty === 'hard') return bComplexity - aComplexity;
      return 0; // Random order for medium
    });

    for (const quote of sortedQuotes) {
      if (currentLength + quote.length <= targetLength) {
        selectedQuotes.push(quote);
        currentLength += quote.length + 1; // +1 for space
      }
      
      if (currentLength >= targetLength * 0.9) break;
    }

    return selectedQuotes;
  }

  /**
   * Calculate text complexity score
   */
  calculateTextComplexity(text) {
    let score = 0;
    
    // Word length complexity
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    score += avgWordLength;
    
    // Uncommon character penalty
    const uncommonChars = (text.match(/[qxz]/gi) || []).length;
    score += uncommonChars * 2;
    
    // Punctuation complexity
    const punctuation = (text.match(/[.!?;:,'"()]/g) || []).length;
    score += punctuation * 0.5;
    
    return score;
  }

  /**
   * Get random item from array
   */
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate text optimized for specific layout analysis
   */
  generateLayoutOptimizedText(layoutData, focus = 'balance', targetLength = 200) {
    // This would use the layout analyzer to generate text that specifically tests
    // the layout's strengths and weaknesses
    
    try {
      const stats = analyzeLayout(layoutData.keys || {});
      
      // Generate text based on layout characteristics
      if (focus === 'bigrams' && stats.same_finger_bigrams_pct > 2) {
        // Focus on testing same-finger bigrams
        return this.generateBigramFocusedText(stats.problematic_bigrams || [], targetLength);
      }
      
      if (focus === 'flow' && stats.roll_in_pct < 20) {
        // Focus on testing flow and rolls
        return this.generateFlowFocusedText(targetLength);
      }
      
      // Default to balanced content
      return this.generateQuoteText('mixed', 'medium', targetLength);
      
    } catch (error) {
      console.error('Error in layout optimization:', error);
      return this.generateQuoteText('mixed', 'medium', targetLength);
    }
  }

  /**
   * Generate text focusing on bigram patterns
   */
  generateBigramFocusedText(problematicBigrams, targetLength) {
    const bigramWords = {
      'th': ['think', 'through', 'thought', 'throw', 'thick', 'thumb', 'theater', 'thanks'],
      'he': ['help', 'heart', 'heavy', 'health', 'heaven', 'heater', 'height', 'hello'],
      'er': ['never', 'error', 'water', 'center', 'better', 'letter', 'other', 'under'],
      'in': ['inside', 'income', 'indeed', 'invite', 'inner', 'index', 'inform', 'inject'],
      'ng': ['strong', 'finger', 'single', 'angle', 'jungle', 'longer', 'hunger', 'danger']
    };

    let words = [];
    problematicBigrams.slice(0, 5).forEach(bigram => {
      if (bigramWords[bigram]) {
        words.push(...bigramWords[bigram]);
      }
    });

    // Fill with additional challenging bigram words
    const allBigramWords = Object.values(bigramWords).flat();
    while (words.join(' ').length < targetLength) {
      words.push(this.getRandomItem(allBigramWords));
    }

    return words.join(' ').substring(0, targetLength);
  }

  /**
   * Generate text focusing on typing flow
   */
  generateFlowFocusedText(targetLength) {
    const flowWords = [
      'keyboard', 'layout', 'finger', 'typing', 'rhythm', 'flowing', 'smooth',
      'balance', 'comfort', 'natural', 'effortless', 'graceful', 'seamless',
      'harmonious', 'coordinated', 'synchronized', 'optimized', 'efficient',
      'performance', 'excellence', 'mastery', 'precision', 'accuracy'
    ];

    const flowSentences = [
      'smooth typing requires proper finger positioning and rhythm',
      'balanced layouts promote natural hand movement patterns',
      'efficient keyboard designs minimize finger travel distance',
      'comfortable typing positions reduce strain and fatigue'
    ];

    let text = flowSentences.join(' ') + ' ';
    
    while (text.length < targetLength) {
      text += this.getRandomItem(flowWords) + ' ';
    }

    return text.trim().substring(0, targetLength);
  }
}

module.exports = TextGenerator;
