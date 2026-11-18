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
