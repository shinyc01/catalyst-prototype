# Screen: Command (home)

**Figma:** Command handover `QSh5FbHQ86rlWo0ViZCIDR`, page "Command Center" (8:59), with three persona sections:
- Investment Owner (26:62181), about 45 frames;
- Asset Manager (26:72666), 4 frames;
- Portfolio Owner (26:73841), 4 frames.

**Full frame-by-frame spec:** `command-figma-spec.md`. It has exact copy, every state, the dev-note rules and the inconsistencies.

## Personas `[Confirmed]`
There is one prototype with a persona switch, in Prototype settings (the gear in the NavBar). Each persona has one consistent user (see `data/whistler.md`):

| Persona | User | Decisions metrics | Following metrics |
|---|---|---|---|
| Investment Owner | Hollis Grant (HG) | CPV, V/C | CPV, Total investment value, V/C |
| Asset Manager | Mara Delgado (MD) | Health index, Risk ±% | Health index, Risk, Age vs useful life |
| Portfolio Owner | Owen Fitch (OF) | Forecast vs constraint, Total value | Forecast vs constraint, Total value selected / unselected |

The tab labels are **My works · Decisions · Conversations · Following** `[Confirmed]`. Each tab count is the number of items in that list (the Figma counts don't match the rows).

## What works
- **Decisions:**
  - **Sort and filter:** the filter menu offers sort by urgency, date, source or collaborator. The chip row changes to match: Normal/High/Critical, or the date presets with a Custom range (DatePicker range + Apply), or source tags, or collaborators.
  - **Drag to re-rank:** ranks renumber after a drop.
  - **Hover:** shows the drag handle and the ⋮ menu (Remind me later, Archive).
  - **Remind me later:** removes the card, with the toast "Snoozed for 7 days." and Undo.
  - **Archive:** moves the card to a collapsible "Archived" section. Its menu there offers Remind me later and Unarchive.
  - **Tooltips:** on the CPV, V/C, Health index, Risk and Forecast labels, and on truncated descriptions.
- **Conversations:**
  - Response cards show an avatar, role, message and a status: @you, Approved, Rejected, Confirm viability, a mention, or Wait for reply.
  - → opens the target (Build for the scope conversation; other targets show a toast).
  - The bell sends a reminder: it changes to "Last notified: Nov 17" and a disabled "Notified" button.
- **My works:** Updated / Draft cards. The featured card shows the live map. → goes to Build (Pad-Mount idea), the Study, or a toast.
- **Following:** three metric columns per persona, with the full description on hover.
- **Calendar:**
  - Shows November 2026, with today Nov 17 `[Added]`, and events colour-coded as Milestone, Scheduled, Private and Regulatory.
  - **Add event** opens "New private event" (name, date, time, lasts). Add stays disabled until the fields are filled; adding shows the toast "Event created" with Undo, and the day gets a blue line.
  - **Clicking a day** opens a drawer listing that day's events. Remove and Edit are enabled only for private events.

## Not built yet
- The **entity pages** that the → buttons open: Comment Focus (alternative comparison with comments, 26:71694 / 26:69635) and Investment overview with the System Confidence sidebar (26:72160). They're specced in `command-figma-spec.md`.
- **Infinite scroll**, the **"Review ▾" split button** on the featured card (it only appears in the Archive frames), and the **email/auto-reminder logic** (26:70319).
- **Toasts:** they use the kit's position (top right) and timing, not Figma's bottom-centre placement.
