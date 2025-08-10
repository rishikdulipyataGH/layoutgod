const http = require('http');

const testLayout = (slug) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: `/api/layouts/${slug}`,
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const layout = JSON.parse(data);
        console.log(`\n=== ${layout.name.toUpperCase()} ===`);
        console.log(`Effort: ${layout.effort}`);
        console.log(`Distance: ${layout.distance}`);
        console.log(`Same Finger Bigrams: ${layout.same_finger_bigrams_pct}%`);
        console.log(`Roll In: ${layout.roll_in_pct}%`);
        console.log(`Trigram Alt: ${layout.trigram_alt_pct}%`);
      } catch (err) {
        console.error(`Error parsing response for ${slug}:`, err.message);
        console.log('Raw response:', data.substring(0, 200));
      }
    });
  });

  req.on('error', (err) => {
    console.error(`Error fetching ${slug}:`, err.message);
  });

  req.end();
};

console.log('Testing API with different layouts...');

// Test a few different layouts
setTimeout(() => testLayout('colemak'), 100);
setTimeout(() => testLayout('qwerty'), 200);
setTimeout(() => testLayout('dvorak'), 300);
setTimeout(() => testLayout('graphite'), 400);
setTimeout(() => testLayout('canary'), 500);

setTimeout(() => {
  console.log('\nAPI testing complete!');
  process.exit(0);
}, 1000);
