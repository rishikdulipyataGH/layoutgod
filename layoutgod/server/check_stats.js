const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/keyboard-layouts.db');

console.log('Checking current layout statistics...\n');

db.all(`
  SELECT layouts.name, layout_stats.effort, layout_stats.distance, layout_stats.same_finger_bigrams_pct 
  FROM layouts 
  LEFT JOIN layout_stats ON layouts.id = layout_stats.layout_id 
  ORDER BY layouts.name 
  LIMIT 10
`, [], (err, rows) => {
  if (err) {
    console.error('Database error:', err);
    process.exit(1);
  }
  
  console.log('Name\t\t\tEffort\tDistance\tSFB%');
  console.log('----\t\t\t-----\t--------\t----');
  
  rows.forEach(row => {
    const name = (row.name || 'null').padEnd(20);
    const effort = row.effort || 'null';
    const distance = row.distance || 'null';
    const sfb = row.same_finger_bigrams_pct || 'null';
    console.log(`${name}\t${effort}\t${distance}\t\t${sfb}`);
  });
  
  db.close();
});
