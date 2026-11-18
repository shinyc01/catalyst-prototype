# The mock data layer

The goal: the whole app behaves like one real system, so every investment, asset, portfolio, person and number agrees across every screen, and a user could not catch a discrepancy.

## Layers (load order in index.html)
1. `shared/whistler-data.js` holds the **real** records from the `copperleaf-demo-data` skill (Whistler Group, CLTDEMO). It is **generated**: edit `scripts/make-whistler-data.py` and re-run it, never the file itself.
2. `shared/names.js` holds the **invented names**. People, the company (Alder Ridge Energy) and the made-up station names are replaced once, at load. New people or places from the demo data must be added to its maps; `scripts/check.mjs` fails if a real demo person's name leaks.
3. `shared/whistler-additions.js` holds everything the demo data lacks: geography, the cluster, per-kind tolerance and sensitivity, the personas, the BCR rule. Each item is tagged `[Added]`.
4. `shared/catalyst-model.js` is the risk logic (explained in `context/logic/risk.md`).
5. `shared/<screen>-content.js` files (for example `whistler-command.js`) hold per-screen content that is derived from the layers above, with `[Added]` items only where needed.

## Rules
- **Pull before you invent.** Look for the record first with `python3 ~/.claude/skills/copperleaf-demo-data/scripts/demo_data.py views` and its views. Add the IDs to the generator, then re-run it.
- **Invent consistently.** An `[Added]` record must link to real ones: an existing investment ID, portfolio, person, or asset. Give it a stable ID, put it in the additions or a domain file (never in a screen), and note it in `context/data/whistler.md`.
- **Compute, don't type.** Totals, counts, percentages, CPV, V/C, health index, risk and similar values are always computed from the records. If a screen needs a number the data can't produce, add the input data, not the number.
- **One record, one truth.** The same investment shows the same name, cost and value on every screen. Reuse the helpers (`invById`, `cpvOf`, `fmtMoney`, …) rather than writing your own.
- **The Demo Portfolio scenarios** (`WHISTLER_SCENARIOS`) are a separate set from the 45 curated investments. Don't mix them on one screen without saying so.
- **When state changes,** for example when the user creates an idea, it should appear wherever it belongs: in Command, Build, and lists. Use `usePersisted` keys that the other screens read.
- **Extend the checks.** For each new kind of record, add the link and sanity checks to `scripts/check.mjs` (links resolve, numbers in range, no NaN).
