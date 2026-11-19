# Open questions

Answer these with the product designer, then move each answer into the right context file and log it in `decisions.md`.

1. **Cluster-level tolerance.** Figma shows "Tolerance 415" on the cluster risk-score bar, but tolerance is set per asset type. What should the cluster number mean? (For example, the sum of per-asset tolerances, a separate portfolio setting, or no marker at all.)
2. **Default tolerance per asset type.** The prototype uses bank 45, pad-mount 35, line 40, breaker 40 on a 0–100 scale. What are the real defaults, and can users edit them in the product?
3. **How lenses combine.** Should lens contributions be strictly additive (as described: "added up into a total"), or combine as probabilities? The prototype combines likelihood lenses as probabilities and multiplies consequence.
4. **What a lens is made of.** Is each lens one data source, or does it blend several? Can a lens affect both likelihood and consequence?
5. **Risk score scale.** What unit and scale does Catalyst use for a cluster's "Risk score" (Figma: 458 → 600)?
6. **Threshold year and at-risk assets.** Do the prototype's meanings match the product? (Threshold year = first year an asset crosses its tolerance; at-risk = assets over tolerance.)
7. **Recommended alternative.** How does Cooper actually choose it? Highest BCR, or based on the user's intent?
8. **Asset details panel.** It isn't in the Figma frames. Keep it, design it, or remove it?
9. **Square size of the area grid.** What resolution should it use in the product?
10. **Which Scenarios design is canonical?** Plan handover 85:162876 (5 scenario cards with Restrictions / Constraints / Investment groups) and "Send to Plan" 103:63527 (Cooper-derived constraints with 3 proposed scenario cards that recalculate) differ in steppers, buttons, names and numbers. The prototype uses the handover and borrows Send to Plan's cell editing, add and delete.
11. **Which Optimize Ready variant does Setup implement?** (J16 validation question: A hybrid / B agentic.)
12. **What does "Review individually" do?** It isn't drawn. The prototype filters the table to the inconsistencies.
13. **The routed fix for the Investment Owner:** what does their notification say, and where in Build do they land? (J16 lists this as not designed.) The prototype brings each fix back after 6 s.
14. **Do constraint edits recalculate anything on Setup?** Send to Plan shows scenario cards updating; the handover has no result cards. The prototype doesn't recalculate before Optimize.
15. **Two readiness numbers:** Figma shows "Ready to optimize 98%" (a KPI) next to "Optimization readiness 35%" (gates). The prototype keeps both: the share of investments without an open issue, and the share of gates passed. Is that the intent?
16. **Milestone dependencies across the portfolio** (J16 workflow step 3) aren't designed in Plan.
17. **"Start planning" label.** Figma only draws "Continue planning" (Setup already started). Is "Start planning" right for a cycle nobody has opened yet?
18. **Which scenario is the final plan by default on Compare?** Figma shows Baseline while optimizing and Max cost once results are in. The prototype preselects none.
19. **What does Cooper favour, and why?** The Compare frames disagree (evaluation heading vs body vs the Mid card's "balanced recommendation"). The prototype uses most value per dollar of CAPEX.
20. **Should the J03 + J06 tour use the Asset Manager?** J03 and J06 are the Asset Manager's (Priya) journeys; the tour uses the Investment Owner (Hollis Grant). J03's System Confidence and Save study, and J06's "sent to Build" toast and Idea Pad, aren't built yet.
21. **Where does an asset open from Global Search?** Figma says only "Opens in the owning area". The prototype opens Explore with the asset's details.
22. **Is data-quality reconciliation an Asset Manager job in Explore, an admin job in System Settings, or both?** (J02 validation question.)
23. **Which system is the record for corrections made in Explore?** (J02 validation question, PRD_Explore Q8.)
24. **Trace Report detail for "5 spans have no clearance data" and "Wildfire hazard is vendor-tier":** Figma has titles only. Confirm the prototype's wording and solutions.
25. **Investment status in search:** Figma shows workflow statuses (Draft / In review / Approved / Deferred). The demo data has only stages, so the prototype maps them (`logic/global-search.md`). What's the real source?
26. **Best match caption:** frame 2:21957 shows "BEST MATCH / OTHER MATCHES", the other parts only preselect the first row. The prototype shows "Best match" only for a unique exact match.
27. **"Filters cleared" when switching type:** inline line or Snackbar? The prototype uses the inline line.
28. **Which study opens with nothing selected** (J03 entry route E)? The prototype opens the whole-cluster study.
29. **How is a study's System Confidence % worked out,** and does resolving a question move it? The prototype: 96 − 6 per open question − 4 per open warning affecting the study's assets.
30. **What does a saved study keep** (population, lenses and sources, horizon year, notes?), and can you "Save as new"?
31. **Horizon end:** Figma's Study runs to 2045; the demo outlook data ends in 2036.
32. **Which three metrics does each recommendation show, and who decides?** (J05 validation question, dev note 29:357176.) The prototype always shows cost, risk reduced and failure likelihood.
33. **How do you dismiss a recommendation or say "not now"?** It isn't designed (J05 gap).
34. **What are "Other interventions" and where do "View in Study" and "View in Build" land?** They aren't designed. The prototype uses the investment's real alternatives, a study on its assets, and the Build idea.
35. **J07: Send for review or Send for approval?** The Duplicate flow's Shape frame says "Send for approval"; the others say "Send for review". The prototype uses "Send for review".
36. **J07: how does Cooper's context % grow?** Figma shows 0 / 20 / 55 % / READY only. The prototype's gains per input are `[Assumed]` (logic/build.md).
37. **J07: should an idea from Explore skip Input?** (J07 validation question.) The prototype's Explore → Build path lands on Shape directly.
38. **J07: Duplicate Investment** is designed (pick, name, Shape of the copy) but not built: the prototype's Shape page is for one idea. Build it when Shape can show any investment.
39. **J08: is "Option 2" (Send to plan separate from Compare) the chosen pattern?** (J08 validation question.) The prototype builds Option 2.
40. **J08: Add alternative** has no frame. The New button and the + show a "not designed yet" message.
41. **J08: ROI, payback, NPV and IRR** have no source in the demo data, so they show "—". Should the prototype compute them, and how?
42. **J08: cost stages.** The data has yearly spend only; stage names, shares and dates are `[Added]`. Which stages does a real Catalyst cost plan use?
43. **J09: Investment value "$" vs score.** Figma shows value in dollars ($23k, $2.05M per year); the demo data's value is a framework score. The prototype shows the score.
44. **J09: should the three-state triage (Cooper-answered / needs-you / you answered) be the standard for every questionnaire?** (J09 validation question.)
45. **J09: Widgets drawer** (add, hide, resize, reorder) isn't built; Widgets and the prompt chip generate the one scripted widget.
46. **J12: who owns Value?** No Figma file names a persona; the journeys say CX Consultant. The prototype adds an invented "Ines Calder, CX Consultant" (Command shows the Investment Owner's content for her).
47. **J12: where are objective weights edited?** No frame shows a weight control; the prototype only shows the total and fixes it through the Trace report (Rebalance).
48. **J13: Review numbers.** Figma's 1,621 re-scored / 519 lost / 12 shifts don't fit the 296 Demo Portfolio investments; the prototype computes them from its re-score rule. Should the Review show ranks and funding changes (as the journey says) or value changes (as the table shows)?
49. **J13: which Library state is "Scheduled"?** Figma has "Ready to publish" in the library and "Scheduled" on the approval page. The prototype shows Scheduled with the date.
50. **J14: does editing a model in an Active framework make the framework "Revisions Required", or only the model?** Not designed; the prototype makes a model draft only.
51. **Not built in Value:** Duplicate Framework, Built-by-Cooper walkthrough cursor, Create Value Framework / Value Model choosers, the formula builder and questionnaire editor, comments and collaboration on the map, version history, Strategic Alignment tab, Compare in Capital Flow.

