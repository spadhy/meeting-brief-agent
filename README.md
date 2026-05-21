# EPAM Salesforce Practice — Meeting Brief Agent

> AI-powered meeting brief generation for the EPAM Salesforce Practice sales and revenue team.

---

## What It Does

Prepares you for any sales, partner, or customer meeting in minutes:

1. **Fill in the intake form** — contact name, company, LinkedIn URL, your goal
2. **Agent researches** the contact from LinkedIn, ZoomInfo (public), Crunchbase, company news, Salesforce AppExchange, and your Outlook history
3. **Cross-references** the shared OneDrive brief library — if someone on the team has already met this company, that context surfaces automatically
4. **Delivers a 12-section brief** in chat plus a formatted Word document saved with a standard filename

---

## Quick Start

### Install the Plugin

1. Download `epam-sf-meeting-brief.plugin` from the [Releases page](../../releases)
2. Open Cowork → Settings → Plugins → Install Plugin
3. Select the `.plugin` file
4. Connect **Microsoft 365** in Cowork Settings → Connectors (needed for OneDrive + Outlook access)

### Run Your First Brief

Open the **Meeting Brief** artifact in the Cowork sidebar, fill in the 4-field form, and hit **Generate My Meeting Brief**.

---

## Brief Library (OneDrive)

All generated briefs are saved to a shared OneDrive folder:

> **Salesforce Practice Meeting Brief**
> `https://epam-my.sharepoint.com/:f:/p/siba_padhy/...`

**Naming convention:**
```
YYYY-MM-DD_[CompanyName]_[ContactLastName]_[ContactFirstName]_Brief.docx
```

**Example:**
```
2026-05-21_HyattHotels_Hansen_Dan_Brief.docx
```

After generating a brief, sync the `.docx` file from your workspace to this shared folder. Once there, it will be automatically discovered by the agent for future meetings with the same account.

---

## Architecture

```
User fills form (Cowork artifact)
        ↓
Agent searches OneDrive for prior briefs on this company
        ↓
Research: LinkedIn · ZoomInfo · Crunchbase · News · AppExchange · Outlook
        ↓
Generate 12-section brief in chat
        ↓
Save .docx → workspace → user syncs to shared OneDrive
```

### Components

| Component | Purpose |
|---|---|
| `skills/meeting-brief/` | Core skill — workflow instructions for the agent |
| `artifacts/meeting-brief-intake.html` | Cowork sidebar intake form |
| `scripts/generate-brief.js` | Word document generator (Node.js + docx) |
| `.mcp.json` | Microsoft 365 connector configuration |

---

## Brief Structure (12 Sections)

1. At-a-Glance
2. Prior Research on This Account *(if prior briefs exist)*
3. Company Snapshot
4. Contact Profile
5. Salesforce Ecosystem Signals
6. EPAM Relevance
7. Your Connection
8. Talking Points
9. Questions to Ask
10. How to Make an Impression
11. Objection Handling
12. Suggested Next Steps

---

## Contributing

1. Clone this repo
2. Make changes in a feature branch
3. Open a pull request — tag `siba_padhy@epam.com` as reviewer
4. On merge, package a new release:
   ```bash
   cd epam-sf-meeting-brief && zip -r ../epam-sf-meeting-brief.plugin . -x "*.DS_Store" -x "node_modules/*"
   ```
5. Upload to the GitHub Releases page

### Planned Enhancements

- [ ] ZoomInfo API connector (awaiting credentials)
- [ ] Clay waterfall enrichment connector
- [ ] Exa semantic search integration
- [ ] Auto-upload brief to OneDrive (no manual sync step)
- [ ] Outlook calendar auto-pull (pre-fill form from invite)
- [ ] Brief index dashboard artifact

---

## Requirements

- Cowork desktop app
- Microsoft 365 account (EPAM tenant)
- Node.js (for .docx generation) — pre-installed in Cowork sandbox
- `docx` npm package — installed automatically on first run

---

## Maintainer

Siba Padhy · EPAM Salesforce Practice · `siba_padhy@epam.com`
