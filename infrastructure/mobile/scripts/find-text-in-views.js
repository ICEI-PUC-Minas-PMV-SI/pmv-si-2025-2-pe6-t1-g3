const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');

function walk(dir, cb) {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full, cb);
    } else if (full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.tsx') || full.endsWith('.ts')) {
      cb(full);
    }
  });
}

const viewOpenRegex = /<View[^>]*>/g;

const results = [];

walk(root, (file) => {
  const src = fs.readFileSync(file, 'utf8');
  // Heuristic 2: extract <View ...>...</View> blocks and check for leftover text not inside <Text>
  const viewBlockRegex = /<View[^>]*>[\s\S]*?<\/View>/g;
  const blocks = src.match(viewBlockRegex) || [];
  for (const block of blocks) {
    // Remove nested <Text>...</Text> blocks
    let inner = block.replace(/<View[^>]*>/, '').replace(/<\/View>/, '');
    // Remove all <Text>...</Text> occurrences (single-level)
    inner = inner.replace(/<Text[\s\S]*?<\/Text>/g, '');
    // Remove any other tags
    const stripped = inner.replace(/<[^>]+>/g, '').trim();
    if (stripped) {
      // find approximate line number
      const idx = src.indexOf(block);
      const line = src.slice(0, idx).split(/\r?\n/).length;
      results.push({ file, line, snippet: stripped.slice(0, 120).replace(/\s+/g, ' ') });
    }
  }
});

if (results.length === 0) {
  console.log('No suspicious raw text nodes found inside <View> tags (heuristic).');
  process.exit(0);
}

for (const r of results) {
  console.log(`${r.file}:${r.line} -> ${r.snippet}`);
}

console.log(`Found ${results.length} suspicious occurrences (heuristic).`);
