# obsidian_style_casemap_database
# Obsidian Style CaseMap Database

A toolkit for using [Obsidian](https://obsidian.md/) as a case management "database," inspired by LexisNexis CaseMap. This repo provides a vault folder structure, Markdown templates for Cases, Facts, People, and Issues, and a helper script for indexing.

---

## Features

- Structured Markdown templates for Cases, Facts, People, and Issues.
- A suggested vault folder structure for casework and investigations.
- A Node.js script to generate and update index/link files.
- Designed for flexible linking and note management in Obsidian.
- **No plugins required** (but compatible with Obsidian community plugins).

---

## Getting Started

1. **Clone or copy this repo.**
2. Copy the contents of the `vault/` folder into your own Obsidian vault (or use as a starter vault).
3. Place files from the `templates/` folder within your vault or Obsidian templates folder.
4. To generate index files for each section, run the automation script (requires Node.js):

   ```bash
   node scripts/generate-index.js
   ```

5. Use the templates to create new notes for each case, fact, person, or issue, and link them together inside Obsidian using `[[double square brackets]]`.

---

## Folder Structure

```
templates/
  ├── Case Template.md
  ├── Fact Template.md
  ├── Person Template.md
  └── Issue Template.md
scripts/
  └── generate-index.js
vault/
  ├── Cases/
  ├── Facts/
  ├── People/
  └── Issues/
README.md
```

---

## Example Workflow

- Create a new note in `Cases/` using **Case Template**.
- Create Fact, Person, and Issue notes as needed.
- Interlink notes using wiki-links (`[[ ]]`).
- Run the script to update master index files.
- Add and customize fields as needed for your legal/project workflow.

---

## Credits & Inspiration

Based on LexisNexis CaseMap, adapted for Obsidian. Not affiliated with LexisNexis.

---
