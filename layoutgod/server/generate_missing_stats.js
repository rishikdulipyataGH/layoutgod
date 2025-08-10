#!/usr/bin/env node
/**
 * Generate Missing Layout Statistics
 * 
 * This script finds layouts that are missing statistics in the layout_stats table
 * and generates them using the existing analyzeLayout function.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { analyzeLayout } = require('./analysis/advancedAnalyzer');

const generateMissingStats = async () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./data/keyboard-layouts.db');
    
    console.log('🔍 Finding layouts without statistics...');
    
    // Find layouts that don't have corresponding entries in layout_stats
    const query = `
      SELECT l.id, l.name, l.slug, l.visual_data 
      FROM layouts l 
      LEFT JOIN layout_stats ls ON l.id = ls.layout_id 
      WHERE ls.layout_id IS NULL
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        reject(err);
        return;
      }
      
      console.log(`📊 Found ${rows.length} layouts without statistics`);
      
      if (rows.length === 0) {
        console.log('✅ All layouts already have statistics!');
        db.close();
        resolve();
        return;
      }
      
      let processed = 0;
      let successful = 0;
      
      rows.forEach((layout) => {
        try {
          console.log(`\n🔬 Analyzing layout: ${layout.name}`);
          
          // Parse visual_data to get key mappings
          const visualData = JSON.parse(layout.visual_data || '{}');
          const keyMappings = visualData.keys || {};
          
          if (Object.keys(keyMappings).length === 0) {
            console.log(`⚠️  No key mappings found for ${layout.name}`);
            processed++;
            return;
          }
          
          // Generate statistics using the advanced analyzer
          const stats = analyzeLayout(keyMappings);
          
          // Insert statistics into layout_stats table
          const insertStatsQuery = `
            INSERT INTO layout_stats (
              layout_id, effort, distance, pinky_distance, pinky_off_home_pct,
              same_finger_bigrams_pct, skip_bigrams_pct, skip_bigrams2_pct,
              lateral_stretch_pct, pinky_scissors_pct, two_row_sfb_pct,
              two_row_jumps_pct, trigram_alt_pct, tri_redirect_pct,
              roll_in_pct, roll_out_pct, col5_6_pct, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `;
          
          const statsValues = [
            layout.id,
            parseFloat(stats.effort) || 0,
            parseFloat(stats.distance) || 0,
            parseFloat(stats.pinky_distance || 0),
            parseFloat(stats.pinky_off_home_pct || 0),
            parseFloat(stats.same_finger_bigrams_pct || 0),
            parseFloat(stats.skip_bigrams_pct || 0),
            parseFloat(stats.skip_bigrams2_pct || 0), 
            parseFloat(stats.lateral_stretch_pct || 0),
            parseFloat(stats.pinky_scissors_pct || 0),
            parseFloat(stats.two_row_sfb_pct || 0),
            parseFloat(stats.two_row_jumps_pct || 0),
            parseFloat(stats.trigram_alt_pct || 0),
            parseFloat(stats.tri_redirect_pct || 0),
            parseFloat(stats.roll_in_pct || 0),
            parseFloat(stats.roll_out_pct || 0),
            parseFloat(stats.col5_6_pct || 0)
          ];
          
          db.run(insertStatsQuery, statsValues, function(err) {
            if (err) {
              console.error(`❌ Error inserting stats for ${layout.name}:`, err);
            } else {
              console.log(`✅ Generated statistics for ${layout.name}`);
              console.log(`   - Effort: ${stats.effort}`);
              console.log(`   - Distance: ${stats.distance}`);
              console.log(`   - SFB: ${stats.same_finger_bigrams_pct}%`);
              successful++;
            }
            
            processed++;
            
            // Check if we're done
            if (processed === rows.length) {
              console.log(`\n🎉 Processing complete!`);
              console.log(`📈 Successfully generated statistics for ${successful}/${rows.length} layouts`);
              
              db.close((err) => {
                if (err) {
                  console.error('Error closing database:', err);
                  reject(err);
                } else {
                  console.log('💾 Database closed successfully');
                  resolve();
                }
              });
            }
          });
          
        } catch (error) {
          console.error(`❌ Error processing ${layout.name}:`, error);
          processed++;
          
          if (processed === rows.length) {
            console.log(`\n🎉 Processing complete!`);
            console.log(`📈 Successfully generated statistics for ${successful}/${rows.length} layouts`);
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
                reject(err);
              } else {
                console.log('💾 Database closed successfully');
                resolve();
              }
            });
          }
        }
      });
    });
  });
};

// Main execution
const main = async () => {
  try {
    console.log('🚀 Starting layout statistics generation...\n');
    await generateMissingStats();
    console.log('\n✨ All done! Your layouts should now have complete statistics.');
    console.log('🔄 Restart your server to see the updated statistics in the frontend.');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { generateMissingStats };
