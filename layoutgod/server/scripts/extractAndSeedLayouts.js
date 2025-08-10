const { Pool } = require('pg');
const LayoutExtractor = require('../utils/layoutExtractor');
const LayoutAnalyzer = require('../utils/newLayoutAnalyzer');
const path = require('path');
require('dotenv').config();

async function extractAndSeedLayouts() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const extractor = new LayoutExtractor();
  const analyzer = new LayoutAnalyzer();
  
  try {
    console.log('🔍 Extracting layouts from cyanophage files...');
    
    // Path to cyanophage directory
    const cyanophageDir = path.join(__dirname, '../../cyanophage.github.io-main');
    
    // Extract all layouts
    const layouts = await extractor.extractAllLayouts(cyanophageDir);
    
    if (layouts.length === 0) {
      console.log('❌ No layouts found to extract');
      return;
    }

    console.log(`✅ Extracted ${layouts.length} layouts`);
    
    // Clear existing data
    console.log('🗑️ Clearing existing layout data...');
    await pool.query('DELETE FROM layout_stats');
    await pool.query('DELETE FROM layouts');
    await pool.query('ALTER SEQUENCE layouts_id_seq RESTART WITH 1');
    
    let successCount = 0;
    let errorCount = 0;

    for (const layout of layouts) {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Insert layout
        const layoutResult = await client.query(`
          INSERT INTO layouts (name, slug, type, description, visual_data, file_formats)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          layout.name,
          layout.slug,
          layout.type || 'keyboard_layout',
          layout.description || `${layout.name} keyboard layout`,
          JSON.stringify(layout.visual_data || {}),
          JSON.stringify({})
        ]);
        
        const layoutId = layoutResult.rows[0].id;
        
        // Analyze layout if we have visual data
        let stats = layout.stats || {};
        if (layout.visual_data && layout.visual_data.keys && layout.visual_data.keys.length > 0) {
          try {
            const analyzedStats = analyzer.analyzeLayout(layout.visual_data);
            stats = { ...stats, ...analyzedStats };
          } catch (analysisError) {
            console.warn(`⚠️ Analysis failed for ${layout.name}:`, analysisError.message);
          }
        }
        
        // Insert stats
        await client.query(`
          INSERT INTO layout_stats (
            layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
            same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
            lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
            two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
            roll_in_pct, roll_out_pct, col5_6_pct
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          layoutId,
          stats.effort || 0,
          stats.distance || 0,
          stats.pinky_distance || 0,
          stats.pinky_off_home_pct || 0,
          stats.same_finger_bigrams_pct || 0,
          stats.skip_bigrams_pct || 0,
          stats.skip_bigrams2_pct || 0,
          stats.lateral_stretch_pct || 0,
          stats.pinky_scissors_pct || 0,
          stats.two_row_sfb_pct || 0,
          stats.two_row_jumps_pct || 0,
          stats.trigram_alt_pct || 0,
          stats.tri_redirect_pct || 0,
          stats.roll_in_pct || 0,
          stats.roll_out_pct || 0,
          stats.col5_6_pct || 0
        ]);
        
        await client.query('COMMIT');
        successCount++;
        
        console.log(`✅ Seeded: ${layout.name} (${layout.slug})`);
        
      } catch (error) {
        await client.query('ROLLBACK');
        errorCount++;
        console.error(`❌ Error seeding ${layout.name}:`, error.message);
      } finally {
        client.release();
      }
    }
    
    console.log(`\n📊 Seeding Summary:`);
    console.log(`   ✅ Success: ${successCount} layouts`);
    console.log(`   ❌ Errors: ${errorCount} layouts`);
    console.log(`   📈 Total processed: ${layouts.length} layouts`);
    
    // Show some sample results
    console.log('\n🔍 Sample layouts in database:');
    const sampleResults = await pool.query(`
      SELECT l.name, l.slug, ls.effort, ls.same_finger_bigrams_pct, ls.roll_in_pct 
      FROM layouts l 
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id 
      ORDER BY ls.effort ASC 
      LIMIT 5
    `);
    
    sampleResults.rows.forEach(row => {
      console.log(`   ${row.name}: effort=${row.effort?.toFixed(1)}, sfb=${row.same_finger_bigrams_pct?.toFixed(2)}%, roll_in=${row.roll_in_pct?.toFixed(2)}%`);
    });
    
  } catch (error) {
    console.error('💥 Fatal error during extraction/seeding:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  extractAndSeedLayouts()
    .then(() => {
      console.log('🎉 Layout extraction and seeding completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = extractAndSeedLayouts;
