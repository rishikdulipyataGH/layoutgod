const database = require('../utils/database');
const { analyzeLayout } = require('../analysis/advancedAnalyzer');

async function regenerateAllStats() {
  try {
    console.log('🔄 Starting statistics regeneration...');
    
    // Connect to database
    await database.connect();
    
    // Get all layouts
    const result = await database.query(`
      SELECT l.id, l.name, l.visual_data 
      FROM layouts l
      ORDER BY l.id
    `);
    
    console.log(`📊 Found ${result.rows.length} layouts to regenerate`);
    
    let updated = 0;
    
    for (const layout of result.rows) {
      try {
        console.log(`\n🔍 Analyzing layout: ${layout.name} (ID: ${layout.id})`);
        
        // Parse visual data
        const visualData = layout.visual_data ? JSON.parse(layout.visual_data) : { keys: {} };
        
        // Analyze layout with fixed analyzer
        const stats = analyzeLayout(visualData?.keys || {});
        
        console.log(`📈 Stats for ${layout.name}:`);
        console.log(`  - Effort: ${stats.effort}`);
        console.log(`  - Distance: ${stats.distance}`);
        console.log(`  - Pinky Distance: ${stats.pinky_distance}`);
        console.log(`  - Same Finger Bigrams: ${stats.same_finger_bigrams_pct}%`);
        console.log(`  - Skip Bigrams: ${stats.skip_bigrams_pct}%`);
        console.log(`  - Skip Bigrams 2u: ${stats.skip_bigrams2_pct}%`);
        console.log(`  - Two Row SFB: ${stats.two_row_sfb_pct}%`);
        
        // Update or insert stats
        const existingStats = await database.query(`
          SELECT id FROM layout_stats WHERE layout_id = ?
        `, [layout.id]);
        
        if (existingStats.rows.length > 0) {
          // Update existing stats
          await database.run(`
            UPDATE layout_stats SET
              effort = ?, distance = ?, pinky_distance = ?, pinky_off_home_pct = ?,
              same_finger_bigrams_pct = ?, skip_bigrams_pct = ?, skip_bigrams2_pct = ?,
              lateral_stretch_pct = ?, pinky_scissors_pct = ?, two_row_sfb_pct = ?,
              two_row_jumps_pct = ?, trigram_alt_pct = ?, tri_redirect_pct = ?,
              roll_in_pct = ?, roll_out_pct = ?, col5_6_pct = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE layout_id = ?
          `, [
            stats.effort, stats.distance, stats.pinky_distance,
            stats.pinky_off_home_pct, stats.same_finger_bigrams_pct, stats.skip_bigrams_pct,
            stats.skip_bigrams2_pct, stats.lateral_stretch_pct, stats.pinky_scissors_pct,
            stats.two_row_sfb_pct, stats.two_row_jumps_pct, stats.trigram_alt_pct,
            stats.tri_redirect_pct, stats.roll_in_pct, stats.roll_out_pct, stats.col5_6_pct,
            layout.id
          ]);
        } else {
          // Insert new stats
          await database.run(`
            INSERT INTO layout_stats (
              layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
              same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
              lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
              two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
              roll_in_pct, roll_out_pct, col5_6_pct
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            layout.id, stats.effort, stats.distance, stats.pinky_distance,
            stats.pinky_off_home_pct, stats.same_finger_bigrams_pct, stats.skip_bigrams_pct,
            stats.skip_bigrams2_pct, stats.lateral_stretch_pct, stats.pinky_scissors_pct,
            stats.two_row_sfb_pct, stats.two_row_jumps_pct, stats.trigram_alt_pct,
            stats.tri_redirect_pct, stats.roll_in_pct, stats.roll_out_pct, stats.col5_6_pct
          ]);
        }
        
        updated++;
        console.log(`✅ Updated stats for ${layout.name}`);
        
      } catch (error) {
        console.error(`❌ Error processing layout ${layout.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Regeneration complete! Updated ${updated} layouts.`);
    
  } catch (error) {
    console.error('❌ Error during regeneration:', error);
  } finally {
    await database.close();
  }
}

// Run the regeneration
if (require.main === module) {
  regenerateAllStats();
}

module.exports = { regenerateAllStats };
