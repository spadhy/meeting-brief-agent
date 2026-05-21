const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ── Colours ──────────────────────────────────────────────────────────────────
const RED   = "CC0000";
const DARK  = "1A1A2E";
const GRAY  = "6B7280";
const LGRAY = "F4F5F7";
const MGRAY = "E5E7EB";
const WHITE = "FFFFFF";

// ── Helpers ───────────────────────────────────────────────────────────────────
const border = (c = MGRAY, sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color: c });
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: WHITE });
const cellBorders = (all = MGRAY) => ({ top: border(all), bottom: border(all), left: border(all), right: border(all) });
const noBorders   = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });

function p(runs, opts = {}) {
  return new Paragraph({ children: Array.isArray(runs) ? runs : [runs], ...opts });
}
function t(text, opts = {}) {
  return new TextRun({ text, font: "Arial", ...opts });
}
function spacer(before = 80) {
  return new Paragraph({ children: [t("")], spacing: { before, after: 0 } });
}

// ── Section header ────────────────────────────────────────────────────────────
function sectionHeader(text) {
  return [
    spacer(160),
    new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), font: "Arial", size: 20, bold: true, color: RED })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RED, space: 4 } },
      spacing: { before: 0, after: 80 },
    })
  ];
}

// ── At-a-glance table row ─────────────────────────────────────────────────────
function glanceRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        borders: cellBorders(MGRAY),
        shading: { fill: LGRAY, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [p(t(label, { bold: true, size: 20, color: DARK }))],
      }),
      new TableCell({
        width: { size: 7360, type: WidthType.DXA },
        borders: cellBorders(MGRAY),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [p(t(value, { size: 20, color: DARK }))],
      }),
    ]
  });
}

// ── Two-column talking point ──────────────────────────────────────────────────
function bulletPara(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [t(text, { size: 20 })],
    spacing: { before: 40, after: 40 },
  });
}

// ── Objection table row ───────────────────────────────────────────────────────
function objRow(objection, response) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3600, type: WidthType.DXA },
        borders: cellBorders(MGRAY),
        shading: { fill: "FFF0F0", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [p(t(objection, { size: 19, italics: true, color: "991B1B" }))],
      }),
      new TableCell({
        width: { size: 5760, type: WidthType.DXA },
        borders: cellBorders(MGRAY),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [p(t(response, { size: 19, color: DARK }))],
      }),
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRIEF DATA — Dan Hansen / Hyatt Hotels Corporation
// ═══════════════════════════════════════════════════════════════════════════════
const brief = {
  contact:    "Dan Hansen",
  title:      "Head of Americas Development & Global Head of Brand, Hyatt Studios",
  company:    "Hyatt Hotels Corporation",
  email:      "dan.hansen@hyatt.com",
  linkedin:   "https://www.linkedin.com/in/daniel-hansen-23239b207/",
  date:       "May 21, 2026",
  author:     "Siba Padhy",
  meetingType:"Customer — Existing Account",
  occasion:   "Follow-up / Relationship Development",
  priorTouch: "Hyatt/Salesforce/EPAM event · Flight Club Chicago · April 13, 2026",
  sources:    "LinkedIn, RocketReach, CoStar, Hotel Management, Hyatt Newsroom, InfotechLead, Outlook",
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: RED },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 720, right: 1080, bottom: 1080, left: 1080 }
      }
    },

    // ── Header ───────────────────────────────────────────────────────────────
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              t("EPAM", { bold: true, size: 18, color: WHITE, highlight: undefined }),
              t("  ·  Salesforce Practice  ·  Meeting Brief", { size: 18, color: WHITE }),
              t("\t" + brief.date, { size: 18, color: "FFCCCC" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            shading: { fill: RED, type: ShadingType.CLEAR },
            spacing: { before: 100, after: 100 },
            indent: { left: 160, right: 160 },
          })
        ]
      })
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              t("Confidential — EPAM Salesforce Practice", { size: 16, color: GRAY }),
              t("\tPage ", { size: 16, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
              t(" of ", { size: 16, color: GRAY }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: GRAY }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: MGRAY, space: 4 } },
            spacing: { before: 80 },
          })
        ]
      })
    },

    children: [

      // ── TITLE BLOCK ────────────────────────────────────────────────────────
      spacer(200),
      new Paragraph({
        children: [t(brief.contact, { bold: true, size: 52, color: DARK })],
        spacing: { before: 0, after: 40 }
      }),
      new Paragraph({
        children: [t(brief.title, { size: 24, color: GRAY })],
        spacing: { before: 0, after: 20 }
      }),
      new Paragraph({
        children: [t(brief.company, { size: 24, bold: true, color: RED })],
        spacing: { before: 0, after: 20 }
      }),
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: brief.linkedin,
            children: [t("View LinkedIn Profile →", { size: 20, color: "1E40AF", underline: { type: "single" } })]
          })
        ],
        spacing: { before: 0, after: 0 }
      }),
      spacer(80),
      new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 1 } },
        spacing: { before: 0, after: 160 }
      }),

      // ── AT-A-GLANCE ────────────────────────────────────────────────────────
      ...sectionHeader("⚡ At-a-Glance"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 7360],
        rows: [
          glanceRow("Contact",      brief.contact),
          glanceRow("Title",        brief.title),
          glanceRow("Company",      brief.company),
          glanceRow("Email",        brief.email),
          glanceRow("Meeting Type", brief.meetingType),
          glanceRow("Occasion",     brief.occasion),
          glanceRow("Prior Touch",  "✅ " + brief.priorTouch),
          glanceRow("Prepared by",  brief.author + " · " + brief.date),
        ]
      }),

      // ── COMPANY SNAPSHOT ──────────────────────────────────────────────────
      ...sectionHeader("🏢 Company Snapshot"),
      p(t("Hyatt Hotels Corporation is a global hospitality company with a record pipeline of ~148,000 rooms as of year-end 2025 — a 7% YoY increase. Their newest brands (Hyatt Studios, Unscripted by Hyatt, Hyatt Select) drove 65%+ of all new U.S. deals in 2025. Hyatt is aggressively pursuing an asset-light model, targeting ~90% of earnings from asset-light operations in 2026.", { size: 20 }), { spacing: { after: 120 } }),
      p(t("Key signals:", { bold: true, size: 20 })),
      bulletPara("Hyatt Studios is the primary growth engine — upper-midscale extended-stay, developer-first, franchise model"),
      bulletPara("AI and digital transformation are board-level priorities — RevPAR up 5.4% and 63M+ loyalty members in Q1 2026"),
      bulletPara("Salesforce CRM is live via Hapi PMS integration — connecting guest data into Marketing Cloud, Sales Cloud, Service Cloud"),
      bulletPara("CIO: Eben Hewitt oversees enterprise technology, cybersecurity, and enterprise applications"),
      bulletPara("Caliber is actively developing Hyatt Studios across three high-growth markets (April 2026 announcement)"),

      // ── CONTACT PROFILE ───────────────────────────────────────────────────
      ...sectionHeader("👤 Contact Profile"),
      p(t("Career Arc", { bold: true, size: 20, color: RED }), { spacing: { after: 40 } }),
      p(t("Dan spent over a decade as President and CEO of Summit Hotel Properties (NYSE: INN), taking it public in 2011 and leading it through sustained growth before retiring in 2022. He is an owner and operator first — not a career brand executive.", { size: 20 }), { spacing: { after: 80 } }),
      p(t("Why He Came Back", { bold: true, size: 20, color: RED }), { spacing: { after: 40 } }),
      p(t("Hyatt approached him in November 2022 to lead the newly launched Hyatt Studios brand. He describes it as \"the only thing that would have brought me out of retirement\" — driven by genuine belief in the white space opportunity and the quality of people at Hyatt.", { size: 20 }), { spacing: { after: 80 } }),
      p(t("What Drives Him", { bold: true, size: 20, color: RED }), { spacing: { after: 40 } }),
      bulletPara("Owner/developer empathy — he consistently positions himself on the developer side, not corporate brand"),
      bulletPara("Entrepreneurial energy — views Hyatt Studios as building something new, not managing something old"),
      bulletPara("Radical transparency — his own words: \"I don't know any other way to be other than open, honest and transparent\""),
      bulletPara("Pipeline pride — 70+ executed deals, first openings underway in new U.S. markets"),
      spacer(80),
      p(t("Education: BA Economics, South Dakota State University  ·  Based in Austin, TX", { size: 19, color: GRAY, italics: true })),

      // ── SALESFORCE ECOSYSTEM ──────────────────────────────────────────────
      ...sectionHeader("☁️ Salesforce Ecosystem Signals"),
      bulletPara("Hyatt is a confirmed Salesforce customer — Hapi integration bridges PMS to Marketing Cloud, Sales Cloud, Service Cloud"),
      bulletPara("Multiple Salesforce AEs and SEs are actively engaged (Karen Walker, Ben Roberts, Jon Iwert, and others present at the April 13 event)"),
      bulletPara("Opportunity: Hyatt Studios is greenfield — franchise-ready Salesforce infrastructure not yet built at scale"),
      bulletPara("Key use cases: owner onboarding automation, deal pipeline management, franchise performance reporting, loyalty integration"),

      // ── EPAM RELEVANCE ────────────────────────────────────────────────────
      ...sectionHeader("🎯 EPAM Relevance"),
      bulletPara("EPAM already has a seat at the table — the April 2026 joint Hyatt/Salesforce/EPAM event confirms active ecosystem participation"),
      bulletPara("Hyatt Studios needs tech infrastructure that scales with a franchise model — the right time to build is before 100 properties"),
      bulletPara("EPAM's Salesforce Practice brings hospitality vertical depth + Salesforce AppExchange presence"),
      bulletPara("EPAM has grown from Top 12 to Top 9 Salesforce Partners in 6 months (per internal practice deck, 2025)"),

      // ── YOUR CONNECTION ───────────────────────────────────────────────────
      ...sectionHeader("🤝 Your Connection"),
      p(t("You were both at the Hyatt/Salesforce/EPAM evening at Flight Club Chicago on April 13, 2026 (6pm–9:30pm). Other EPAM attendees in the same room: Troy Mitchell, Chris Wojtowicz, TK Horeis. Salesforce team: Karen Walker (organizer), Ben Roberts, Jon Iwert, and ~10 others. Hyatt team: 25+ attendees including Dan Hansen.", { size: 20 }), { spacing: { after: 80 } }),
      p(t("Suggested opener: ", { bold: true, size: 20 })),
      p(t("\"Great to reconnect after the Flight Club evening back in April — that was a great group. Wanted to pick up on some of the conversations from that night about how EPAM and Hyatt Studios can build something meaningful together.\"", { size: 20, italics: true, color: DARK }), { spacing: { after: 80 } }),
      p(t("Personal angles: South Dakota State University connection · Austin-based (if relevant to travel plans) · Shared conviction-driven work style", { size: 19, color: GRAY, italics: true })),

      // ── TALKING POINTS ────────────────────────────────────────────────────
      ...sectionHeader("💬 Talking Points"),
      p(t("1. \"EPAM was in the room in April — let's make it concrete\"", { bold: true, size: 20, color: DARK })),
      p(t("Reference the joint event as proof of Salesforce's positioning of EPAM as preferred SI. Ask what he and his team saw as the biggest opportunity from that collaboration.", { size: 20 }), { spacing: { after: 100 } }),
      p(t("2. \"Hyatt Studios is a greenfield Salesforce build — that's your advantage\"", { bold: true, size: 20, color: DARK })),
      p(t("Unlike legacy brands with tech debt, Studios can be architected right from the start. EPAM builds the franchise-ready Salesforce stack that scales with the pipeline.", { size: 20 }), { spacing: { after: 100 } }),
      p(t("3. \"You come from the owner side — so do we in practice\"", { bold: true, size: 20, color: DARK })),
      p(t("Dan cares that technology serves developers and owners, not just brand HQ. Position EPAM's work as building tools that make owner onboarding, performance reporting, and deal tracking easier.", { size: 20 }), { spacing: { after: 100 } }),
      p(t("4. \"70 deals and growing fast — the window to do this right is now\"", { bold: true, size: 20, color: DARK })),
      p(t("The moment to establish the right Salesforce foundation is before scale creates complexity. After 100 properties, retrofitting is much harder and more expensive.", { size: 20 }), { spacing: { after: 100 } }),
      p(t("5. \"AI is on Mark Hoplamazian's agenda — where does Studios fit?\"", { bold: true, size: 20, color: DARK })),
      p(t("Hyatt's CEO has made AI-led growth a company-wide priority. Ask Dan where Hyatt Studios participates — opens a conversation about data, personalization, and where EPAM's AI + Salesforce capabilities accelerate his roadmap.", { size: 20 }), { spacing: { after: 0 } }),

      // ── QUESTIONS ────────────────────────────────────────────────────────
      ...sectionHeader("❓ Questions to Ask"),
      bulletPara("\"When the Hyatt Studios pipeline hits 100 properties, what does your owner-facing tech infrastructure look like today vs. what it needs to be?\""),
      bulletPara("\"How are you managing deal flow and franchise pipeline tracking right now — is that in Salesforce or something else?\""),
      bulletPara("\"What was most useful from the April event for your team? What would make the Hyatt/Salesforce/EPAM collaboration more tangible?\""),
      bulletPara("\"You came from the owner side at Summit — what's the one thing brand tech always got wrong that you're determined to do differently at Studios?\""),
      bulletPara("\"Where does Hyatt Studios sit in the broader AI and digital strategy Hoplamazian outlined in Q1?\""),

      // ── HOW TO IMPRESS ────────────────────────────────────────────────────
      ...sectionHeader("✨ How to Make an Impression"),
      p(t("Professionally: ", { bold: true, size: 20 })),
      p(t("Dan is an operator-turned-brand-builder. Lead with the owner/developer problem, not the technology solution. Show you understand why he came out of retirement: this brand has to work for franchisees first, or it doesn't work at all. Skip the credential deck — be specific and concrete.", { size: 20 }), { spacing: { after: 80 } }),
      p(t("Personally: ", { bold: true, size: 20 })),
      p(t("He values directness and authenticity above polish. Match his candor. If something isn't relevant, say so. If you see a real opportunity, name it specifically. He'll respect that more than corporate hedging.", { size: 20 }), { spacing: { after: 80 } }),
      p(t("The April event is your secret weapon: ", { bold: true, size: 20 })),
      p(t("You are not a vendor cold-calling. You were in the same room at a collaborative evening. Open with that. It reframes the entire dynamic from pitch to continuation.", { size: 20 })),

      // ── OBJECTIONS ────────────────────────────────────────────────────────
      ...sectionHeader("⚠️ Objection Handling"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3600, type: WidthType.DXA },
                borders: cellBorders(RED),
                shading: { fill: RED, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [p(t("Objection", { bold: true, size: 20, color: WHITE }))],
              }),
              new TableCell({
                width: { size: 5760, type: WidthType.DXA },
                borders: cellBorders(RED),
                shading: { fill: RED, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [p(t("Response", { bold: true, size: 20, color: WHITE }))],
              }),
            ]
          }),
          objRow(
            "\"We already have a Salesforce team at Hyatt\"",
            "This isn't about replacing what's there. It's about making sure Studios, as a franchise-first brand scaling fast, has the right layer built specifically for your developer community."
          ),
          objRow(
            "\"We're focused on construction and opening hotels right now\"",
            "That's exactly the right time — the cost of building it right now is a fraction of retrofitting at 100 properties. We're talking about a foundation, not a distraction."
          ),
          objRow(
            "\"We don't have budget for a big SI engagement\"",
            "Start with a focused discovery on one pain point: owner onboarding or pipeline reporting. Quick win, low risk, measurable."
          ),
        ]
      }),

      // ── NEXT STEPS ────────────────────────────────────────────────────────
      ...sectionHeader("🏁 Suggested Next Steps"),
      bulletPara("Close the meeting on a specific follow-up — ideally a short working session with Dan + Salesforce contacts (Karen Walker, Jon Iwert) to map Studios' current vs. future-state Salesforce needs"),
      bulletPara("Bring Troy Mitchell or Chris Wojtowicz — they were at the April event too; reinforces continuity and team depth"),
      bulletPara("Follow up with a one-pager — EPAM + Salesforce + Hyatt Studios framing, not a proposal; just enough to keep the conversation moving"),

      // ── PRIOR RESEARCH NOTE ───────────────────────────────────────────────
      ...sectionHeader("📂 Brief History"),
      p(t("This is the first brief generated for this contact. Future briefs on Hyatt Hotels Corporation will reference this document automatically.", { size: 19, color: GRAY, italics: true })),

      // ── SOURCES ───────────────────────────────────────────────────────────
      spacer(200),
      new Paragraph({
        children: [],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: MGRAY, space: 4 } },
        spacing: { before: 0, after: 80 }
      }),
      p(t("Research Sources: " + brief.sources, { size: 17, color: GRAY, italics: true })),
      p(t("Generated: " + brief.date + "  ·  Prepared by: " + brief.author + "  ·  EPAM Salesforce Practice", { size: 17, color: GRAY })),

    ]
  }]
});

// ── Write file ────────────────────────────────────────────────────────────────
const outputPath = process.argv[2] || "brief-output.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ Brief written to:", outputPath);
}).catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
