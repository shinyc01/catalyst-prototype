# Screen: Build: Idea overview (Shape)

**Figma:** Build handover `BmOuH8YCHltiitqwNW2ARt`, frame **43:65022**, "Idea overview / Investment owner review". **This frame is the spec.** The earlier frame 43:62694 shows only the top half.

## Layout, top to bottom `[Figma]`
Every section is a **ContentCard** with an UPPERCASE grey title on the left and a round **Cooper icon button** on the right.

1. **PageHeader:** back · title (truncated) · ID · ▾ · ● Shaping | Stepper: Shape / Review / Refine / Approve | 3/5 collaborators · comment · Dismiss · **Send for review**.
2. **IDEA OVERVIEW:** idea title and a one-line description.
3. **Two-column row:**
   - **Left:** THE NEED (editable text) · ALIGNED ENTERPRISE GOALS (badges) · STRATEGIC RELEVANCE (stacked bar 40/35/13/7/5 with legend Reliability / Financial / Environment / Social / Governance).
   - **Right:** AFFECTED ASSETS & AREA, a tall map with a map icon button at top-right.
4. **RECOMMENDED ALTERNATIVE** (full width):
   - an inner card with the name, description and 4 stats (BCR, Cost range, Timing, Potential value);
   - then the **OTHER OPTIONS** sub-heading, with two cards side by side (name, large cost, small timing).
5. **COMPARE TO OTHER INVESTMENTS** (full width):
   - "PORTFOLIO LEVEL ▾" dropdown in the header;
   - a row of 4 stats with dividers (Rate #n of 35 · Percentile · Standing · Alternative);
   - an **INVESTMENT POSITION** chart card with a "Value vs Cost | Efficiency" toggle (histogram, this idea's bin in purple);
   - two columns: WHY THIS INVESTMENT MATTERS (text) | SIMILAR INVESTMENTS BY BCR (5 rows, this idea highlighted).
6. **Right rail:** the collapsed sidebar (48 px).
7. **BottomSheet:** Cooper's context (16 documents, upload) and prompts.

## Logic
See `logic/investments.md`. The need, the affected-assets map and "why this matters" use the study results.

## Data `[Whistler]` + `[Added]`
- **The idea** is investment 8380, Pad-Mount Transformer Replacement Program V2 (DIST000246), with its real description.
- **Alternatives** are its 3 real alternatives (spend, years, value). The recommended one follows Cooper's first answer.
- **BCR** is `[Added]`: value per $M ÷ 2,000.
- **Strategic relevance** is the recommended alternative's real value by measure, grouped into the Figma categories.
- **Compare** ranks against the other 42 Whistler investments that have spend and value.

## Known mismatches
- The histogram has no y-axis or gridlines.
- The histogram and list rows are non-DS.
- "Efficiency" shows the value score, because Whistler has no separate efficiency measure.
