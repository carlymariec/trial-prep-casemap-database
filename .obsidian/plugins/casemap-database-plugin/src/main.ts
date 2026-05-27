import { App, Notice, Plugin, TFile, normalizePath } from "obsidian";

type Entry = {
  date: string;
  type: string;
  link: string;
  note: string;
};

const FOLDERS = ["Cases", "Facts", "People", "Issues", "Evidence", "Chronology", "Matrix", "FileClasses", "Templates"];

const INDEX_CONFIG = [
  { folder: "Cases", title: "Master Case List" },
  { folder: "Facts", title: "Key Fact List" },
  { folder: "People", title: "People Directory" },
  { folder: "Issues", title: "Issue List" },
  { folder: "Evidence", title: "Evidence List" },
  { folder: "Chronology", title: "Chronology List" }
];

const SEED_FILES: Record<string, string> = {
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
  - IssueTitle
  - Status
  - RelatedCase
  - Category
  - Description
  - KeyFacts
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

export default class CaseMapDatabasePlugin extends Plugin {
  async onload(): Promise<void> {
    this.addCommand({
      id: "initialize-casemap-database",
      name: "Initialize CaseMap database structure",
      callback: async () => {
        await this.initializeStructure();
        new Notice("CaseMap database structure initialized.");
      }
    });

    this.addCommand({
      id: "generate-casemap-indexes",
      name: "Generate CaseMap indexes",
      callback: async () => {
        await this.generateIndexes();
        new Notice("CaseMap indexes updated.");
      }
    });

    this.addCommand({
      id: "generate-master-chronology",
      name: "Generate master chronology",
      callback: async () => {
        await this.generateChronology();
        new Notice("Master chronology updated.");
      }
    });

    this.addCommand({
      id: "generate-evidence-matrix",
      name: "Generate evidence matrix",
      callback: async () => {
        await this.generateEvidenceMatrix();
        new Notice("Evidence matrix updated.");
      }
    });

    this.addCommand({
      id: "generate-fileclass-index",
      name: "Generate FileClass field index",
      callback: async () => {
        await this.generateFileClassIndex();
        new Notice("FileClass field index updated.");
      }
    });
  }

  private async initializeStructure(): Promise<void> {
    for (const folder of FOLDERS) {
      await this.ensureFolder(folder);
    }

    for (const [path, content] of Object.entries(SEED_FILES)) {
      await this.createIfMissing(path, content.trimEnd() + "\n");
    }
  }

  private async generateIndexes(): Promise<void> {
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

  private async generateChronology(): Promise<void> {
    const entries = (
      await Promise.all([
        this.collectChronologyEntries("Facts", "Fact"),
        this.collectChronologyEntries("Evidence", "Evidence"),
        this.collectChronologyEntries("Issues", "Issue"),
        this.collectChronologyEntries("Chronology", "Event")
      ])
    )
      .flat()
      .filter((entry) => entry.date.length > 0);

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

  private async generateEvidenceMatrix(): Promise<void> {
    const evidenceFiles = this.getMarkdownFilesInFolder("Evidence");
    const rows: string[] = [];

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

  private async generateFileClassIndex(): Promise<void> {
    const rows: string[] = ["# FileClass Field Index", "", "| FileClass | Fields |", "|-----------|--------|"];
    const fileClassFiles = this.getMarkdownFilesInFolder("FileClasses")
      .filter((file) => file.name.endsWith(".fileclass.md"))
      .sort((a, b) => a.basename.localeCompare(b.basename));

    for (const file of fileClassFiles) {
      const content = await this.app.vault.cachedRead(file);
      const fileClass = content.match(/fileClass:\s*([^\n\r]+)/)?.[1]?.trim() ?? file.basename;
      const fields = [...content.matchAll(/-\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]).join(", ");
      rows.push(`| ${fileClass} | ${fields} |`);
    }

    rows.push("");
    await this.upsertFile("FileClasses/_fileclass_index.md", rows.join("\n"));
  }

  private async collectChronologyEntries(folder: string, type: string): Promise<Entry[]> {
    const files = this.getMarkdownFilesInFolder(folder);
    const entries: Entry[] = [];
    for (const file of files) {
      const content = await this.app.vault.cachedRead(file);
      const date = content.match(/\*\*Date\/Time:\*\*\s*([^\n\r]+)/)?.[1]?.trim() ?? "";
      const title = content.match(/^#\s*(.+)$/m)?.[1]?.trim() ?? file.basename;
      entries.push({ date, type, link: `[[${file.basename}]]`, note: title });
    }
    return entries;
  }

  private extractLinkedSection(content: string, section: string): string[] {
    const rgx = new RegExp(`## ${section}[\\n\\r]+((?:- \\[\\[.*?\\]\\][\\n\\r]+)*)`);
    const match = content.match(rgx);
    if (!match) return [];
    return [...match[1].matchAll(/\[\[(.*?)\]\]/g)].map((item) => item[1]);
  }

  private toSortableDate(value: string): number {
    const stamp = Date.parse(value);
    return Number.isNaN(stamp) ? Number.MAX_SAFE_INTEGER : stamp;
  }

  private getMarkdownFilesInFolder(folder: string): TFile[] {
    const prefix = `${folder}/`;
    return this.app.vault
      .getMarkdownFiles()
      .filter((file) => file.path.startsWith(prefix) && !file.path.slice(prefix.length).includes("/"));
  }

  private async ensureFolder(folder: string): Promise<void> {
    const normalized = normalizePath(folder);
    if (!this.app.vault.getAbstractFileByPath(normalized)) {
      await this.app.vault.createFolder(normalized);
    }
  }

  private async createIfMissing(path: string, content: string): Promise<void> {
    const normalized = normalizePath(path);
    if (!this.app.vault.getAbstractFileByPath(normalized)) {
      await this.app.vault.create(normalized, content);
    }
  }

  private async upsertFile(path: string, content: string): Promise<void> {
    const normalized = normalizePath(path);
    const existing = this.app.vault.getAbstractFileByPath(normalized);
    if (existing instanceof TFile) {
      await this.app.vault.modify(existing, content);
      return;
    }
    await this.app.vault.create(normalized, content);
  }
}
