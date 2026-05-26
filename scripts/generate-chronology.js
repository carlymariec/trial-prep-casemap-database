const fs = require('fs');
const path = require('path');

const VAULT = path.join(__dirname, '../vault');
const TARGET = path.join(VAULT, 'Chronology', 'master_chronology.md');

function extractDate(content) {
  const match = content.match(/\*\*Date\/Time:\*\*\s*([^\n\r]+)/);
  return match ? match[1].trim() : '';
}

function collectEntries(folder, label) {
  const dir = path.join(VAULT, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const p = path.join(dir, file);
      const content = fs.readFileSync(p, 'utf8');
      return {
        date: extractDate(content),
        type: label,
        link: `[[${file.replace('.md','')}]]`,
        note: content.split('\n')[0].replace(/^#\s*/,'')
      };
    });
}

const facts = collectEntries('Facts', 'Fact');
const evidence = collectEntries('Evidence', 'Evidence');
const issues = collectEntries('Issues', 'Issue');
const events = collectEntries('Chronology', 'Event');

const all = [...facts, ...evidence, ...events, ...issues].filter(e => e.date);

all.sort((a, b) => new Date(a.date) - new Date(b.date));

let out = `# Master Chronology Timeline\n\n| Date | Type | Entry | Note |\n|------|------|-------|------|\n`;
all.forEach(entry => {
  out += `| ${entry.date} | ${entry.type} | ${entry.link} | ${entry.note} |\n`;
});

fs.writeFileSync(TARGET, out);
console.log('Updated Master Chronology Timeline.');
