const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const socketIo = require('socket.io');
const database = require('./utils/database');
require('dotenv').config();

const LayoutAnalyzer = require('./utils/layoutAnalyzer');

const app = express();
const server = createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Initialize layout analyzer
const analyzer = new LayoutAnalyzer();

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
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific layout by slug
app.get('/api/layouts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await database.query(`
      SELECT l.*, ls.* FROM layouts l
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id
      WHERE l.slug = ?
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    res.json(result.rows[0]);
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
      const stats = analyzer.analyzeLayout(visual_data);
      
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
app.post('/api/analyze', (req, res) => {
  try {
    const { layout_data } = req.body;
    
    if (!layout_data) {
      return res.status(400).json({ error: 'Layout data is required' });
    }
    
    const stats = analyzer.analyzeLayout(layout_data);
    res.json(stats);
    
  } catch (error) {
    console.error('Error analyzing layout:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      let score = 0;
      
      for (const [metric, weight] of Object.entries(selectedWeights)) {
        if (layout[metric] !== null && layout[metric] !== undefined) {
          let normalizedValue = layout[metric];
          
          if (metric.endsWith('_pct')) {
            normalizedValue = layout[metric] / 100;
          }
          
          score += normalizedValue * weight;
        }
      }
      
      return {
        ...layout,
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

// WebSocket connection for real-time layout analysis
io.on('connection', (socket) => {
  console.log('Client connected for real-time analysis');
  
  socket.on('analyze-layout', (layoutData) => {
    try {
      const stats = analyzer.analyzeLayout(layoutData);
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
