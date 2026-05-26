const fs = require("fs");
const path = require("path");

const FILECLASS_DIR = path.join(__dirname, "../vault/FileClasses");
const OUT = path.join(FILECLASS_DIR, "_fileclass_index.md");

let out = "# FileClass Field Index\n\n| FileClass | Fields |\n|-----------|--------|\n";

fs.readdirSync(FILECLASS_DIR).forEach(f => {
  if (!f.endsWith(".fileclass.md")) return;
  const content = fs.readFileSync(path.join(FILECLASS_DIR, f), "utf8");
  const fc = content.match(/fileClass:\s*(\w+)/)?.[1] || f.replace('.fileclass.md','');
  const fields = [...content.matchAll(/-\s*([A-Za-z0-9_]+)/g)].map(r=>r[1]).join(', ');
  out += `| ${fc} | ${fields} |\n`;
});

fs.writeFileSync(OUT, out);
console.log("Generated _fileclass_index.md");
