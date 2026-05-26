const fs = require('fs');
const path = require('path');

const VAULT = path.join(__dirname, '../vault');
const INDEXES = [
  { type: 'Cases', folder: 'Cases', title: 'Master Case List' },
  { type: 'Facts', folder: 'Facts', title: 'Key Fact List' },
  { type: 'People', folder: 'People', title: 'People Directory' },
  { type: 'Issues', folder: 'Issues', title: 'Issue List' }
];

function genIndex(folderPath, title) {
  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.md'));
  let output = `# ${title}\n\n`;
  files.forEach(file => {
    output += `- [[${file.replace('.md', '')}]]\n`;
  });
  return output;
}

INDEXES.forEach(({type, folder, title}) => {
  const dir = path.join(VAULT, folder);
  const indexPath = path.join(dir, `_index.md`);
  if (!fs.existsSync(dir)) return;
  const content = genIndex(dir, title);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`Wrote ${indexPath}`);
});
