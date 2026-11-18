# Glossary

| Term | Meaning | Source |
|---|---|---|
| **Asset** | A piece of network equipment: substation, transformer, feeder (line), recloser, span… | `[Figma]` |
| **Cluster** | A group of related assets studied together (e.g. Alpine Meadows cluster, served by Demeter SS). | `[Figma]` |
| **Risk** | **Likelihood of failure × consequence of failure.** | `[Confirmed]` |
| **Likelihood of failure (LoF)** | How likely the asset is to fail. In the base condition it comes from the asset itself (age against design life). | `[Confirmed]` |
| **Consequence of failure (CoF)** | How bad a failure would be (customers affected, critical loads, cost). | `[Confirmed]` |
| **Base condition** | Risk from the asset alone, with no external influences. | `[Confirmed]` |
| **Lens** | An external data source that changes risk, e.g. Flood, Extreme Heat, Critical Habitat, Oil Containment, or a custom lens such as EV load growth. A lens can raise likelihood, consequence, or both. | `[Confirmed]` |
| **Custom lens** | A lens the user adds through Cooper (a what-if). | `[Figma]` |
| **Aggregation** | Adding up the base condition and every active lens into one total risk. The map always shows that total. | `[Confirmed]` |
| **Area risk / risk grid** | Risk belongs to the *area*: the map is covered in small squares, each coloured by its total risk (green = low → red = high). | `[Confirmed]` |
| **Horizon** | The time span of the study. The default is **10 years from the current year**, and it can be played through year by year. | `[Confirmed]` |
| **Tolerance** | The company's **intervention threshold**: the risk level at which it wants to act. It is *not* the failure point. Each company customises it, and it varies by asset type. The default is around the start of "high" risk. Crossing it should notify the user. | `[Confirmed]` |
| **Threshold year** | The first year in the horizon when an asset crosses its tolerance. | `[Assumed]` meaning, `[Figma]` label |
| **At-risk assets** | Assets over their tolerance in the selected year (n of N). | `[Assumed]` meaning, `[Figma]` label |
| **Study** | A saved analysis of an area or asset set with chosen lenses (e.g. "Alpine Meadows Study"). | `[Figma]` |
| **Idea** | An investment proposal at its early "Shaping" stage in Build. It becomes an *investment* after review. | `[Figma]` |
| **Alternative** | One way to address the need (e.g. Targeted Hardening, Full Replacement, Reactive Repair). One is recommended. | `[Figma]` |
| **BCR** | Benefit–cost ratio of an alternative (value ÷ cost). | `[Figma]` |
| **Non-DS** | Prototype parts not built from the IFS design system kit; flagged in the UI. | Convention |
