"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CaseMapDatabasePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var FOLDERS = ["Cases", "Facts", "People", "Issues", "Evidence", "Chronology", "Matrix", "FileClasses", "Templates"];
var INDEX_CONFIG = [
  { folder: "Cases", title: "Master Case List" },
  { folder: "Facts", title: "Key Fact List" },
  { folder: "People", title: "People Directory" },
  { folder: "Issues", title: "Issue List" },
  { folder: "Evidence", title: "Evidence List" },
  { folder: "Chronology", title: "Chronology List" }
];
var SEED_FILES = {
  "Templates/Case Template.md": `---
fileClass: Case
CaseName:
DateOpened:
Court:
CaseNumber:
Jurisdiction:
Status:
Description:
KeyFacts:
People:
Issues:
RelatedDocuments:
Tags:
---

# Case: {{CaseName}}
`,
  "Templates/Fact Template.md": `---
fileClass: Fact
FactSummary:
DateTime:
SourceDocsOrPersons:
Significance:
DetailedDescription:
RelatedCase:
InvolvedPeople:
RelatedIssue:
Tags:
---

# Fact: {{FactSummary}}
`,
  "Templates/Person Template.md": `---
fileClass: Person
FullName:
Role:
Contact:
Affiliation:
Notes:
RelatedCases:
AssociatedFacts:
Tags:
---

# Person: {{FullName}}
`,
  "Templates/Evidence Template.md": `---
fileClass: Evidence
EvidenceTitle:
Type:
FileName:
DateTime:
Source:
Uploader:
Annotations:
RelatedFacts:
RelatedPeople:
RelatedCases:
RelatedIssues:
Tags:
---

# Evidence: {{EvidenceTitle}}
`,
  "Templates/Issue Template.md": `---
fileClass: Issue
IssueTitle:
Status:
RelatedCase:
Category:
Description:
KeyFacts:
Tags:
---

# Issue: {{IssueTitle}}
`,
  "Templates/Chronology Item Template.md": `---
fileClass: Chronology
Title:
DateTime:
Type:
LinkedFact:
LinkedEvidence:
LinkedIssue:
Notes:
Tags:
---

# Chronology Item: {{Title}}
`,
  "FileClasses/Case.fileclass.md": `---
fileClass: Case
fields:
  - CaseName
  - DateOpened
  - Court
  - CaseNumber
  - Jurisdiction
  - Status
  - Description
  - KeyFacts
  - People
  - Issues
  - RelatedDocuments
  - Tags
---
# FileClass: Case
`,
  "FileClasses/Fact.fileclass.md": `---
fileClass: Fact
fields:
  - FactSummary
  - DateTime
  - SourceDocsOrPersons
  - Significance
  - DetailedDescription
  - RelatedCase
  - InvolvedPeople
  - RelatedIssue
  - Tags
---
# FileClass: Fact
`,
  "FileClasses/Person.fileclass.md": `---
fileClass: Person
fields:
  - FullName
  - Role
  - Contact
  - Affiliation
  - Notes
  - RelatedCases
  - AssociatedFacts
  - Tags
---
# FileClass: Person
`,
  "FileClasses/Evidence.fileclass.md": `---
fileClass: Evidence
fields:
  - EvidenceTitle
  - Type
  - FileName
  - DateTime
  - Source
  - Uploader
  - Annotations
  - RelatedFacts
  - RelatedPeople
  - RelatedCases
  - RelatedIssues
  - Tags
---
# FileClass: Evidence
`,
  "FileClasses/Issue.fileclass.md": `---
fileClass: Issue
fields:
  - IssueID
  - IssueTitle
  - Status
  - Priority
  - CaseID
  - RelatedCase
  - DateReported
  - ReportedBy
  - AssignedTo
  - ClosedBy
  - DateClosed
  - Category
  - Jurisdiction
  - Court
  - Description
  - KeyFacts
  - FactsInDispute
  - ReliefSought
  - LegalBasis
  - Claims
  - Defenses
  - RelatedIssues
  - LinkedChronology
  - LinkedEvidence
  - References
  - Attachments
  - Confidentiality
  - Authority
  - Version
  - Notes
  - Tags
---
# FileClass: Issue
`,
  "FileClasses/Chronology.fileclass.md": `---
fileClass: Chronology
fields:
  - Title
  - DateTime
  - Type
  - LinkedFact
  - LinkedEvidence
  - LinkedIssue
  - Notes
  - Tags
---
# FileClass: Chronology
`
};
var CaseMapDatabasePlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.addCommand({
      id: "initialize-casemap-database",
      name: "Initialize CaseMap database structure",
      callback: async () => {
        await this.initializeStructure();
        new import_obsidian.Notice("CaseMap database structure initialized.");
      }
    });
    this.addCommand({
      id: "generate-casemap-indexes",
      name: "Generate CaseMap indexes",
      callback: async () => {
        await this.generateIndexes();
        new import_obsidian.Notice("CaseMap indexes updated.");
      }
    });
    this.addCommand({
      id: "generate-master-chronology",
      name: "Generate master chronology",
      callback: async () => {
        await this.generateChronology();
        new import_obsidian.Notice("Master chronology updated.");
      }
    });
    this.addCommand({
      id: "generate-evidence-matrix",
      name: "Generate evidence matrix",
      callback: async () => {
        await this.generateEvidenceMatrix();
        new import_obsidian.Notice("Evidence matrix updated.");
      }
    });
    this.addCommand({
      id: "generate-fileclass-index",
      name: "Generate FileClass field index",
      callback: async () => {
        await this.generateFileClassIndex();
        new import_obsidian.Notice("FileClass field index updated.");
      }
    });
  }
  async initializeStructure() {
    for (const folder of FOLDERS) {
      await this.ensureFolder(folder);
    }
    for (const [path, content] of Object.entries(SEED_FILES)) {
      await this.createIfMissing(path, content.trimEnd() + "\n");
    }
  }
  async generateIndexes() {
    for (const config of INDEX_CONFIG) {
      const files = this.getMarkdownFilesInFolder(config.folder).filter((file) => !file.basename.startsWith("_"));
      const lines = [`# ${config.title}`, ""];
      for (const file of files.sort((a, b) => a.basename.localeCompare(b.basename))) {
        lines.push(`- [[${file.basename}]]`);
      }
      lines.push("");
      await this.upsertFile(`${config.folder}/_index.md`, lines.join("\n"));
    }
  }
  async generateChronology() {
    const entries = (await Promise.all([
      this.collectChronologyEntries("Facts", "Fact"),
      this.collectChronologyEntries("Evidence", "Evidence"),
      this.collectChronologyEntries("Issues", "Issue"),
      this.collectChronologyEntries("Chronology", "Event")
    ])).flat().filter((entry) => entry.date.length > 0);
    entries.sort((a, b) => this.toSortableDate(a.date) - this.toSortableDate(b.date));
    const rows = entries.map((entry) => `| ${entry.date} | ${entry.type} | ${entry.link} | ${entry.note} |`);
    const content = [
      "# Master Chronology Timeline",
      "",
      "| Date | Type | Entry | Note |",
      "|------|------|-------|------|",
      ...rows,
      ""
    ].join("\n");
    await this.upsertFile("Chronology/master_chronology.md", content);
  }
  async generateEvidenceMatrix() {
    const evidenceFiles = this.getMarkdownFilesInFolder("Evidence");
    const rows = [];
    for (const file of evidenceFiles.sort((a, b) => a.basename.localeCompare(b.basename))) {
      const content = await this.app.vault.cachedRead(file);
      const evidence = `[[${file.basename}]]`;
      const facts = this.extractLinkedSection(content, "Related Facts").join(", ");
      const issues = this.extractLinkedSection(content, "Related Issues").join(", ");
      const people = this.extractLinkedSection(content, "Related People").join(", ");
      const cases = this.extractLinkedSection(content, "Related Cases").join(", ");
      rows.push(`| ${evidence} | ${facts} | ${issues} | ${people} | ${cases} | |`);
    }
    const matrix = [
      "# Evidence Matrix",
      "",
      "| Evidence | Fact(s) Related | Issue(s) Related | Person(s) Related | Case(s) Related | Notes |",
      "|----------|------------------|------------------|-------------------|-----------------|-------|",
      ...rows,
      ""
    ].join("\n");
    await this.upsertFile("Matrix/evidence_matrix.md", matrix);
  }
  async generateFileClassIndex() {
    const rows = ["# FileClass Field Index", "", "| FileClass | Fields |", "|-----------|--------|"];
    const fileClassFiles = this.getMarkdownFilesInFolder("FileClasses").filter((file) => file.name.endsWith(".fileclass.md")).sort((a, b) => a.basename.localeCompare(b.basename));
    for (const file of fileClassFiles) {
      const content = await this.app.vault.cachedRead(file);
      const fileClass = content.match(/fileClass:\s*([^\n\r]+)/)?.[1]?.trim() ?? file.basename;
      const fields = [...content.matchAll(/-\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]).join(", ");
      rows.push(`| ${fileClass} | ${fields} |`);
    }
    rows.push("");
    await this.upsertFile("FileClasses/_fileclass_index.md", rows.join("\n"));
  }
  async collectChronologyEntries(folder, type) {
    const files = this.getMarkdownFilesInFolder(folder);
    const entries = [];
    for (const file of files) {
      const content = await this.app.vault.cachedRead(file);
      const date = content.match(/\*\*Date\/Time:\*\*\s*([^\n\r]+)/)?.[1]?.trim() ?? "";
      const title = content.match(/^#\s*(.+)$/m)?.[1]?.trim() ?? file.basename;
      entries.push({ date, type, link: `[[${file.basename}]]`, note: title });
    }
    return entries;
  }
  extractLinkedSection(content, section) {
    const rgx = new RegExp(`## ${section}[\\n\\r]+((?:- \\[\\[.*?\\]\\][\\n\\r]+)*)`);
    const match = content.match(rgx);
    if (!match) return [];
    return [...match[1].matchAll(/\[\[(.*?)\]\]/g)].map((item) => item[1]);
  }
  toSortableDate(value) {
    const stamp = Date.parse(value);
    return Number.isNaN(stamp) ? Number.MAX_SAFE_INTEGER : stamp;
  }
  getMarkdownFilesInFolder(folder) {
    const prefix = `${folder}/`;
    return this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(prefix) && !file.path.slice(prefix.length).includes("/"));
  }
  async ensureFolder(folder) {
    const normalized = (0, import_obsidian.normalizePath)(folder);
    if (!this.app.vault.getAbstractFileByPath(normalized)) {
      await this.app.vault.createFolder(normalized);
    }
  }
  async createIfMissing(path, content) {
    const normalized = (0, import_obsidian.normalizePath)(path);
    if (!this.app.vault.getAbstractFileByPath(normalized)) {
      await this.app.vault.create(normalized, content);
    }
  }
  async upsertFile(path, content) {
    const normalized = (0, import_obsidian.normalizePath)(path);
    const existing = this.app.vault.getAbstractFileByPath(normalized);
    if (existing instanceof import_obsidian.TFile) {
      await this.app.vault.modify(existing, content);
      return;
    }
    await this.app.vault.create(normalized, content);
  }
};
