const fs = require('fs');
const path = require('path');
const VAULT = path.join(__dirname, '../vault');
const EVIDENCE = path.join(VAULT, 'Evidence');
const TARGET = path.join(VAULT, 'Matrix', 'evidence_matrix.md');

function extractSection(content, section) {
  const rgx = new RegExp(`## ${section}[\\n\\r]+((?:- \\[\\[.*?\\]\\][\\n\\r]+)*)`);
  const m = content.match(rgx);
  if (!m) return [];
  return [...m[1].matchAll(/\[\[(.*?)\]\]/g)].map(x=>x[1]);
}

if (!fs.existsSync(EVIDENCE)) process.exit(0);
const rows = fs.readdirSync(EVIDENCE)
  .filter(f=>f.endsWith('.md'))
  .map(file => {
    const c = fs.readFileSync(path.join(EVIDENCE, file),'utf8');
    const evidence = `[[${file.replace('.md','')}]]`;
    const facts = extractSection(c, 'Related Facts').join(', ');
    const issues = extractSection(c, 'Related Issues').join(', ');
    const people = extractSection(c, 'Related People').join(', ');
    const cases = extractSection(c, 'Related Cases').join(', ');
    return `| ${evidence} | ${facts} | ${issues} | ${people} | ${cases} | |`;
  });

const out = 
`# Evidence Matrix

| Evidence        | Fact(s) Related         | Issue(s) Related | Person(s) Related | Case(s) Related | Notes |
|-----------------|------------------------|------------------|-------------------|-----------------|-------|
${rows.join('\n')}
`;

fs.writeFileSync(TARGET, out);
console.log('Updated Evidence Matrix.');
