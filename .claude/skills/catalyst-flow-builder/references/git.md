# Git, safely — for two non-developers working in parallel

The users never run git. You run `scripts/sync.sh`, which wraps every git step with safeguards. Read its header once.

## The model, in words you can say to the user
- **The shared version** (`main`) is what's live on the website. Nobody edits it directly.
- Each flow gets a **private workspace** (a branch called `flow/<name>`). Saving uploads the workspace to GitHub, but doesn't change the shared version.
- **Publishing** brings the workspace up to date with the latest shared version, runs the checks, and merges it in through a pull request. The site updates about a minute later.

## Commands
| When | Run | Exit codes that stop it |
|---|---|---|
| Start of every session | `bash scripts/sync.sh status` | – |
| Before building a flow | `bash scripts/sync.sh start <flow-name>` | 3 = a conflict is in progress · 5 = unsaved work · 6 = local main differs from GitHub |
| After meaningful progress, and before stopping | `bash scripts/sync.sh save "<what changed>"` | 4 = checks failed · 5 = you're on main · 7 = upload refused |
| Someone else published while you worked | `bash scripts/sync.sh update` | 3 = conflict |
| Done | `bash scripts/sync.sh finish "Flow: <title>"` | 3 conflict · 4 checks · 8 merge refused |

## Never
- Commit to or push `main` directly; `git push --force` (use only what the script does: `--force-with-lease` on your own branch).
- `git reset --hard`, `git checkout -- .`, `git clean`, `git stash drop`, deleting branches that aren't yours, or anything else that discards work. If you think you need one, stop and ask the user.
- Bypass the checks, skip `update` before `finish`, or merge a pull request with failing checks.
- Edit someone else's open branch.

## Resolving a conflict (exit 3)
A conflict means you and someone else changed the same lines since you started. Resolve **every** conflicted file so that **both people's work survives**:
1. `git diff --name-only --diff-filter=U` lists the files. For each, read both sides (`<<<<<<<` yours / `>>>>>>>` theirs) and the history (`git log origin/main -3 -- <file>`) to understand what the other person changed.
2. By file type:
   - `app/flows/index.js` → don't merge by hand: run `python3 -I scripts/manifest.py`.
   - `shared/whistler-data.js` → don't merge by hand: take theirs (`git checkout --theirs …`), then re-run `python3 -I scripts/make-whistler-data.py` so it includes both sets of IDs (merge the two ID lists in the script itself first).
   - `index.html` script lists → keep every `<script>` from both sides, in a valid load order.
   - Screen / data / context files → merge by meaning: keep both additions; if you both changed the same behaviour differently, keep theirs as the shared version and re-apply yours on top only if it doesn't undo theirs. If you can't tell, **stop and ask the user**, showing both versions in plain words.
   - `context/decisions.md` → keep every line from both sides, newest first.
3. Remove all conflict markers, `git add` the files, run `node scripts/check.mjs`, then `bash scripts/sync.sh update` to continue. Repeat until it reports success.
4. Re-test the screens both of you touched in the browser before `finish`.
5. Tell the user in one line what overlapped and how you combined it.

## First time on a computer (Mahsa's first run)
1. Run `bash scripts/sync.sh setup` from the repo if it's present; if the repo isn't on the computer yet:
   - Check that `git` exists (`xcode-select --install` if not; the user clicks Install), and that `gh` exists (if not, ask the user to install the macOS package from https://cli.github.com, or use `brew install gh` if Homebrew is there). `node` is needed for the checks (https://nodejs.org LTS).
   - The user must log in themselves: ask them to run `gh auth login` in Terminal (GitHub.com → HTTPS → log in with a web browser). Never handle their password or token.
   - Clone: `gh repo clone shinyc01/catalyst-prototype ~/Documents/catalyst-prototype`, then move the session there (`change_directory`).
2. Run `bash scripts/sync.sh setup` and confirm it prints "Ready".
3. If the user's GitHub account isn't a collaborator yet (`gh api repos/shinyc01/catalyst-prototype/collaborators/<login>` fails), tell them to accept the invitation email from GitHub, or ask Shiny to invite them.
