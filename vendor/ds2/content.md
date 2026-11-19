# Content design and formatting

How Catalyst screens use words and show values. Everything a screen shows (labels, messages, mock data, Cooper's answers) follows these rules. Values go through `IFS.format` (section 6), so a number looks the same on every screen.

Status: draft for review, v2.0.1. Rules marked **(decide)** are waiting on a team decision (section 9).

People who read Catalyst: Portfolio Owners, Investment Owners, Asset Managers, finance leads and field SMEs. They are experts in their assets, short of time, and they make decisions worth millions with what the screen tells them. So the words must be exact, short and calm.

---

## 1. Voice and tone

Catalyst sounds like a **trusted planning analyst**: it knows the numbers, says the important thing first, and doesn't show off.

| Principle | Do | Don't |
|---|---|---|
| **Conclusion first.** Lead with the result, then the reason. | "Reliability is 1.1 min over target. The June storm caused most of it." | "Based on analysis of outage data, there may be some impact on reliability." |
| **Specific.** Name the thing, the number and the time. | "6 investments are 10 weeks late." | "Some investments are delayed." |
| **Plain and short.** Everyday words, sentences of about 20 words at most, no internal jargon. Domain terms users know (SAIDI, capex, NPV) are fine. | "How Cooper got this" | "Agentic synthesis of context" |
| **Talk to the user as "you".** Use "we" only for the company, rarely. | "You can't edit an active framework." | "The user cannot edit…" |
| **Calm.** No exclamation marks, hype or emoji. Success is stated, not celebrated. | "Plan ready for review." | "Awesome! Your plan is ready!" |
| **Honest about certainty.** Cooper shows where an answer comes from and how sure it is, and never pretends to be a person. | "Cooper recommends deferring (high confidence, 4 sources)." | "I think you might want to defer 😊" |
| **Consistent.** One term per idea everywhere. | "Scenario" on every screen | "Scenario" here, "What-if" there |

**Tone shifts with the moment; the voice doesn't.** Routine and success: brief and neutral. Warnings: direct, with the consequence. Errors and destructive actions: serious, specific and helpful, never cute.

**Words to avoid** (in every element; a quoted file or system name is the only exception):

| Avoid | Why / use instead |
|---|---|
| please, sorry, oops, whoops | Say the fact and the next step. ("Sorry" only when the product truly failed the user, and then once.) |
| simply, just, easy, obviously | What's easy for us may not be for them. Delete it. |
| seamless, powerful, robust, magic, smart, AI-powered | Say what it does. |
| leverage, utilize, facilitate, empower | use, help, let |
| click here, here, learn more (alone) | Name the destination: "See the storm report". |
| invalid, illegal, failed, fatal, abort, error (alone) | What went wrong and how to fix it. |
| chatbot, bot, the AI | Cooper |
| `!`, emoji, ALL CAPS for emphasis | A full stop; plain words ("isn't approved yet"). |

**Writing for everyone** (inclusive and global writing): use gender-neutral words (they, staff, people); don't describe people by ability ("see", "click" are fine for actions, but prefer "select" and "choose" in instructions that keyboard users follow too); avoid idioms, sports metaphors and culture-specific jokes; keep one idea per sentence so it translates; use common contractions (can’t, don’t, isn’t): they read as human and translate fine.

## 2. Capitalisation

Case (Title Case, sentence case, no uppercase) is set by the **Case** rule in [guide/typography.md](typography.md); this guide only owns the strings. Write names as their owners do (Cooper, IFS, the stage names, a record's name exactly as entered) and acronyms as acronyms (FY27, SAIDI, NPV) **(decide capex vs CAPEX)**.

## 3. Labels: buttons, links and menus

- **Start with a verb and name the object** when it isn't obvious from context: "Add model", "Send for approval", "Archive investment". One or two words are enough when the context names the object (a "Save" button at the bottom of an edit form).
- **Never** "OK", "Submit", "Yes" / "No" as the only label: say what happens. The secondary action of a dialog is "Cancel" (it closes without changes) or a real alternative ("Keep draft").
- **Same action, same word:** "Delete" removes for good, "Remove" takes something out of a group without destroying it ("Remove collaborator"), "Archive" hides it and can be undone. Create vs Add: "Create" makes something new from nothing ("Create framework"), "Add" puts an existing or simple item in a container ("Add model", "Add note").
- **Ellipsis on a label** (`…`) only when the action needs more input before it happens ("Rename…" in a menu). Not on buttons that open a dialog with nothing to fill in.
- **Links** say where they go: "See the storm report", never "click here" or a bare "Learn more". A link in a sentence is part of the sentence ("Approvers are listed in the approval chain.").
- **Icon-only buttons** get the same verb-object label as their `label` prop (it is the tooltip and the accessible name): "Delete file", "Retry upload", "Previous month".
- **Cooper prompt chips** are questions or requests, written as the user would type them: "Why did Northeast slip?", "Summarize unresolved gaps".
- **No end punctuation** on buttons, labels, titles, tabs or menu items. Full stops on full sentences in body text, descriptions, messages and tooltips (a tooltip of 1–3 words doesn't need one).

## 4. Message patterns

Each message answers up to three questions in this order: **what happened, why (if it helps), what to do next.** Put the most important words first: titles get skimmed.

### Error (Alert `type="error"`, inline field error, EmptyState `cause="error"`)
- Say what went wrong in the user's terms, and how to fix it. No blame ("You entered…"), no "Oops", no codes alone (add a code after the sentence when support needs it).
- Field errors say what's needed, not that it's wrong: "Enter a date after Jan 1, 2027." — not "Invalid date". Required field: "Enter a name" or "Name is required".
- System errors: heading "Couldn't Load Frameworks", body "The server didn't respond. Try again in a minute." Action button: **Try again** (not Retry).
- Form summary: "3 fields need attention" then a list.

### Warning (Alert `type="warning"`)
- The risk and its consequence, then the way out: "Weighting is no longer balanced. The total strategic objective weight is above 100%." Button: "Rebalance weights".

### Success (Alert `type="success"`, Snackbar / `IFS.toast`)
- Past tense, object first, 2–5 words: "Investment saved", "Framework published", "3 investments moved to Plan". Add a description only if it says something new ("Collaborators were notified."). Offer **Undo** for reversible actions instead of a confirmation dialog.
- Don't toast what the screen already shows (the row appearing in the list is the confirmation).

### Info
- Neutral, short, and only when it changes what the user does next: "This framework is active, so it's read-only."

### Empty states (EmptyState)
Say why it's empty and what to do. The heading states the situation; the body gives the next step; the button does it.

| Cause | Heading | Body | Button |
|---|---|---|---|
| first-run | "No Value Frameworks Yet" | "Create your first framework to start planning." | "Create framework" |
| empty-container | "No Models in This Framework" | "Add a model to start scoring investments." | "Add model" |
| all-done | "All Caught Up" | "No frameworks are waiting for approval." | — |
| error | "Couldn't Load Frameworks" | "The server didn't respond. Try again in a minute." | "Try again" |
| no-access | "You Don't Have Access to This Framework" | "Ask the framework owner to share it with you." | "Request access" |
| no-results | "No Frameworks Match Your Filters" | "Try a different term, or clear filters to see all frameworks." | "Clear filters" |
| no-results-similar | "No Results for “WDRM-2”" | "You might be looking for" + chips | — |

### Loading (Spinner, LoadingMore, LoadingRegion, Skeleton)
- Prefer a skeleton (no words). When text is needed: "Loading…" or "Loading investments…" with the ellipsis character `…`, not three dots. Long jobs say what's happening and how far: "Re-scoring 1,621 investments… 40%".
- Screen readers: LoadingRegion announces "Loading <label>" and "Loaded" — give it a `label` that names the content ("investments").

### Confirmation and destructive actions (Modal)
- Ask only when the action can't be undone or affects other people. Otherwise do it and offer Undo.
- **Title:** the action and the object, as a question: "Delete This Comment?", "Archive Harbor Substation Upgrade?"
- **Body:** the consequence, specific: "The comment is deleted for all collaborators. This can't be undone." / "Chats move to Trash and are deleted after 30 days."
- **Buttons:** the primary button repeats the verb and object ("Delete comment", "Remove collaborator"), styled as destructive where Figma has it; secondary is "Cancel". Never "Yes" / "No" / "OK".
- Never "Are you sure?".

## 5. Terms

Use one term per idea across screens. The kit's mock data and labels use: **investment** (not project), **portfolio**, **scenario** (not what-if), **value framework**, **constraint**, **approve / approval** (not sign off), **sign in / sign out**, **email**, US spelling (optimization, prioritize). A full Catalyst glossary exists in the team's voice-check material and is not in this repo yet **(decide)**.

## 6. Numbers, money, dates and fiscal years

Use the helpers: they implement every rule below and follow the user's locale (en-US by default; set once with `IFS.format.configure({ locale, currency, fyStartMonth })`). Full API: `dist/api.md` → **format**.

### Money
| Rule | Example | Helper |
|---|---|---|
| Under $10,000: in full, no cents unless the amount has them | $8,450 · $12.50 | `money(8450)` |
| $10,000 and up: K / M / B with **3 significant digits** | $860K · $19.4M · $192M · $3.04B | `money(19.4e6)` |
| Zero | $0 | `money(0)` |
| Negative: **true minus sign** `−` (U+2212) before the symbol. No hyphen, no parentheses. | −$1.8M | `money(-1.8e6)` |
| A change: always signed | +$1.3M · −$600K · $0 | `change(1.3e6)` |
| A column, axis or comparison: **one unit for all values**, fixed decimals | $0.6M · $4.4M · $12.4M | `money(v, { unit: 'M', decimals: 1 })` |
| Exact amount (forms, exports, audit) | $19,400,000 | `money(v, { compact: false })` |
| No value | — | any helper with `null` |

- Abbreviations: **K** thousand, **M** million, **B** billion, capital letters, no space, no full stop. Never "MM", "mn" or "bn".
- Currency symbol: `$` is US dollars. When a portfolio has another currency, or users span countries that all use "$", show the code once in the column header or page ("Cost (CAD)") rather than on every value.
- Don't rely on colour alone for negatives: the minus sign is always there.

### Numbers
- Thousands separators from 1,000: "1,621 investments". Counts are never abbreviated unless space forces it (`number(v, { compact: true })` → "19.4K").
- Decimals: as many as the decision needs, the same within a column. Ratios like benefit-cost: "2.4" (the label says it's a ratio; no "x").
- Numerals for all numbers in UI ("3 investments", "0 results"), including one to nine. Spell out only in idioms ("one or two sentences").
- Units: a space between number and unit, short units in tables and cards, full words in sentences: "5.1 min" in a table, "5.1 minutes" in a sentence (`number(5.1, { unit: 'min' })`, non-breaking space).
- Ranges: en dash, no spaces: "28–35%", "$1.2M–$1.8M" (repeat the symbol and unit). In sentences, "from … to …".

### Percentages
- No space before `%`: "4.8%", not "4.8 %". Up to 1 decimal; whole numbers without one: "48%". Helper: `percent(4.8)` (or `percent(0.048, { ratio: true })`).
- A change in a percentage is in **points**: "Risk coverage rose 3 points (91% → 94%)". In tight tables "+3 pts".
- Signed change: `change(-2.1, 'percent')` → "−2.1%".

### Dates
| Use | Format | Helper |
|---|---|---|
| Default (tables, cards, metadata) | Nov 12, 2026 | `date(d)` |
| Sentences, formal documents | November 12, 2026 | `date(d, { style: 'long' })` |
| When the year is obvious (a timeline inside one year) | Nov 12 | `date(d, { style: 'short' })` |
| Month | Nov 2026 | `date(d, { style: 'month' })` |
| Range | Nov 12 – 18, 2026 · Nov 28, 2026 – Jan 4, 2027 | `dateRange(a, b)` |
| Exports and data only | 2026-11-12 | `date(d, { style: 'iso' })` |

- Never all-numeric dates in the UI (11/12/2026 is November in the US and December elsewhere).
- Dates from data as `YYYY-MM-DD` are calendar dates: the helpers read them in local time. (`new Date('2026-11-12')` is UTC midnight and shows **Nov 11** in the Americas — a real bug the helpers avoid.)
- Days of the week only when they matter for the decision ("Due Fri, Nov 13").

### Times
- "3:44 AM": 12-hour clock with AM/PM in en-US (the locale decides elsewhere), minutes always shown: "3:00 PM", not "3 PM". `time(d)`.
- Date and time: "Nov 12, 2026, 3:44 AM" (`dateTime(d)`).
- Add the time zone when people in several zones see the same deadline: "5:00 PM PT".
- **Relative time** for recent activity (comments, edits, notifications): "just now" (under 45 seconds), "5 minutes ago", "3 hours ago", "yesterday", "4 days ago"; from 7 days, the date. `relative(d)`. Show the exact date and time in a tooltip. Use absolute dates for deadlines and anything legal or financial.
- Durations: "2 hr 15 min" in tables, "2 hours 15 minutes" in sentences; countdowns "3h left".

### Fiscal years
| Use | Format | Helper |
|---|---|---|
| Default | FY27 | `fy(2027)`, `fy(date)` |
| Range (planning horizon) | FY27–FY31 (en dash, no spaces, FY repeated) | `fyRange(2027, 2031)` |
| Quarter | Q2 FY27 | `fy(date, { quarter: true })` |
| Where two digits are ambiguous (horizons past 2099, legal text) | FY2027 | `fy(2027, { style: 'long' })` |

- Never "FY 2027", "FY'27", "fy27" or "FY27-31".
- A fiscal year is named for the calendar year it **ends** in. The start month is per customer: `IFS.format.configure({ fyStartMonth: 10 })` makes Oct 1, 2026 the start of FY27. Calendar quarters are "Q1 2026" (no FY).

## 7. How the benchmarks compare

All five public systems publish content guidance; Notion has no public system.

| Topic | Atlassian | Material 3 | Carbon | Fluent 2 | Apple HIG | Catalyst |
|---|---|---|---|---|---|---|
| Voice principles | Voice and tone | Content design | Content | Content design | Writing | §1 |
| Capitalisation | Sentence case | Sentence case | Sentence case | Sentence case | **Title case** for titles, buttons and menus (macOS) | See typography.md (Case) |
| Inclusive / global writing | Inclusive writing | Global writing | Yes | Yes | Inclusion | §1 (short) |
| Button labels: verb + object | Yes | Yes | Yes | Yes | Yes | §3 |
| Message patterns (error, success, empty, confirm) | Designing messages | Yes (dialogs, snackbars) | Notifications, empty states as patterns | Yes | Alerts | §4 |
| Date and time formats | **Dedicated page** | Style guide | Partial | Partial | — | §6 |
| Number, currency and unit formats | Style | Style guide | Yes | Partial | — | §6 (in more depth: abbreviation thresholds, true minus, fiscal years) |
| Formatting code helpers | — | — | — | — | — | **`IFS.format`** |

What Catalyst takes from each: Atlassian's message structure and date/time page, Carbon's treatment of empty/loading/error/disabled/read-only as patterns with set copy, Material 3's global-writing rules, Fluent's "lead with what matters", and nothing on case here (the typography guide owns it). What only Catalyst needs: money abbreviations at portfolio scale, fiscal years and planning horizons, and Cooper's confidence and sources.

## 8. Findings in the kit (Nov 2026)

Changed on this branch:
- **`IFS.format` added** (`src/components/format.js`), loaded first by `index.js` and documented in `dist/api.md`.
- Components now use it: chart default number format (true minus, 3 significant digits, `—` for no value), Gauge and Funnel defaults; Calendar title and day labels and DatePicker's default `format`; Documents and Cooper file sizes; Approval table sort parser (`apNum`), which read "−$1.3M" (true minus) as **positive** before.
- Stories and demo: hand-rolled `$…M` and date formatters replaced with the helpers (charts, widget builder, activity, nav bar, table galleries; demo Library and Review); "4.8 %" → "4.8%" (24 places); "-$1.3M" hyphens → true minus in the Review demo; "$0.0M" → "$0".
- Copy: Spinner "Loading..." → "Loading…" (Figma's text has three dots); EmptyState `cause="error"` button "Retry" → "Try again"; destructive dialogs name the object ("Delete comment", "Remove collaborator", "Delete chat(s)", "Delete folder(s)", "Archive investment"); missing full stops in two empty-state bodies; EmptyState and Alert stories rewritten (no "Please", no "Close me.", specific headings).

Not changed (listed for decisions or other areas):
- **Real names in stories:** `src/gallery/patterns-nav-bar.jsx` uses "DC Water Capital Improvement Plan" / "DC Water capital" (a real utility), and `src/gallery/patterns-approval.jsx` uses "Jeff Pauska" as a person. The repo is public; replace both with made-up names unless they are cleared.
- "Projects by value driver" (demo Dashboard chart title) uses "projects" where the glossary says "investments".
- **"No results found" + "You might be looking for"** repeats in five components. Clearer: "No results for “query”". Left as is because it matches the Figma empty-state text.
- Chart tables and Funnel use `–` (en dash) for a missing value, the helpers use `—` (em dash). Pick one with the data viz area (helpers: `configure({ empty })`).
- Benefit-cost ratio shown as "2.40x" in the widget stories and "2.4" elsewhere.
- Demo screens and stories still hold most amounts as preformatted strings ("$3.1M"). That's fine for mock data that mirrors Figma, but a real screen should keep numbers in the data and format them at render.

## 9. Decisions waiting

1. **Bring the Catalyst voice-check rules and glossary into this repo?** (Their substance is reflected here in our own words; the glossary's product terms are not copied.)
2. **Missing-value mark:** em dash `—` (helpers) or en dash `–` (charts).
3. **capex vs CAPEX**, and whether role names (Portfolio Owner) are written as names.
4. **Fiscal-year start month** default (January today) and whether quarters are fiscal ("Q2 FY27") or calendar ("Q2 2026") by default.
5. **Accounting-style negatives** — parentheses "($1.8M)" in finance tables? This guide says no (true minus everywhere).
