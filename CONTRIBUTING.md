# Contributing to the EPAM Salesforce Practice Meeting Brief Agent

Welcome! This guide explains how to contribute changes to the plugin so that everyone on the team can benefit from improvements.

---

## Branch Naming — Required

All branches **must** be prefixed with your EPAM userid:

```
[userid]/short-description
```

**Examples:**
```
spadhy/add-apollo-research-source
jsmith/improve-intake-form
mpatel/fix-docx-footer
```

Branches that do not follow this pattern will be blocked by the repository ruleset and cannot be pushed to the remote.

> **How to find your userid:** It's the part of your EPAM email before the `@`. For `jsmith@epam.com`, the userid is `jsmith`.

---

## Contribution Workflow

### 1. Clone the repo (first time only)

```bash
git clone https://github.com/spadhy/meeting-brief-agent.git
cd meeting-brief-agent
```

### 2. Create your branch

```bash
git checkout -b [userid]/your-feature-name
# e.g.:
git checkout -b spadhy/add-apollo-research-source
```

### 3. Make your changes

Common contribution types:

| What you're changing | Where to edit |
|---|---|
| Brief sections or content | `skills/meeting-brief/references/brief-sections.md` |
| Research sources | `skills/meeting-brief/references/research-sources.md` |
| Agent workflow | `skills/meeting-brief/SKILL.md` |
| Intake form (HTML) | `artifacts/meeting-brief-intake.html` |
| Word doc generator | `scripts/generate-brief.js` |
| Plugin manifest | `.claude-plugin/plugin.json` |

### 4. Test your change

Before opening a PR, test with a real contact:

```bash
cd scripts
npm install
node generate-brief.js "/tmp/test-brief.docx"
```

Verify the Word document opens and renders correctly.

### 5. Commit your changes

```bash
git add <files-you-changed>
git commit -m "Brief description of what changed and why"
```

### 6. Push your branch

```bash
git push -u origin [userid]/your-feature-name
```

### 7. Open a Pull Request

```bash
gh pr create \
  --title "Your change title" \
  --body "Describe what you changed and why" \
  --base main
```

The pull request template will guide you through the checklist. Tag `siba_padhy@epam.com` as reviewer.

---

## PR Requirements

- All PRs must target `main`
- Direct pushes to `main` are blocked — changes must go through a PR
- At least one approval is required before merging
- Include a test brief output or describe how you tested the change

---

## Packaging a New Release

After your PR is merged and a new version is ready:

```bash
cd /path/to/meeting-brief-agent
zip -r ../epam-sf-meeting-brief.plugin . \
  -x "*.DS_Store" \
  -x "node_modules/*" \
  -x ".git/*"
gh release create vX.Y.Z \
  ../epam-sf-meeting-brief.plugin \
  --title "vX.Y.Z" \
  --notes "What changed in this release"
```

Upload the `.plugin` file as the release asset. Team members install it from the Releases page.

---

## Questions?

Open a GitHub Issue or reach out to Siba Padhy (`siba_padhy@epam.com`).
