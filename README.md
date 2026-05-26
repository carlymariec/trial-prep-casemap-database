# CaseMap Database (Obsidian Community Plugin)

This repository is an Obsidian community plugin that creates and manages a CaseMap-style legal knowledge base directly inside your vault.

## Features

- **Initialize CaseMap database structure**: Creates folders (`Cases`, `Facts`, `People`, `Issues`, `Evidence`, `Chronology`, `Matrix`, `FileClasses`, `Templates`) and seeds starter templates and FileClass definition files.
- **Generate CaseMap indexes**: Updates `_index.md` files in primary folders.
- **Generate master chronology**: Builds `Chronology/master_chronology.md` from date-tagged notes.
- **Generate evidence matrix**: Builds `Matrix/evidence_matrix.md` from Evidence note relationships.
- **Generate FileClass field index**: Builds `FileClasses/_fileclass_index.md`.

## Getting Started

1. **Build the plugin** (if installing from source):
   ```bash
   npm install
   npm run build
   ```
2. **Copy the following files** into your vault’s plugins folder:
   - `manifest.json`
   - `main.js`
   - `versions.json`
3. Place them at:
   - `<your-vault>/.obsidian/plugins/obsidian-style-casemap-database/`
4. In Obsidian:
   - Open **Settings → Community plugins**
   - Turn off **Restricted mode**
   - Enable **CaseMap Database**

## Usage

1. Open the Command Palette (`Ctrl+P` or `Cmd+P`)
2. Run `Initialize CaseMap database structure`
3. Explore the created folders, templates, and indexes
4. Use additional plugin commands as needed

## Example Output

_Example index and matrix files are auto-generated:_

- **Master Case List:**  
  `Cases/_index.md`
- **Master Chronology:**  
  `Chronology/master_chronology.md`
- **Evidence Matrix:**  
  `Matrix/evidence_matrix.md`
- **FileClass Field Index:**  
  `FileClasses/_fileclass_index.md`

<!-- Optionally, you can add a screenshot: -->
<!-- ![Screenshot of CaseMap Index in Obsidian](example-screenshot.png) -->

## Repository Contents

- `src/main.ts` – Plugin source code
- `main.js` – Compiled plugin
- `manifest.json` – Obsidian plugin metadata
- `versions.json` – Plugin version compatibility
- `templates/` and `vault/` – Legacy/Reference content

## License

MIT © [carlymariec](https://github.com/carlymariec)
