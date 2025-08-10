const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migrations...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Users table created');
    
    // Create layouts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS layouts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        file_formats JSONB DEFAULT '{}',
        visual_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Layouts table created');
    
    // Create layout_stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS layout_stats (
        id SERIAL PRIMARY KEY,
        layout_id INTEGER REFERENCES layouts(id) ON DELETE CASCADE,
        effort DECIMAL(10,4),
        distance DECIMAL(10,4),
        pinky_distance DECIMAL(10,4),
        pinky_off_home_pct DECIMAL(5,2),
        same_finger_bigrams_pct DECIMAL(5,2),
        skip_bigrams_pct DECIMAL(5,2),
        skip_bigrams2_pct DECIMAL(5,2),
        lateral_stretch_pct DECIMAL(5,2),
        pinky_scissors_pct DECIMAL(5,2),
        two_row_sfb_pct DECIMAL(5,2),
        two_row_jumps_pct DECIMAL(5,2),
        trigram_alt_pct DECIMAL(5,2),
        tri_redirect_pct DECIMAL(5,2),
        roll_in_pct DECIMAL(5,2),
        roll_out_pct DECIMAL(5,2),
        col5_6_pct DECIMAL(5,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Layout stats table created');
    
    // Create typing_tests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS typing_tests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        layout_id INTEGER REFERENCES layouts(id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        words_per_minute DECIMAL(6,2),
        accuracy DECIMAL(5,2),
        finger_loads JSONB DEFAULT '{}',
        weak_fingers JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Typing tests table created');
    
    // Create suggestions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        layout_id INTEGER REFERENCES layouts(id) ON DELETE CASCADE,
        suggestion_type VARCHAR(50) NOT NULL,
        change_details JSONB NOT NULL,
        score_change DECIMAL(8,4),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Suggestions table created');
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_layouts_slug ON layouts(slug);
      CREATE INDEX IF NOT EXISTS idx_layouts_type ON layouts(type);
      CREATE INDEX IF NOT EXISTS idx_layout_stats_layout_id ON layout_stats(layout_id);
      CREATE INDEX IF NOT EXISTS idx_typing_tests_user_id ON typing_tests(user_id);
      CREATE INDEX IF NOT EXISTS idx_typing_tests_layout_id ON typing_tests(layout_id);
      CREATE INDEX IF NOT EXISTS idx_suggestions_layout_id ON suggestions(layout_id);
    `);
    console.log('✓ Database indexes created');
    
    console.log('All migrations completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
