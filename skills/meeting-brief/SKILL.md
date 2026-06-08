---
name: meeting-brief
description: >
  Generate a comprehensive AI-powered meeting brief for any sales, partnership,
  or customer meeting. Use this skill whenever a user asks to "prepare for a meeting",
  "research a contact", "generate a meeting brief", "brief me on someone", or submits
  the Meeting Brief intake form. The skill researches the contact from public sources,
  cross-references prior briefs in the shared OneDrive folder, and delivers a
  formatted 13-section brief plus a Word document (.docx) saved to the workspace.
---

# Meeting Brief Agent — Skill Instructions

## When This Skill Is Active

This skill fires when:
- The user submits the Meeting Brief intake form (message contains "📋 MEETING BRIEF REQUEST")
- The user asks to prepare for a meeting, research a contact, or get a brief on someone
- The user pastes a LinkedIn URL and asks for context

## Workflow — Execute in This Exact Order

### Step 1 — Parse the Request

Extract from the user's message:
- Contact name(s), title, company, LinkedIn URL
- Meeting type (Customer / Prospect / Salesforce Field / Partner / Other)
- Meeting occasion (Discovery / Follow-up / QBR / Conference / Renewal / Exec Intro)
- User's goal for the meeting
- Any supporting content (email, bio, event info)

### Step 2 — Search OneDrive for Prior Briefs

Before doing any external research, search the shared brief library:

1. Use `sharepoint_search` with query: `[CompanyName] Brief` and `fileType: "docx"`
2. If results found from the shared OneDrive folder, read the most recent brief using `read_resource`
3. Extract: prior EPAM contacts, relationship history, known Salesforce AEs, open opportunities, meeting outcomes
4. Surface this in the brief under "Prior Research on This Account"
5. If no prior briefs exist, note: "This is the first brief generated for this account."

> The shared OneDrive folder is: Salesforce Practice Meeting Brief (epam-my.sharepoint.com)
> Only retrieve briefs from this folder — do not write to OneDrive.

### Step 3 — Research the Contact

Run these searches in parallel:

**LinkedIn**
- Search: `"[Full Name]" "[Company]" site:linkedin.com/in`
- Fetch the profile page
- Extract: current role, career history, education, tenure, recent activity, prior companies

**ZoomInfo (public)**
- Search: `"[Full Name]" "[Company]" site:zoominfo.com`
- Extract: title confirmation, company firmographics, tech signals

**RocketReach / public contact sources**
- Search: `"[Full Name]" "[Company]" site:rocketreach.co`
- Extract: role, department, seniority

**Company Research**
- Fetch the company website About/Leadership page
- Search: `[Company] news 2025 2026` — funding, acquisitions, exec changes, product launches
- Search: `[Company] Salesforce CRM implementation` — ecosystem signals
- Search: `[Company] Salesforce AppExchange` — partnership signals

**Outlook History**
- Search Outlook emails using `outlook_email_search` with query: `[Company] OR [Contact Name]`
- Extract: prior email threads, event invites, meeting history, known EPAM contacts on the account

**LinkedIn Mutual Connections**
- Search: `"[Full Name]" "[Company]" linkedin.com/in mutual connections`
- Search: `"[Full Name]" "[Company]" linkedin.com EPAM` — EPAM colleagues who may know this person
- Search: `"[Full Name]" "[Company]" linkedin.com Salesforce` — Salesforce AEs or SE in common
- Search Outlook using `outlook_email_search` for any prior cc/email thread involving the contact's name or domain
- Search `chat_message_search` in Teams for any mention of the contact name or company
- Cross-reference the contact's prior companies (from their LinkedIn history) against known EPAM accounts — shared employers are strong warm-intro signals
- Identify: EPAM colleagues, Salesforce field reps, mutual industry peers, or former colleagues who could make an introduction or provide a reference

**Crunchbase (for startups / growth companies)**
- Search: `[Company] site:crunchbase.com`
- Extract: funding rounds, investors, headcount, founding year

**SEC EDGAR (for public companies)**
- Search: `[Company] 10-K annual report site:sec.gov`
- Extract: revenue, business model, key risks, technology investments

See `references/research-sources.md` for full source list and what to extract from each.

### Step 4 — Generate the Brief in Chat

Deliver the full 13-section brief in chat. See `references/brief-sections.md` for the exact structure and content of each section.

Format guidelines:
- Use clear section headers with emoji icons
- Lead with the At-a-Glance table
- Include Prior Research section immediately after At-a-Glance if prior briefs exist
- Talking Points should be specific and numbered, not generic bullets
- Questions to Ask should be open-ended and insight-seeking, not yes/no
- Keep the total brief scannable — the user is reading before a meeting

### Step 5 — Save as Word Document

After delivering the brief in chat, generate a formatted `.docx` file:

1. Use the `generate-brief.js` script in `scripts/` as the template pattern
2. Populate it with the researched content
3. Name the file: `YYYY-MM-DD_[CompanyName]_[ContactLastName]_[ContactFirstName]_Brief.docx`
   - Remove spaces from company name (e.g., `HyattHotels` not `Hyatt Hotels`)
   - Example: `2026-05-21_HyattHotels_Hansen_Dan_Brief.docx`
4. Save to the workspace folder so the user can sync it to OneDrive

Tell the user: *"Save this to your shared OneDrive folder (Salesforce Practice Meeting Brief) so the team can reference it for future meetings with this account."*

## Quality Standards

- Every claim must be sourced — never fabricate company or contact details
- If a piece of information cannot be confirmed from research, flag it as "unconfirmed" or omit it
- Talking points must be specific to this contact and company — not generic sales language
- The Prior Research section must accurately reflect what was found in OneDrive, not invented context
- The Word doc must validate (use the docx skill's validate.py script)
