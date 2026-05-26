# CaseMap Database (Obsidian Community Plugin)

This repository is now an Obsidian community plugin that creates and manages a CaseMap-style legal knowledge base directly inside your vault.

## Plugin Commands

- **Initialize CaseMap database structure**
  - Creates folders: `Cases`, `Facts`, `People`, `Issues`, `Evidence`, `Chronology`, `Matrix`, `FileClasses`, `Templates`
  - Seeds starter templates and fileClass definition files
- **Generate CaseMap indexes**
  - Updates `_index.md` files in primary folders
- **Generate master chronology**
  - Builds `Chronology/master_chronology.md` from date-tagged notes
- **Generate evidence matrix**
  - Builds `Matrix/evidence_matrix.md` from Evidence note relationships
- **Generate FileClass field index**
  - Builds `FileClasses/_fileclass_index.md`

## Development

```bash
npm install
npm run build
```

Build output is written to `main.js`.

## Install for Local Testing

1. Build the plugin:
   ```bash
   npm install
   npm run build
   ```
2. Copy these files into your vault plugin folder:
   - `manifest.json`
   - `main.js`
   - `versions.json`
3. Place them at:
   - `<your-vault>/.obsidian/plugins/obsidian-style-casemap-database/`
4. In Obsidian:
   - Open **Settings → Community plugins**
   - Turn off **Restricted mode**
   - Enable **CaseMap Database**

## Repository Contents

- `src/main.ts` – plugin source code
- `manifest.json` – Obsidian plugin metadata
- `versions.json` – plugin version compatibility
- `templates/` and `vault/` – legacy project content retained for reference
