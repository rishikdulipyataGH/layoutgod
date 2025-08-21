const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const socketIo = require('socket.io');
const database = require('./utils/database');
require('dotenv').config();

const AdaptiveTestAnalyzer = require('./analysis/adaptiveTestAnalyzer');
const { analyzeLayout } = require('./analysis/advancedAnalyzer');
const TextGenerator = require('./analysis/textGenerator');

const app = express();
const server = createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Initialize SQLite database
database.connect().then(() => {
  console.log('✅ Database connected and initialized');
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
  process.exit(1);
});

// Configure trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes

// Get all layouts with optional filtering
app.get('/api/layouts', async (req, res) => {
  try {
    const { type, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT l.*, ls.* FROM layouts l
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id
      WHERE 1=1
    `;
    const values = [];

    if (type) {
      query += ` AND l.type = ?`;
      values.push(type);
    }

    if (search) {
      query += ` AND (l.name LIKE ? OR l.description LIKE ?)`;
      values.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), parseInt(offset));

    const result = await database.query(query, values);
    
    // Parse JSON fields for each layout
    const parsedLayouts = result.rows.map(layout => ({
      ...layout,
      visual_data: layout.visual_data ? JSON.parse(layout.visual_data) : { keys: {} },
      file_formats: layout.file_formats ? JSON.parse(layout.file_formats) : {}
    }));
    
    res.json(parsedLayouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific layout by slug
app.get('/api/layouts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Backend received slug:', slug);
    
    const result = await database.query(`
      SELECT l.*, ls.* FROM layouts l
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id
      WHERE l.slug = ?
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const layout = result.rows[0];
    // Parse JSON fields
    const parsedLayout = {
      ...layout,
      visual_data: layout.visual_data ? JSON.parse(layout.visual_data) : { keys: {} },
      file_formats: layout.file_formats ? JSON.parse(layout.file_formats) : {}
    };

    res.json(parsedLayout);
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new layout (with transaction support)
app.post('/api/layouts', async (req, res) => {
  try {
    const { name, slug, type, description, visual_data, file_formats } = req.body;
    
    const result = await database.transaction(async (db) => {
      // Insert layout
      const layoutResult = await db.run(`
        INSERT INTO layouts (name, slug, type, description, visual_data, file_formats)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [name, slug, type, description || '', JSON.stringify(visual_data), JSON.stringify(file_formats || {})]);
      
      const layoutId = layoutResult.lastID;
      
      // Analyze layout and store stats
      const stats = analyzeLayout(visual_data?.keys || {});
      
      await db.run(`
        INSERT INTO layout_stats (
          layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
          same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
          lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
          two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
          roll_in_pct, roll_out_pct, col5_6_pct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        layoutId, stats.effort, stats.distance, stats.pinky_distance,
        stats.pinky_off_home_pct, stats.same_finger_bigrams_pct, stats.skip_bigrams_pct,
        stats.skip_bigrams2_pct, stats.lateral_stretch_pct, stats.pinky_scissors_pct,
        stats.two_row_sfb_pct, stats.two_row_jumps_pct, stats.trigram_alt_pct,
        stats.tri_redirect_pct, stats.roll_in_pct, stats.roll_out_pct, stats.col5_6_pct
      ]);
      
      return { layoutId, stats };
    });
    
    res.status(201).json({ 
      id: result.layoutId, 
      message: 'Layout created successfully',
      stats: result.stats
    });
    
  } catch (error) {
    console.error('Error creating layout:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Layout slug already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analyze layout without saving
app.post('/api/analyze', async (req, res) => {
  try {
    const { layout_data } = req.body;
    
    if (!layout_data) {
      return res.status(400).json({ error: 'Layout data is required' });
    }
    
    const stats = analyzeLayout(layout_data?.keys || {});
    
    // Generate live recommendations using the description generator
    const { layoutDescriptionGenerator } = require('./analysis/layoutDescriptionGenerator');
    const recommendations = layoutDescriptionGenerator.generateLiveRecommendations(stats);
    
    // Add recommendations to the response
    const response = {
      ...stats,
      live_recommendations: recommendations
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error analyzing layout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate comprehensive layout description and recommendations
app.post('/api/layouts/describe', async (req, res) => {
  try {
    const { layout_data, layout_name = 'Custom Layout' } = req.body;
    
    if (!layout_data || !layout_data.keys) {
      return res.status(400).json({ error: 'Layout data with keys is required' });
    }
    
    const { layoutDescriptionGenerator } = require('./analysis/layoutDescriptionGenerator');
    const descriptionData = await layoutDescriptionGenerator.generateDescription(
      layout_data.keys, 
      layout_name
    );
    
    res.json({
      success: true,
      layout_name,
      ...descriptionData
    });
    
  } catch (error) {
    console.error('Error generating layout description:', error);
    res.status(500).json({ error: 'Failed to generate layout description' });
  }
});

// Store for active adaptive test sessions with cleanup
const activeAdaptiveTests = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Clean up abandoned sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, analyzer] of activeAdaptiveTests.entries()) {
    if (analyzer.lastActivity && (now - analyzer.lastActivity) > SESSION_TIMEOUT) {
      console.log(`Cleaning up abandoned session: ${sessionId}`);
      activeAdaptiveTests.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

// Adaptive Typing Test Routes

// Start a new adaptive test session
app.post('/api/adaptive-test/start', (req, res) => {
  try {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const analyzer = new AdaptiveTestAnalyzer();
    analyzer.lastActivity = Date.now();
    
    activeAdaptiveTests.set(sessionId, analyzer);
    
    // Generate text for first test
    const testText = analyzer.generateAdaptiveText(1);
    
    console.log(`Started adaptive test session: ${sessionId}`);
    
    res.json({
      sessionId,
      testNumber: 1,
      testText,
      totalTests: 5,
      instructions: 'This is your baseline test. Type the text naturally to establish your typing patterns.'
    });
    
  } catch (error) {
    console.error('Error starting adaptive test:', error);
    res.status(500).json({ error: 'Failed to start adaptive test' });
  }
});

// Submit test result and get next test
app.post('/api/adaptive-test/submit', (req, res) => {
  try {
    const { 
      sessionId, 
      testNumber, 
      userInput, 
      targetText, 
      wpm, 
      accuracy, 
      keyStats, 
      fingerStats, 
      testDuration 
    } = req.body;
    
    // Validate required fields
    if (!sessionId || !testNumber || !userInput || !targetText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!activeAdaptiveTests.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid or expired session ID' });
    }
    
    const analyzer = activeAdaptiveTests.get(sessionId);
    analyzer.lastActivity = Date.now();
    
    // Validate data types and ranges
    const validatedWPM = Math.max(0, Math.min(500, Number(wpm) || 0));
    const validatedAccuracy = Math.max(0, Math.min(100, Number(accuracy) || 0));
    
    console.log(`Processing test ${testNumber} for session ${sessionId}: ${validatedWPM} WPM, ${validatedAccuracy}% accuracy`);
    
    // Analyze the completed test
    const analysisResult = analyzer.analyzeTestResult({
      userInput,
      targetText,
      keyStats: keyStats || {},
      fingerStats: fingerStats || {},
      wpm: validatedWPM,
      accuracy: validatedAccuracy,
      testNumber,
      testDuration: Number(testDuration) || 60
    });
    
    // Check if we have more tests
    if (testNumber >= 5) {
      // Final test completed - get recommendations
      console.log(`Generating recommendations for session ${sessionId}`);
      
      analyzer.recommendLayouts().then(recommendations => {
        const finalResults = analyzer.getFinalResults();
        
        console.log(`Session ${sessionId} completed. Generated ${recommendations.length} recommendations.`);
        
        // Clean up session
        activeAdaptiveTests.delete(sessionId);
        
        res.json({
          completed: true,
          testNumber: testNumber,
          analysisResult,
          finalResults,
          recommendations,
          message: 'Adaptive test sequence completed! Here are your personalized layout recommendations.'
        });
      }).catch(error => {
        console.error('Error generating recommendations:', error);
        // Don't delete session on error - user might retry
        res.status(500).json({ 
          error: 'Failed to generate recommendations',
          details: 'Please try again or contact support if the problem persists.'
        });
      });
    } else {
      // Generate next test
      const nextTestNumber = testNumber + 1;
      const nextTestText = analyzer.generateAdaptiveText(nextTestNumber);
      
      let instructions = '';
      switch(nextTestNumber) {
        case 2:
          instructions = 'This test focuses on your weaker fingers. The text is designed to help identify specific finger weaknesses.';
          break;
        case 3:
          instructions = 'This test targets problematic letter combinations identified from your previous typing.';
          break;
        case 4:
          instructions = 'This test focuses on typing flow and rhythm with challenging word sequences.';
          break;
        case 5:
          instructions = 'Final comprehensive test combining all identified weak areas for maximum challenge.';
          break;
      }
      
      res.json({
        completed: false,
        testNumber: nextTestNumber,
        testText: nextTestText,
        totalTests: 5,
        analysisResult,
        instructions,
        message: `Test ${testNumber} completed! Moving to test ${nextTestNumber}.`
      });
    }
    
  } catch (error) {
    console.error('Error submitting adaptive test:', error);
    res.status(500).json({ 
      error: 'Failed to process test submission',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Get current adaptive test session status
app.get('/api/adaptive-test/status/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!activeAdaptiveTests.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const analyzer = activeAdaptiveTests.get(sessionId);
    const results = analyzer.getFinalResults();
    
    res.json({
      sessionId,
      currentTest: results.testResults.length + 1,
      totalTests: 5,
      completedTests: results.testResults,
      weaknessProfile: results.weaknessProfile
    });
    
  } catch (error) {
    console.error('Error getting adaptive test status:', error);
    res.status(500).json({ error: 'Failed to get test status' });
  }
});

// Cancel adaptive test session
app.delete('/api/adaptive-test/cancel/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (activeAdaptiveTests.has(sessionId)) {
      activeAdaptiveTests.delete(sessionId);
      res.json({ message: 'Adaptive test session cancelled' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
    
  } catch (error) {
    console.error('Error cancelling adaptive test:', error);
    res.status(500).json({ error: 'Failed to cancel test session' });
  }
});

// Get recommendations based on preferences
app.post('/api/recommendations', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Weight configurations for different use cases
    const weights = {
      comfort: {
        effort: 0.25, distance: 0.2, pinky_distance: 0.15, pinky_off_home_pct: 0.1,
        same_finger_bigrams_pct: 0.15, lateral_stretch_pct: 0.15
      },
      speed: {
        roll_in_pct: 0.3, roll_out_pct: 0.2, trigram_alt_pct: 0.25,
        same_finger_bigrams_pct: -0.25
      },
      gaming: {
        effort: 0.2, distance: 0.15, col5_6_pct: -0.2, roll_in_pct: 0.2,
        two_row_jumps_pct: -0.15, pinky_scissors_pct: -0.1
      }
    };
    
    const selectedWeights = weights[preferences] || weights.comfort;
    
    // Get all layouts with stats (simplified for SQLite)
    const result = await database.query(`
      SELECT l.*, ls.* FROM layouts l
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id
      WHERE ls.layout_id IS NOT NULL
      ORDER BY l.name
    `);
    
    // Calculate scores for each layout (simplified)
    const scoredLayouts = result.rows.map(layout => {
      // Parse JSON fields
      const parsedLayout = {
        ...layout,
        visual_data: layout.visual_data ? JSON.parse(layout.visual_data) : { keys: {} },
        file_formats: layout.file_formats ? JSON.parse(layout.file_formats) : {}
      };
      
      let score = 0;
      
      for (const [metric, weight] of Object.entries(selectedWeights)) {
        if (parsedLayout[metric] !== null && parsedLayout[metric] !== undefined) {
          let normalizedValue = parsedLayout[metric];
          
          if (metric.endsWith('_pct')) {
            normalizedValue = parsedLayout[metric] / 100;
          }
          
          score += normalizedValue * weight;
        }
      }
      
      return {
        ...parsedLayout,
        recommendation_score: score
      };
    });
    
    scoredLayouts.sort((a, b) => a.recommendation_score - b.recommendation_score);
    res.json(scoredLayouts.slice(0, 10));
    
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Text Generation Routes

// Generate programming language code snippets
app.post('/api/generate-text/programming', (req, res) => {
  try {
    const { language, complexity = 'medium', lineCount = 5, targetLength = 200 } = req.body;
    
    if (!language) {
      return res.status(400).json({ error: 'Programming language is required' });
    }
    
    const generator = new TextGenerator();
    const text = generator.generateProgrammingText(language, complexity, lineCount);
    
    // Trim to target length if needed
    const finalText = text.length > targetLength ? text.substring(0, targetLength) : text;
    
    res.json({
      text: finalText,
      language,
      complexity,
      type: 'programming',
      metadata: {
        originalLength: text.length,
        trimmed: text.length > targetLength
      }
    });
    
  } catch (error) {
    console.error('Error generating programming text:', error);
    res.status(500).json({ error: error.message || 'Failed to generate programming text' });
  }
});

// Generate quote-based text
app.post('/api/generate-text/quotes', (req, res) => {
  try {
    const { category = 'mixed', difficulty = 'medium', targetLength = 200 } = req.body;
    
    const generator = new TextGenerator();
    const text = generator.generateQuoteText(category, difficulty, targetLength);
    
    res.json({
      text,
      category,
      difficulty,
      type: 'quotes',
      metadata: {
        length: text.length,
        complexity: generator.calculateTextComplexity(text)
      }
    });
    
  } catch (error) {
    console.error('Error generating quote text:', error);
    res.status(500).json({ error: 'Failed to generate quote text' });
  }
});

// Generate adaptive text based on user weaknesses
app.post('/api/generate-text/adaptive', (req, res) => {
  try {
    const { weaknesses = {}, targetLength = 200, focus = 'balance' } = req.body;
    
    const generator = new TextGenerator();
    const text = generator.generateAdaptiveText(weaknesses, targetLength);
    
    res.json({
      text,
      focus,
      type: 'adaptive',
      weaknesses,
      metadata: {
        length: text.length,
        targetedWeaknesses: {
          fingers: weaknesses.weakFingers?.length || 0,
          bigrams: weaknesses.weakBigrams?.length || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error generating adaptive text:', error);
    res.status(500).json({ error: 'Failed to generate adaptive text' });
  }
});

// Generate layout-optimized text
app.post('/api/generate-text/layout-optimized', (req, res) => {
  try {
    const { layoutData, focus = 'balance', targetLength = 200 } = req.body;
    
    if (!layoutData || !layoutData.keys) {
      return res.status(400).json({ error: 'Layout data with keys is required' });
    }
    
    const generator = new TextGenerator();
    const text = generator.generateLayoutOptimizedText(layoutData, focus, targetLength);
    
    res.json({
      text,
      focus,
      type: 'layout-optimized',
      metadata: {
        length: text.length,
        layoutAnalyzed: true
      }
    });
    
  } catch (error) {
    console.error('Error generating layout-optimized text:', error);
    res.status(500).json({ error: 'Failed to generate layout-optimized text' });
  }
});

// Get available text generation options
app.get('/api/generate-text/options', (req, res) => {
  try {
    res.json({
      programmingLanguages: ['javascript', 'python', 'typescript', 'java', 'rust'],
      quoteCategories: ['mixed', 'inspirational', 'literature', 'philosophy', 'technology'],
      difficulties: ['easy', 'medium', 'hard'],
      complexities: ['simple', 'medium', 'complex'],
      focusAreas: ['balance', 'bigrams', 'flow', 'fingers'],
      defaultTargetLength: 200,
      maxTargetLength: 1000
    });
  } catch (error) {
    console.error('Error getting generation options:', error);
    res.status(500).json({ error: 'Failed to get generation options' });
  }
});

// WebSocket connection for real-time layout analysis
io.on('connection', (socket) => {
  console.log('Client connected for real-time analysis');
  
  socket.on('analyze-layout', (layoutData) => {
    try {
      const stats = analyzeLayout(layoutData?.keys || {});
      socket.emit('analysis-result', stats);
    } catch (error) {
      console.error('WebSocket analysis error:', error);
      socket.emit('analysis-error', { error: 'Analysis failed' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Keyboard Layout Analyzer API running on port ${PORT}`);
  console.log(`📊 WebSocket server ready for real-time analysis`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    database.close().then(() => {
      console.log('✅ Server and database connections closed.');
      process.exit(0);
    });
  });
});
