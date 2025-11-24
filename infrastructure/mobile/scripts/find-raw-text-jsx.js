/*
Usage:
  1. Install dev deps in `infrastructure/mobile`:
     npm i -D @babel/parser @babel/traverse
  2. Run the script:
     node ./scripts/find-raw-text-jsx.js

This script parses JSX files and reports JSXText nodes that are direct children
of a JSXElement whose name is `View` (heuristic to find raw text under <View>).
*/

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const root = path.join(__dirname, '..', 'src');

function walkFiles(dir, cb) {
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walkFiles(full, cb);
    } else if (/\.(js|jsx|ts|tsx)$/.test(full)) {
      cb(full);
    }
  });
}

const results = [];

walkFiles(root, (file) => {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (err) {
    // skip files that fail to parse
    return;
  }

  traverse(ast, {
    JSXElement(pathNode) {
      const opening = pathNode.node.openingElement;
      if (!opening || !opening.name) return;
      const name = opening.name.name || (opening.name.object && opening.name.object.name);
      if (name !== 'View') return;

      // Inspect children
      for (const child of pathNode.node.children) {
        if (child.type === 'JSXText') {
          const text = child.value.trim();
          if (text) {
            // find line number
            const loc = child.loc && child.loc.start ? child.loc.start.line : null;
            results.push({ file, line: loc, text: text.slice(0, 120) });
          }
        }
      }
    },
  });
});

if (results.length === 0) {
  console.log('No raw JSX text nodes directly under <View> were found.');
  process.exit(0);
}

for (const r of results) {
  console.log(`${r.file}:${r.line} -> ${r.text}`);
}
console.log(`Found ${results.length} raw text nodes under <View> (exact).`);
