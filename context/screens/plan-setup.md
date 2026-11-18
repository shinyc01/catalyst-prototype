# Screen: Plan › Setup (Data readiness · Planning groups · Scenarios) and Plan home

**Figma:** Plan handover `Dv3HzkcFTTrb4E34zLF7cy`: Setup — Data readiness **85:157926**, Planning groups **85:158979**, Scenarios **85:162876**, Optimizing entry **85:83781**. Constraint editing follows "Send to Plan" `U7AUNbrWHYuX3E0O4GbfEx` **103:63527**. Full frame specs: `plan-setup-figma-spec.md`, `plan-scenarios-figma-spec.md`, `plan-home-figma-spec.md`. Code: `app/screens/plan.jsx`.

## Setup `[Figma]`
- **PageHeader:** back · "Demo Portfolio" ▾ · ● Planning | Stepper Setup / Compare / Approve | 3/5 · comment · **Optimize** (disabled until readiness is 100% and no routed fix is outstanding; tooltip says why).
- **Title "Setup" + Tabs:** Data readiness · Planning groups · Scenarios (count). "New scenario" sits on the tabs row on Scenarios.
- **Right: System confidence** (DS Panel + ConfidenceGates "Optimization readiness" + IssueKindSwitch + IssueNavigator). Collapses to the 48 px rail with the status dot.
- **BottomSheet:** Cooper's context (16 documents, upload) + prompts ("Explain why these are outliers", "Summarize data readiness"; on the other tabs "Compare to peer", "Compare to best practice").

### Data readiness
1. **StatCardsRow:** With inconsistency (open / investments in the plan) · Outliers (/ 296) · Cost at risk (CAPEX of open issues) · Ready to optimize (%).
2. **ScatterChart "Outlier investments":** forecast cost ($M) vs forecast value (K), outliers in the alert colour, dashed median cost and median value lines. Investments over $100M or value 300K aren't drawn (2 of them), so the rest isn't squashed.
3. **Investments card:** SegmentedControl All / With inconsistency / Outliers (counters) · SmartSearch (filters by name or code) · Table: Investments (name, code, status icon) · Inconsistency (badge) · Solution (Fix with Cooper / Leave out from this plan / Send to <owner>, then a result badge) · Cost · Value · Schedule (start month). Open issues sort first; 8 rows, then Show more.

### Planning groups
BarChart of investments per planning group, and Investment groups (group list + table). The gate passes; nothing to resolve.

### Scenarios
Five collapsible scenario cards (name, description, Budget · Resources · Enterprise goal, Cooper button). Expanded:
- **Restrictions:** 5 stat tiles (derived from the switches and groups, so they never contradict them) and 3 switches.
- **Constraints:** Cost / Resource hours / Strategic filter, table with Constraint · Type · Unit · 2028–2032 min/max. Click a cell to edit (Enter saves, Esc cancels), the bin deletes (Undo in the toast), and the Cooper bar adds a constraint the portfolio defines ("Field crew hours under 12,000 a year").
- **Investment groups:** checkboxes decide which groups the optimizer may change.

## The run `[Figma]` + `[Assumed]`
- NavBar badge "Optimizing..." (spinning ring) in every section while it runs; click it to see progress.
- Snackbar "Optimizing 5 scenarios" with elapsed / remaining, ProgressBar and %. **Show progress** opens the steps: Checking readiness before spending compute (with its sub-steps) → Solving → Validating.
- When it finishes, the badge goes, a toast says so, and a notification ("View results") lands in the bell.

## Plan home `[Figma]`, partly built
SideNavTree (Alder Ridge Energy › Demo Portfolio › North / South), owner, Planning cycles (2025 Plan, 2028 Plan), "2028 Plan cycle" + Compare results (on once results are in), KPIs, Cycle progress (Setup · Compare "Scenarios optimized n%" · Approve), Yearly forecast vs budget (CAPEX / OPEX / Total Investment Cost vs the max), Aggregate risk (requested vs optimized vs cap).
**Not built yet:** the Affected area map and Value contribution by measure (no per-measure data for this set), and Scenario library.

## Non-DS parts
None new. Everything above is DS 2.0. The run's Snackbar holds a ProgressBar and the steps card holds a Timeline (both DS).
