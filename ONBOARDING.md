# Welcome to the Catalyst prototype, Mahsa

This is the working prototype of **Catalyst** (IFS Copperleaf) that Shiny and you build together, one journey at a time. It's for usability tests, demos and marketing. It's built with **Catalyst Design System 2.0** on one shared set of demo data (Alder Ridge Energy).

**You don't need to code or use git.** Claude Code does the building, testing and publishing. You describe what you want, review the result, and decide.

- **Live prototype:** https://shinyc01.github.io/catalyst-prototype/
- **Repo:** https://github.com/shinyc01/catalyst-prototype (you're already a collaborator as `mkarimi727`)

---

## 1. Set up (once, about 10 minutes)

Open this guide in Claude Code on your Mac and say **"Set me up for the Catalyst prototype."** Claude will:
1. check that git, the GitHub command line tool (`gh`) and Node.js are installed, and help you install anything missing;
2. ask **you** to log in to GitHub once in your browser (Claude never handles your password);
3. download the repo to `~/Documents/catalyst-prototype`;
4. install the **catalyst-flow-builder** skill on your computer, so every future Claude Code session knows how to work on the prototype.

> **For Claude, doing the setup:** follow "First time on a computer" in `.claude/skills/catalyst-flow-builder/LOADER-for-new-computers.md`. Clone with `gh repo clone shinyc01/catalyst-prototype ~/Documents/catalyst-prototype`. Then install the loader by copying that file to `~/.claude/skills/catalyst-flow-builder/SKILL.md`. Finish with `bash scripts/sync.sh setup` and `node scripts/check.mjs`, and open the live site in the browser pane.

After that, always open the **`catalyst-prototype` folder** in Claude Code when you work on it.

## 2. Look around

- Click the **gear** in the top bar for **Prototype settings**:
  - **Signed in as:** switch persona (Investment Owner Hollis Grant, Asset Manager Mara Delgado, Portfolio Owner Owen Fitch).
  - **Guided tours:** one per journey built so far. A tour moves you to the right screen, highlights what to click, and scrolls it into view.
  - **Show non-DS parts:** outlines anything that isn't in the design system yet.
  - **Reset demo:** undoes everything you clicked or changed in this browser.
- Two tours so far:
  - **Command → Explore → Build** (Investment Owner)
  - **J16 · Plan · Constraints and readiness before optimizing** (Portfolio Owner). It starts on Plan home with *Start planning*.

## 3. What you can ask Claude to do

Say it in your own words. These are examples.

| You want to… | Say something like |
|---|---|
| **Add a journey** | "Add this flow to the prototype" + attach `J17 - … .docx` (or paste its path). Same format as J16: Claude reads the journey steps, follows the Figma links inside, builds the screens, data and tour, and publishes. The flow keeps its J-number. |
| **Understand something** | "How is Optimization readiness worked out?" · "Why does it say 48 inconsistencies?" · "What's assumed on Compare?" Claude answers in plain language with the real numbers, says where each fact comes from, and gives you the link to see it. |
| **Change something** | "Rename Optimize to Run optimization" · "Outliers should be 2 standard deviations off" · "Make the run take 10 seconds". Claude changes it everywhere it's used, keeps the tours working, logs the decision with your name, and publishes. |
| **Decide an open question** | "Answer open question 10: use the Plan handover design." Claude records the decision, updates the prototype if needed, and removes the question. |
| **Review** | "Review the prototype and tell me what looks off." Claude walks every screen and tour and reports back before changing anything. |
| **Publish / sync** | Usually automatic. You can also say "publish my changes" or "get the latest version". |

If a request contradicts a Figma frame or something already decided, Claude tells you which one and asks before going ahead.

## 4. Where the knowledge lives

Everything Claude knows about the product is in the **`context/`** folder, and it's kept up to date with every change. **`context/README.md`** is the map: each screen with its flow, logic, data, Figma frame and open questions. You can read it on GitHub, or just ask Claude.

- `context/open-questions.md`: what still needs a design or product answer (19 so far, most of them from J16).
- `context/decisions.md`: what's settled, who decided it, and why.

Facts are tagged by source: `[Whistler]` real demo data, `[Figma]`, `[Confirmed]` designer decision, `[Assumed]` Claude's guess (needs confirming), `[Added]` filled-in data.

## 5. Rules worth knowing
- **The Figma frame is the spec.** The logic only changes the values shown, never the layout or labels.
- **Design System 2.0 only.** Anything not in the kit is flagged as "Not in DS".
- **One data layer.** Numbers come from the real demo records or documented rules, never typed into a screen. People and the company use invented names, because the repo is public.
- **Working in parallel is safe.** Each change goes through its own workspace, automatic checks and a pull request. If you and Shiny touch the same thing, Claude keeps both people's work and asks if it can't tell which should win.

## 6. If something goes wrong
- Say what you see ("the tour is stuck", "the page is blank") and Claude will investigate.
- Any change can be undone, because every change is saved on GitHub.
- For repo access or anything about the product, ask Shiny.
