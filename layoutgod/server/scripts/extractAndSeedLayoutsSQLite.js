const database = require('../utils/database');
const LayoutExtractor = require('../utils/layoutExtractor');
const LayoutAnalyzer = require('../utils/newLayoutAnalyzer');
const path = require('path');
const fs = require('fs');

async function extractAndSeedLayouts() {
  const extractor = new LayoutExtractor();
  const analyzer = new LayoutAnalyzer();
  
  try {
    console.log('🔍 Extracting layouts from cyanophage files...');
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Connect to database
    await database.connect();
    
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
    await database.run('DELETE FROM layout_stats');
    await database.run('DELETE FROM layouts');
    
    let successCount = 0;
    let errorCount = 0;

    for (const layout of layouts) {
      try {
        await database.transaction(async (db) => {
          // Insert layout
          const layoutResult = await db.run(`
            INSERT INTO layouts (name, slug, type, description, visual_data, file_formats)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            layout.name,
            layout.slug,
            layout.type || 'keyboard_layout',
            layout.description || `${layout.name} keyboard layout`,
            JSON.stringify(layout.visual_data || {}),
            JSON.stringify({})
          ]);
          
          const layoutId = layoutResult.lastID;
          
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
          await db.run(`
            INSERT INTO layout_stats (
              layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
              same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
              lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
              two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
              roll_in_pct, roll_out_pct, col5_6_pct
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          
          return layoutId;
        });
        
        successCount++;
        console.log(`✅ Seeded: ${layout.name} (${layout.slug})`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error seeding ${layout.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Seeding Summary:`);
    console.log(`   ✅ Success: ${successCount} layouts`);
    console.log(`   ❌ Errors: ${errorCount} layouts`);
    console.log(`   📈 Total processed: ${layouts.length} layouts`);
    
    // Show some sample results
    console.log('\n🔍 Sample layouts in database:');
    const sampleResults = await database.query(`
      SELECT l.name, l.slug, ls.effort, ls.same_finger_bigrams_pct, ls.roll_in_pct 
      FROM layouts l 
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id 
      ORDER BY ls.effort ASC 
      LIMIT 5
    `);
    
    sampleResults.rows.forEach(row => {
      console.log(`   ${row.name}: effort=${row.effort?.toFixed(1)}, sfb=${row.same_finger_bigrams_pct?.toFixed(2)}%, roll_in=${row.roll_in_pct?.toFixed(2)}%`);
    });
    
    // Show database file location
    const dbPath = path.join(__dirname, '../data/keyboard-layouts.db');
    console.log(`\n📁 Database created at: ${dbPath}`);
    console.log(`📏 Database size: ${(fs.statSync(dbPath).size / 1024).toFixed(1)} KB`);
    
  } catch (error) {
    console.error('💥 Fatal error during extraction/seeding:', error);
  } finally {
    await database.close();
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
