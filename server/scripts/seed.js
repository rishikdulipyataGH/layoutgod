const { Pool } = require('pg');
const LayoutAnalyzer = require('../utils/layoutAnalyzer');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const analyzer = new LayoutAnalyzer();

// Layout definitions
const layouts = [
  {
    name: 'QWERTY',
    slug: 'qwerty',
    type: 'traditional',
    description: 'The standard QWERTY keyboard layout used by most people worldwide.',
    visual_data: {
      keys: {
        'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't',
        'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
        'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
        'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', ';': ';',
        'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
        'n': 'n', 'm': 'm', ',': ',', '.': '.', '/': '/'
      }
    },
    file_formats: {
      klc: 'qwerty.klc',
      json: 'qwerty.json'
    }
  },
  {
    name: 'Dvorak',
    slug: 'dvorak',
    type: 'alternative',
    description: 'The Dvorak keyboard layout designed for typing efficiency and comfort.',
    visual_data: {
      keys: {
        'q': '\'', 'w': ',', 'e': '.', 'r': 'p', 't': 'y',
        'y': 'f', 'u': 'g', 'i': 'c', 'o': 'r', 'p': 'l',
        'a': 'a', 's': 'o', 'd': 'e', 'f': 'u', 'g': 'i',
        'h': 'd', 'j': 'h', 'k': 't', 'l': 'n', ';': 's',
        'z': ';', 'x': 'q', 'c': 'j', 'v': 'k', 'b': 'x',
        'n': 'b', 'm': 'm', ',': 'w', '.': 'v', '/': 'z'
      }
    },
    file_formats: {
      klc: 'dvorak.klc',
      json: 'dvorak.json'
    }
  },
  {
    name: 'Colemak',
    slug: 'colemak',
    type: 'alternative',
    description: 'Colemak is a modern alternative layout designed to be easy to learn while being much more efficient than QWERTY.',
    visual_data: {
      keys: {
        'q': 'q', 'w': 'w', 'e': 'f', 'r': 'p', 't': 'g',
        'y': 'j', 'u': 'l', 'i': 'u', 'o': 'y', 'p': ';',
        'a': 'a', 's': 'r', 'd': 's', 'f': 't', 'g': 'd',
        'h': 'h', 'j': 'n', 'k': 'e', 'l': 'i', ';': 'o',
        'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
        'n': 'k', 'm': 'm', ',': ',', '.': '.', '/': '/'
      }
    },
    file_formats: {
      klc: 'colemak.klc',
      json: 'colemak.json'
    }
  },
  {
    name: 'Colemak-DH',
    slug: 'colemak-dh',
    type: 'alternative',
    description: 'Colemak-DH is a modified version of Colemak that addresses the center column issue.',
    visual_data: {
      keys: {
        'q': 'q', 'w': 'w', 'e': 'f', 'r': 'p', 't': 'b',
        'y': 'j', 'u': 'l', 'i': 'u', 'o': 'y', 'p': ';',
        'a': 'a', 's': 'r', 'd': 's', 'f': 't', 'g': 'g',
        'h': 'm', 'j': 'n', 'k': 'e', 'l': 'i', ';': 'o',
        'z': 'z', 'x': 'x', 'c': 'c', 'v': 'd', 'b': 'v',
        'n': 'k', 'm': 'h', ',': ',', '.': '.', '/': '/'
      }
    },
    file_formats: {
      klc: 'colemak-dh.klc',
      json: 'colemak-dh.json'
    }
  },
  {
    name: 'Workman',
    slug: 'workman',
    type: 'alternative',
    description: 'Workman layout optimized for the natural motion of fingers and hand comfort.',
    visual_data: {
      keys: {
        'q': 'q', 'w': 'd', 'e': 'r', 'r': 'w', 't': 'b',
        'y': 'j', 'u': 'f', 'i': 'u', 'o': 'p', 'p': ';',
        'a': 'a', 's': 's', 'd': 'h', 'f': 't', 'g': 'g',
        'h': 'y', 'j': 'n', 'k': 'e', 'l': 'o', ';': 'i',
        'z': 'z', 'x': 'x', 'c': 'm', 'v': 'c', 'b': 'v',
        'n': 'k', 'm': 'l', ',': ',', '.': '.', '/': '/'
      }
    },
    file_formats: {
      klc: 'workman.klc',
      json: 'workman.json'
    }
  },
  {
    name: 'Norman',
    slug: 'norman',
    type: 'alternative',
    description: 'Norman layout designed to be an easier transition from QWERTY with better efficiency.',
    visual_data: {
      keys: {
        'q': 'q', 'w': 'w', 'e': 'd', 'r': 'f', 't': 'k',
        'y': 'j', 'u': 'u', 'i': 'r', 'o': 'l', 'p': ';',
        'a': 'a', 's': 's', 'd': 'e', 'f': 't', 'g': 'g',
        'h': 'y', 'j': 'n', 'k': 'i', 'l': 'o', ';': 'h',
        'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
        'n': 'p', 'm': 'm', ',': ',', '.': '.', '/': '/'
      }
    },
    file_formats: {
      klc: 'norman.klc',
      json: 'norman.json'
    }
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    for (const layout of layouts) {
      await client.query('BEGIN');
      
      try {
        // Check if layout already exists
        const existingLayout = await client.query(
          'SELECT id FROM layouts WHERE slug = $1',
          [layout.slug]
        );
        
        if (existingLayout.rows.length > 0) {
          console.log(`⚠️  Layout ${layout.name} already exists, skipping...`);
          await client.query('ROLLBACK');
          continue;
        }
        
        // Insert layout
        const layoutResult = await client.query(`
          INSERT INTO layouts (name, slug, type, description, visual_data, file_formats)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          layout.name,
          layout.slug,
          layout.type,
          layout.description,
          JSON.stringify(layout.visual_data),
          JSON.stringify(layout.file_formats)
        ]);
        
        const layoutId = layoutResult.rows[0].id;
        
        // Analyze layout and store stats
        console.log(`📊 Analyzing ${layout.name}...`);
        const stats = analyzer.analyzeLayout(layout.visual_data);
        
        await client.query(`
          INSERT INTO layout_stats (
            layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
            same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
            lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
            two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
            roll_in_pct, roll_out_pct, col5_6_pct
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          layoutId, stats.effort, stats.distance, stats.pinky_distance,
          stats.pinky_off_home_pct, stats.same_finger_bigrams_pct, stats.skip_bigrams_pct,
          stats.skip_bigrams2_pct, stats.lateral_stretch_pct, stats.pinky_scissors_pct,
          stats.two_row_sfb_pct, stats.two_row_jumps_pct, stats.trigram_alt_pct,
          stats.tri_redirect_pct, stats.roll_in_pct, stats.roll_out_pct, stats.col5_6_pct
        ]);
        
        await client.query('COMMIT');
        console.log(`✅ Successfully seeded ${layout.name}`);
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Error seeding ${layout.name}:`, error);
      }
    }
    
    console.log('✅ Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
