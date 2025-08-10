const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../data/keyboard-layouts.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error connecting to SQLite database:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.initTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initTables() {
    return new Promise((resolve, reject) => {
      const createTables = `
        -- Layouts table
        CREATE TABLE IF NOT EXISTS layouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          type TEXT DEFAULT 'keyboard_layout',
          description TEXT,
          visual_data TEXT, -- JSON
          file_formats TEXT, -- JSON
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Layout statistics table
        CREATE TABLE IF NOT EXISTS layout_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          layout_id INTEGER NOT NULL,
          effort REAL DEFAULT 0,
          distance REAL DEFAULT 0,
          pinky_distance REAL DEFAULT 0,
          pinky_off_home_pct REAL DEFAULT 0,
          same_finger_bigrams_pct REAL DEFAULT 0,
          skip_bigrams_pct REAL DEFAULT 0,
          skip_bigrams2_pct REAL DEFAULT 0,
          lateral_stretch_pct REAL DEFAULT 0,
          pinky_scissors_pct REAL DEFAULT 0,
          two_row_sfb_pct REAL DEFAULT 0,
          two_row_jumps_pct REAL DEFAULT 0,
          trigram_alt_pct REAL DEFAULT 0,
          tri_redirect_pct REAL DEFAULT 0,
          roll_in_pct REAL DEFAULT 0,
          roll_out_pct REAL DEFAULT 0,
          col5_6_pct REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (layout_id) REFERENCES layouts (id) ON DELETE CASCADE
        );

        -- Typing tests table
        CREATE TABLE IF NOT EXISTS typing_tests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          layout_id INTEGER,
          user_id TEXT,
          words_per_minute REAL NOT NULL,
          accuracy REAL NOT NULL,
          finger_loads TEXT, -- JSON
          weak_fingers TEXT, -- JSON
          errors_by_key TEXT, -- JSON
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (layout_id) REFERENCES layouts (id) ON DELETE SET NULL
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_layouts_slug ON layouts(slug);
        CREATE INDEX IF NOT EXISTS idx_layout_stats_layout_id ON layout_stats(layout_id);
        CREATE INDEX IF NOT EXISTS idx_typing_tests_layout_id ON typing_tests(layout_id);
        CREATE INDEX IF NOT EXISTS idx_typing_tests_timestamp ON typing_tests(timestamp);
      `;

      this.db.exec(createTables, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('✅ Database tables initialized');
          resolve();
        }
      });
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows });
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            lastID: this.lastID, 
            changes: this.changes,
            rows: [{ id: this.lastID }] 
          });
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close(() => {
          console.log('✅ Database connection closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Transaction support
  async transaction(callback) {
    return new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        this.db.run('BEGIN TRANSACTION');
        
        try {
          const result = await callback(this);
          this.db.run('COMMIT');
          resolve(result);
        } catch (error) {
          this.db.run('ROLLBACK');
          reject(error);
        }
      });
    });
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
