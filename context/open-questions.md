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

