/**
 * Populate Layout Descriptions Script
 * 
 * This script analyzes all existing layouts in the database and generates
 * sophisticated descriptions and recommendations using the advanced analyzer engine.
 * 
 * Usage: node scripts/populateLayoutDescriptions.js
 */

const database = require('../utils/database');
const { layoutDescriptionGenerator } = require('../analysis/layoutDescriptionGenerator');

async function populateLayoutDescriptions() {
  try {
    console.log('🚀 Starting layout description population...\n');
    
    // Connect to database
    await database.connect();
    
    // Get all layouts without recommendations or to refresh existing descriptions
    const result = await database.query(`
      SELECT id, name, visual_data 
      FROM layouts 
      WHERE recommendations IS NULL OR recommendations = ''
      ORDER BY created_at DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('✅ All layouts already have descriptions!');
      return;
    }
    
    console.log(`📊 Found ${result.rows.length} layouts needing descriptions\n`);
    
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    
    for (const layout of result.rows) {
      try {
        processed++;
        console.log(`[${processed}/${result.rows.length}] Processing "${layout.name}"...`);
        
        // Parse visual data
        const visualData = layout.visual_data ? JSON.parse(layout.visual_data) : null;
        
        if (!visualData || !visualData.keys) {
          console.log(`  ⚠️  Skipping "${layout.name}" - no visual data`);
          failed++;
          continue;
        }
        
        // Generate description using the sophisticated analyzer
        const descriptionData = await layoutDescriptionGenerator.generateDescription(
          visualData.keys, 
          layout.name
        );
        
        // Update database with the generated description and recommendations
        await database.run(`
          UPDATE layouts 
          SET description = ?, recommendations = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `, [descriptionData.description, JSON.stringify(descriptionData.recommendations), layout.id]);
        
        succeeded++;
        
        // Log success with preview
        console.log(`  ✅ Generated description for "${layout.name}"`);
        console.log(`     Category: ${descriptionData.category}`);
        console.log(`     Strengths: ${descriptionData.strengths.length} identified`);
        console.log(`     Recommendations: ${descriptionData.recommendations.length} generated`);
        
        // Show a preview of the description
        const preview = descriptionData.description.substring(0, 100) + '...';
        console.log(`     Preview: ${preview}\n`);
        
      } catch (error) {
        failed++;
        console.error(`  ❌ Failed to process "${layout.name}": ${error.message}\n`);
      }
    }
    
    // Summary
    console.log('🎉 Layout description population completed!');
    console.log(`   Processed: ${processed} layouts`);
    console.log(`   Succeeded: ${succeeded} layouts`);
    console.log(`   Failed: ${failed} layouts`);
    
    if (succeeded > 0) {
      console.log('\n📝 Sample of generated descriptions:');
      
      // Show a few examples
      const sampleResult = await database.query(`
        SELECT name, description 
        FROM layouts 
        WHERE description IS NOT NULL AND description != '' 
        ORDER BY updated_at DESC 
        LIMIT 3
      `);
      
      sampleResult.rows.forEach((layout, index) => {
        console.log(`\n${index + 1}. ${layout.name}:`);
        console.log(layout.description.split('\n\n')[0]); // First paragraph only
      });
    }
    
  } catch (error) {
    console.error('❌ Fatal error during description population:', error);
  } finally {
    await database.close();
  }
}

// Helper function to generate test layout descriptions
async function generateTestDescriptions() {
  console.log('🧪 Generating test layout descriptions...\n');
  
  // Test with QWERTY
  const qwertyLayout = {
    '`': '`', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
    'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't', 'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p', '[': '[', ']': ']',
    'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', ';': ';', "'": "'",
    'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'n', 'm': 'm', ',': ',', '.': '.', '/': '/'
  };
  
  const qwertyDesc = await layoutDescriptionGenerator.generateDescription(qwertyLayout, 'QWERTY');
  
  console.log('📊 QWERTY Analysis:');
  console.log('Category:', qwertyDesc.category);
  console.log('Description:');
  console.log(qwertyDesc.description);
  console.log('\nRecommendations:');
  qwertyDesc.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`${i + 1}. ${rec.category}: ${rec.description}`);
  });
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test with Colemak-like layout
  const colemakLayout = {
    '`': '`', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
    'q': 'q', 'w': 'w', 'e': 'f', 'r': 'p', 't': 'g', 'y': 'j', 'u': 'l', 'i': 'u', 'o': 'y', 'p': ';', '[': '[', ']': ']',
    'a': 'a', 's': 'r', 'd': 's', 'f': 't', 'g': 'd', 'h': 'h', 'j': 'n', 'k': 'e', 'l': 'i', ';': 'o', "'": "'",
    'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'k', 'm': 'm', ',': ',', '.': '.', '/': '/'
  };
  
  const colemakDesc = await layoutDescriptionGenerator.generateDescription(colemakLayout, 'Colemak');
  
  console.log('📊 Colemak Analysis:');
  console.log('Category:', colemakDesc.category);
  console.log('Description:');
  console.log(colemakDesc.description);
  console.log('\nTop Recommendations:');
  colemakDesc.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`${i + 1}. ${rec.category}: ${rec.description}`);
  });
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    generateTestDescriptions().catch(console.error);
  } else {
    populateLayoutDescriptions().catch(console.error);
  }
}

module.exports = { populateLayoutDescriptions, generateTestDescriptions };
