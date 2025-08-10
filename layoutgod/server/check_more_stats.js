const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/keyboard-layouts.db');

console.log('Layout Statistics Comparison:\n');

db.all(`
  SELECT layouts.name, layout_stats.effort, layout_stats.distance, 
         layout_stats.same_finger_bigrams_pct, layout_stats.roll_in_pct,
         layout_stats.trigram_alt_pct
  FROM layouts 
  LEFT JOIN layout_stats ON layouts.id = layout_stats.layout_id 
  ORDER BY layout_stats.effort ASC
  LIMIT 20
`, [], (err, rows) => {
  if (err) {
    console.error('Database error:', err);
    process.exit(1);
  }
  
  console.log('Name\t\t\tEffort\tDistance\tSFB%\tRoll%\tAlt%');
  console.log('----\t\t\t-----\t--------\t----\t----\t----');
  
  rows.forEach(row => {
    const name = (row.name || 'null').padEnd(20);
    const effort = row.effort || 'null';
    const distance = row.distance || 'null';
    const sfb = row.same_finger_bigrams_pct || 'null';
    const roll = row.roll_in_pct || 'null';
    const alt = row.trigram_alt_pct || 'null';
    console.log(`${name}\t${effort}\t${distance}\t\t${sfb}\t${roll}\t${alt}`);
  });
  
  db.close();
});
