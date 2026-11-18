# Plan: Portfolio Manager user flow (Figma diagrams)

Source: Figma file `U7AUNbrWHYuX3E0O4GbfEx`. There are two swim-lane diagrams of the same journey:

- **77:36753** "Plan" (2157×2420), headed "PLAN: Portfolio Manager". It is the earlier version: compact lanes plus a "Designs" area of screen thumbnails below.
- **122:39936** "Portfolio Manager" (3975×1320), headed "Portfolio Manager: Plan". It is the end-to-end version, with screenshots in a strip above the lanes, laid out along the timeline.

Copy in "quotes" is exact; it comes from layer text and `get_design_context`. Card style (DS-looking): a 4px-radius card with an `elevation-3/tertiary` fill, a bold 14 px title and a regular 12 px body.
- Cooper cards have an **orange/brown** border.
- Portfolio / Investment Manager and stakeholder cards have a **blue/purple** border (`border/blue` #2b7fff on 122:39958).

Local screenshots: `/private/tmp/claude-503/cat/plan/flow1.png` (77:36753) and `/private/tmp/claude-503/cat/plan/flow2.png` (122:39936).

---

## 1. Persona job statement (both diagrams, verbatim)
"I want to turn hundreds of plan-ready investments into one optimized, defensible plan I actually understand — steering the constraints, scenarios, and trade-offs at every step — so I can get it approved and into execution, instead of waiting hours for a black-box optimization to fail or hand me a result I can't explain."

## 2. Stage headings and "I want to…" statements (verbatim)

| Stage heading | Statement(s) |
|---|---|
| "1 Setup" | "I want to make the investment set plan-ready — resolve issues, close gaps, and confirm each one before it enters a scenario — so I can keep problems from surfacing hours into an optimization." |
| (Setup, constraints; no own heading) | "I want to set realistic financial, resource, and risk constraints per scenario and know up front whether they'll run — so I can avoid launching a compute-heavy run that was never going to succeed." |
| "Compare" (rendered "3. Compare") | "I want to compare the optimized scenarios, weigh the trade-offs, and make the final manual adjustments — so I can choose the plan that best fits the organization." |
| (Optimize/results; no own heading) | "I want to run the optimization and see which investments were selected, deferred, or changed, and why — so I can understand the resulting portfolio instead of trusting a black box." |
| "Approve" (rendered "4. Approve") | "I want to submit the finalized plan through approval and turn the selected decisions into the active plan — so I can move confidently into execution with the reasoning attached." |

The statements are placed differently in the two diagrams:
- **77:36753:** both Setup statements sit under "1 Setup". Under "3. Compare" the *run optimization* statement comes first, then the *compare* statement.
- **122:39936:** the constraints statement sits on its own column (x 1378) between Setup and Compare. The *run optimization… which investments were selected, deferred, or changed* statement sits between Compare and Approve (x 2968), next to the results/investments screens.

In both, there is **no "2." heading**. Step 2 (scenarios and constraints, then run optimization) is implicit. See §6.

---

## 3. Lanes and cards: 77:36753 (PLAN: Portfolio Manager)

Lanes, top to bottom: **"Cooper"**, **"Portfolio Manager"** and **"Other Stakeholders"**, separated by dashed lines.

### Cooper lane
- **C1** 77:36788: **"Gets the portfolio ready"**. "Cooper runs across all the approved investments in the portfolio to prepare them for optimization by flagging any data quality issue, suggesting solutions, placing them in groups, and set up scenarios and their constraints."
- **C2** 87:36821: **"Checks optimization readiness"**. "Cooper continues to check and flag any problem that could cause optimization failure."
- **C3** 77:36773 (far right, Approve): **"System updates to reflect changes"**. "Once approved, plan is active and all investments are updated accordingly."

### Portfolio Manager lane
- **P1** 207:265: **"Enters the planning cycle"**. "Approved investments arrive for optimization. Some now belong to a program with multi-year bundles — how those enter a single cycle isn't defined."
- **P2** 77:36774: **"Reviews and resolves issues"**. "Reviews Cooper's grouping of investments and scenario set up. Addresses data issue that Cooper flags, then proceed to optimize when ready."
- **P3** 87:36817: **"Run optimization"**. "Once all issues are resolved, user runs optimization"
- **P4** 87:36825: **"Compare scenarios"**. "When optimization completes, results are shown, and user can compare results across different scenarios."
- **P5** 77:36778: **"Sends for approval"**. "Selects the final plan and submits for approval"
- **P6** 77:36779: **"Edits plan"**. "Checks approval statuses, fix things or re-run optimization if needed"

### Other Stakeholders lane
- **S1** 77:36775: **"Fixes the flagged investment"**. "The Investment Manager is notified about the flagged investment issue and fixes it."
- **S2** 77:36776: **"Reviews plan"**. "Stakeholders review plan to approve, comment, or reject"

### Arrows
| Arrow | From → to |
|---|---|
| 207:270 | C1 ↓ P1 (Cooper's prep feeds the cycle entry) |
| 77:36781 | C1 → P2 (curved) |
| 87:36820, 87:36826, 77:36787 | P1 → P2 → P3 → P4 → P5 (P4 → P5 is the long connector) |
| 87:36824 | C2 ↕ P2, two-way: Cooper keeps checking readiness while the PM resolves issues |
| 83:36816 | P2 ↕ S1, two-way: a flagged issue is routed to the Investment Manager, who fixes it and returns it to the PM |
| 77:36783 | P5 → S2 (curved down) |
| 77:36791 | P6 ↕ S2, two-way: edit / re-review loop |
| 77:36786 | S2 → C3 (curved up): approval activates the plan |

### "Designs" area (below the lanes)
These are screen thumbnails (image layers 208:274–208:285, "Screenshot 2026-09-08 at 11.30.46 AM 1–10"), arranged in columns under each stage. They are summarised from the thumbnails and are too small to read:
- **Setup column:**
  - Plan home (planning cycles, FY27 cycle KPIs, cycle progress, affected area map).
  - Setup page: a scatter chart plus an investments table with a right System confidence panel.
  - Setup with investment groups (a horizontal bar chart) and an issues list with a right panel.
  - Setup scenarios list (scenario rows with budget/constraint values).
- **Compare column:**
  - A full Scenario comparison scroll: scenario cards, value comparison, strategic objective radar, forecast by year, cumulative risk, annual risk.
  - The "Value measures and constraints" tab table.
  - The "Investments" tab table.
- **Approve column:**
  - Approval view: selected scenario summary, charts and a Gantt-like timeline.
  - Approval with a comments panel.
  - Plan home with cycle progress further along.

---

## 4. Lanes and cards: 122:39936 (Portfolio Manager: Plan, end to end)

Lanes: **"Cooper"**, **"Investment Manager"** (the middle lane label was renamed from "Portfolio Manager"; the layer text is "InvestmentManager") and **"Other Stakeholders"**.

The screenshot strip above the lanes has 9 images (127:67393–127:67401, "Screenshot 2026-08-19 at 1.40.07 PM" … "1.47.42 PM"). In order, it shows:
1. Plan home
2. Setup scatter + investments
3. Setup groups / issues
4. Setup scenario/constraint detail
5. Scenario comparison with progress
6. Scenario comparison (value comparison)
7. Scenario comparison with the investments table
8. Results / investments table
9. Approval with comments

### Cooper lane
- 122:39968: **"Gets the portfolio ready"**. Same body as C1 above.
- 122:39969: **"Checks optimization readiness"**. Same body as C2.
- 122:39954: **"System updates to reflect changes"**. Same body as C3.

### Middle lane ("Investment Manager" label)
- 122:39955: **"Reviews and resolves issues"**. Same body as P2.
- 122:39956: **"Run optimization"**. "Once all issues are resolved, user runs optimization"
- 122:39957: **"Compare scenarios"**. Same body as P4.
- 122:39960: **"Sends for approval"**. "Selects the final plan and submits for approval"
- 122:39961: **"Edits plan"**. Same body as P6.
- **"Enters the planning cycle" is not in this version.** Cooper's C1 feeds "Reviews and resolves issues" directly (Arrow 34, 122:39962).

### Other Stakeholders lane
- 122:39958: **"Investment Manager"**. "Gets notified about the investment issue and fix it."
- 122:39959: **"Reviews plan"**. "Stakeholders review plan to approve, comment, or reject"

### Arrows
| Arrow | From → to |
|---|---|
| 122:39962 | Gets the portfolio ready → Reviews and resolves issues |
| 122:39971 | Checks optimization readiness ↕ Reviews and resolves issues |
| 122:39970 | Reviews and resolves issues ↕ Investment Manager (fix loop) |
| 122:39966 | Reviews and resolves issues → Run optimization (long, spans the constraints column) |
| 122:39967 | Run optimization → Compare scenarios |
| 122:39965 | Compare scenarios → Sends for approval (long, spans the results column) |
| 122:39963 | Sends for approval → Reviews plan |
| 122:39972 | Edits plan ↕ Reviews plan |
| 122:39964 | Reviews plan → System updates to reflect changes |

---

## 5. The journey in plain steps (merged reading of both diagrams)

1. **Setup: Cooper prepares the portfolio.** Cooper sweeps all approved investments in the portfolio. It flags data-quality issues, suggests fixes, groups the investments, and sets up scenarios and their constraints.
2. **Setup: the manager enters the cycle.** Approved investments arrive for optimization. This step is only in the earlier diagram, which carries an open question: "Some now belong to a program with multi-year bundles — how those enter a single cycle isn't defined."
3. **Setup: the manager reviews and resolves.** The manager reviews Cooper's grouping and scenario setup and addresses the data issues Cooper flags. Meanwhile Cooper **keeps checking optimization readiness** and flags anything that could make the run fail (two-way).
4. **Fix routing.** A flagged investment issue is **routed to the Investment Manager / Investment Owner (Other Stakeholders lane), who is notified and fixes the investment**. The fixed investment then flows back to the review step (two-way arrow). The diagrams don't name the stage where the fix happens. Per the product journey (Command → Explore → **Build**), the owner fixes it in Build.
5. **Scenarios and constraints.** The manager sets realistic financial, resource and risk constraints per scenario and knows up front whether they'll run (the constraints statement).
6. **Optimize.** Once all issues are resolved, the manager runs optimization. The screens show this as the "Optimizing…" badge and progress, covered in `context/screens/plan-home-figma-spec.md`.
7. **Compare.** When optimization completes, the results show which investments were selected, deferred or changed, and why. The manager compares the scenarios, weighs the trade-offs, makes final manual adjustments, and selects the final plan.
8. **Approve.** The manager sends it for approval. Stakeholders review the plan and approve, comment or reject. The manager checks approval statuses, fixes things or re-runs optimization if needed (Edits plan ↔ Reviews plan loop).
9. **Activate.** Once approved, the system updates: the plan becomes active and all investments are updated accordingly (Cooper lane).

---

## 6. Ambiguities
1. **Lane naming:**
   - The middle lane is "Portfolio Manager" in 77:36753 but "Investment Manager" in 122:39936, even though the persona is the Portfolio Manager in both titles.
   - In 122:39936, "Investment Manager" is *also* the title of the stakeholder card that fixes the issue. So the label names both the planner lane and the fixer.
   - The brief calls the fixer the "Investment Owner". The diagrams never use "Investment Owner".
2. **Stage numbering:** "1 Setup", "3. Compare" and "4. Approve" are present, but there is no "2". Scenarios/constraints and Optimize are unlabelled.
3. **Where the fix happens:** both diagrams say only that the person is notified and fixes it. "Fixes it in Build" is inferred, not stated.
4. **"Enters the planning cycle"** (with its multi-year bundles question) was dropped from the end-to-end version.
5. **Grammar is as in the source:** "and set up scenarios", "then proceed to optimize", "fix things", "fix it".
