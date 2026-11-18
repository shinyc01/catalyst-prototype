# Reading a journey document (the mini-flow format)

Mahsa's mini flows are **JTBD journey documents**: Word files named like `J16 - Portfolio Owner - Constraint Definition and Pre-Optimization Validation.docx`, made with the catalyst-journey-mapper method (one persona, one trigger, one completed outcome). J16 was the first one built (`context/flows/plan-constraint-readiness.md`); every other journey follows the same format.

## 1. Read it
`python3 -I scripts/read-journey.py "<path>.docx"`. This prints every link first (the Figma frames are hyperlinks in the document), then the text, with table rows joined by ` | `. If the user pastes the text instead of a file, the links may be missing: ask for them only if no Figma node ids appear.

## 2. What each section means, and where it goes

| Section in the document | What to do with it |
|---|---|
| Title `J<n> · <name>`, persona, phase, journey status | The flow title is **`J<n> · <Stage> · <name>`**. The persona maps to `PERSONAS` (Portfolio Owner → `portfolio`, Owen Fitch; Investment Owner → `owner`, Hollis Grant; Asset Manager → `asset`, Mara Delgado). Any named person in the use case ("Dana") becomes the invented persona; say so in the hand-over. |
| Job to be done, Agentic re-frame | The flow's `summary`, and the opening tour step. |
| Trigger, Starting context | The tour's first step and its `hash`. The **entry point must exist in the app** (the button on the screen before). Build it if it doesn't. |
| Completed outcome, Definition of done | The tour's last step. Check the app really reaches this state. |
| Product areas involved | Which screens and stages the flow touches; reuse existing screens. |
| Use case (for design and testing) | The story the tour tells. Its names and numbers are examples: map them to real records from `shared/` (never copy a Figma placeholder number). |
| **Journey steps** table: # · Where · User goal · User action · System response · **Evidence** · References | One tour step or more per row. The **Evidence** column decides how faithful to be: **Designed** = the Figma frame in References is the spec; **Specified** = described in a PRD but not drawn: build it with DS parts and tag it `[Assumed]`; **Inferred** = connective step: build the simplest version; **Missing / conflicted** = ask the user (one list, all at once) before building. |
| Alternatives and exception paths | Build the ones that are Designed; list the rest as open questions. |
| Design gaps, conflicts and blockers | Copy into `context/open-questions.md` (numbered), and mention them in the hand-over. Don't silently design around them. |
| Validation questions | Copy into `context/open-questions.md`. |
| Sources cited | The flow's `sources` (Figma links and the journey file). |

## 3. Keep the original
Save the whole text verbatim under **"Source mini flow (verbatim)"** at the end of `context/flows/<id>.md`, with the links at the top of the file. Never edit Mahsa's wording; put interpretations in the sections above it.

## 4. Connect the flow
A journey covers one slice of a cycle. Also build the way in (the entry point) and the way out (what the last step leads to, at least a working button and the next state), so a tester can reach the flow from the app's normal navigation. Record anything beyond the journey's scope as "built at summary level" in the flow file.
