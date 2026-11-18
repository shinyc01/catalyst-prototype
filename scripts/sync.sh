#!/bin/bash
# Safe git for people who don't use git. The catalyst-flow-builder skill runs these; you never need to.
#
#   bash scripts/sync.sh setup                 first time on a computer: checks git + GitHub login, sets your name
#   bash scripts/sync.sh status                where am I, is anything unsaved, is my copy behind the shared version
#   bash scripts/sync.sh start <flow-name>     get the latest shared version, then open a private workspace (branch) for one flow
#   bash scripts/sync.sh save "<what changed>" check + save work to your workspace on GitHub (never touches the shared version)
#   bash scripts/sync.sh update                bring the latest shared changes into your workspace (stops on a conflict)
#   bash scripts/sync.sh finish "<title>"      update, check, publish: open a pull request and merge it into the shared version
#   bash scripts/sync.sh home                  go back to the latest shared version (only when nothing is unsaved)
#
# Safeguards (never weakened):
#   * nobody works on main directly: every change goes branch → pull request → checks → merge
#   * always starts from, and re-syncs with, the latest main before publishing
#   * never force-pushes main, never `reset --hard`, never deletes anyone's branch, never discards unsaved work
#   * the only force-push is --force-with-lease on YOUR OWN flow branch after a rebase (it refuses if someone else pushed to it)
#   * merges only when the checks pass; conflicts stop the script (exit 3) so they can be resolved deliberately
set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || dirname "$0")"
MAIN=main
say() { printf '%s\n' "$*"; }
die() { printf 'STOP: %s\n' "$*" >&2; exit "${2:-1}"; }
branch() { git rev-parse --abbrev-ref HEAD; }
dirty() { [ -n "$(git status --porcelain)" ]; }
checks() {
  python3 -I scripts/manifest.py >/dev/null || die "could not regenerate the flow list"
  node scripts/check.mjs || die "checks failed — fix the problems listed above before saving" 4
}
in_rebase() { [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; }

cmd="${1:-status}"; shift || true
case "$cmd" in
setup)
  command -v git >/dev/null || die "git is missing. Run: xcode-select --install   (then run setup again)"
  command -v gh  >/dev/null || die "GitHub CLI is missing. Install it from https://cli.github.com (download the macOS .pkg), then run setup again"
  command -v node >/dev/null || die "Node.js is missing (needed for the checks). Install the LTS version from https://nodejs.org, then run setup again"
  gh auth status >/dev/null 2>&1 || die "not logged in to GitHub. In Terminal run:  gh auth login   (choose GitHub.com → HTTPS → Login with a web browser), then run setup again" 2
  gh auth setup-git >/dev/null 2>&1 || true
  LOGIN=$(gh api user --jq .login); NAME=$(gh api user --jq '.name // .login')
  [ -n "$(git config user.name)" ] || git config user.name "$NAME"
  [ -n "$(git config user.email)" ] || git config user.email "$(gh api user --jq .id)+${LOGIN}@users.noreply.github.com"
  git config pull.rebase true; git config rebase.autoStash false; git config push.autoSetupRemote true
  say "Ready: GitHub user $LOGIN, git name $(git config user.name)." ;;

status)
  git fetch -q origin 2>/dev/null || say "(offline: showing the last known state)"
  B=$(branch); say "Workspace: $B"
  in_rebase && say "A conflict is being resolved (rebase in progress)."
  dirty && { say "Unsaved changes:"; git status --short; } || say "No unsaved changes."
  if git rev-parse -q --verify "origin/$MAIN" >/dev/null; then
    behind=$(git rev-list --count "HEAD..origin/$MAIN"); ahead=$(git rev-list --count "origin/$MAIN..HEAD")
    say "Compared with the shared version: $ahead change(s) of yours not shared yet, $behind new shared change(s) not in your workspace."
  fi
  say "Open pull requests:"; gh pr list --state open --json number,title,author,headRefName --jq '.[] | "  #\(.number) \(.title) — \(.author.login) (\(.headRefName))"' 2>/dev/null || true ;;

start)
  SLUG=$(printf '%s' "${1:-flow}" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g')
  in_rebase && die "a conflict is still being resolved — finish that first (bash scripts/sync.sh update)" 3
  B=$(branch)
  if dirty; then
    if [ "$B" = "$MAIN" ]; then
      # Unsaved edits made straight on the shared version: carry them into a new workspace (nothing is discarded),
      # save them there, then bring that workspace up to date with the latest shared version.
      NEW="flow/$SLUG"
      git rev-parse -q --verify "$NEW" >/dev/null && die "a workspace $NEW already exists — pick another flow name" 5
      git switch -q -c "$NEW" || die "couldn't open a workspace for the unsaved changes — nothing was changed" 5
      git add -A && git commit -q -m "Work in progress: $SLUG" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
      say "Moved the unsaved changes into a new workspace $NEW."
      exec bash "$0" update
    fi
    die "your workspace '$B' has unsaved changes — save them first: bash scripts/sync.sh save \"…\"" 5
  fi
  git fetch -q origin || die "can't reach GitHub — check the internet connection"
  git switch -q "$MAIN" && git merge -q --ff-only "origin/$MAIN" || die "your copy of main has changes that aren't on GitHub — ask for help, nothing was changed" 6
  NEW="flow/$SLUG"
  if git rev-parse -q --verify "$NEW" >/dev/null || git rev-parse -q --verify "origin/$NEW" >/dev/null; then
    git switch -q "$NEW" 2>/dev/null || git switch -q -c "$NEW" --track "origin/$NEW"
    say "Continuing your workspace $NEW."; exec bash "$0" update
  fi
  git switch -q -c "$NEW" && say "New workspace $NEW, starting from the latest shared version ($(git log -1 --format=%h origin/$MAIN))." ;;

save)
  MSG="${1:-Work in progress}"; B=$(branch)
  [ "$B" = "$MAIN" ] && die "you're on the shared version — start a flow workspace first: bash scripts/sync.sh start <flow-name>" 5
  in_rebase && die "a conflict is being resolved — finish it before saving (see: bash scripts/sync.sh update)" 3
  checks
  git add -A
  git diff --cached --quiet && say "Nothing new to save." || git commit -q -m "$MSG" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
  git push -q -u origin "$B" 2>/dev/null || git push -q --force-with-lease -u origin "$B" || die "couldn't upload your workspace — someone else changed it; run update" 7
  say "Saved to your workspace $B on GitHub (the shared version is unchanged)." ;;

update)
  B=$(branch); [ "$B" = "$MAIN" ] && { git fetch -q origin && git merge -q --ff-only "origin/$MAIN" && say "Shared version is up to date."; exit 0; }
  if in_rebase; then
    [ -n "$(git diff --name-only --diff-filter=U)" ] && die "still unresolved: $(git diff --name-only --diff-filter=U | tr '\n' ' ')" 3
    git add -A; GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || true
  else
    dirty && die "save your changes first: bash scripts/sync.sh save \"…\"" 5
    git fetch -q origin || die "can't reach GitHub"
    if ! git rebase -q "origin/$MAIN" >/dev/null 2>&1; then
      say "CONFLICT: you and someone else changed the same lines. Files to resolve:"; git diff --name-only --diff-filter=U | sed 's/^/  /'
      say "Resolve each file keeping BOTH people's work, then run: bash scripts/sync.sh update   (or 'git rebase --abort' to undo the update)."
      exit 3
    fi
  fi
  in_rebase && { say "More conflicts in the next change:"; git diff --name-only --diff-filter=U | sed 's/^/  /'; exit 3; }
  python3 -I scripts/manifest.py >/dev/null
  git diff --quiet || { git add -A; git commit -q -m "Regenerate flow list after update"; }
  git push -q --force-with-lease -u origin "$B" 2>/dev/null || true
  say "Your workspace $B now includes the latest shared changes ($(git log -1 --format=%h origin/$MAIN))." ;;

finish)
  TITLE="${1:-Add flow}"; B=$(branch)
  [ "$B" = "$MAIN" ] && die "nothing to publish from the shared version" 5
  dirty && bash "$0" save "$TITLE"
  bash "$0" update || exit $?
  checks
  git push -q --force-with-lease -u origin "$B" || die "couldn't upload — run update again" 7
  PR=$(gh pr view "$B" --json number --jq .number 2>/dev/null || true)
  if [ -z "$PR" ]; then
    gh pr create --base "$MAIN" --head "$B" --title "$TITLE" --body "$(printf 'Flow added with the catalyst-flow-builder skill.\n\nChecks: data layer, flows, tokens — run by scripts/check.mjs.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)')" >/dev/null || die "couldn't open the pull request"
    PR=$(gh pr view "$B" --json number --jq .number)
  fi
  say "Pull request #$PR opened. Waiting for the GitHub checks…"
  sleep 5
  if gh pr checks "$PR" 2>&1 | grep -qi "no checks reported"; then
    say "(No GitHub checks are set up on this repo yet — the local checks passed, so continuing.)"
  else
    gh pr checks "$PR" --watch --interval 10 >/dev/null 2>&1 || die "GitHub checks failed on #$PR — see: gh pr checks $PR" 4
  fi
  gh pr merge "$PR" --squash --delete-branch >/dev/null 2>&1 || die "couldn't merge #$PR (maybe someone merged first) — run update, then finish again" 8
  git switch -q "$MAIN" && git fetch -q origin && git merge -q --ff-only "origin/$MAIN"
  say "Published: #$PR is now part of the shared version. The live site updates in about a minute." ;;

home)
  dirty && die "there are unsaved changes — save them first" 5
  git fetch -q origin && git switch -q "$MAIN" && git merge -q --ff-only "origin/$MAIN" && say "On the latest shared version." ;;

*) die "unknown command '$cmd' — see the top of scripts/sync.sh" ;;
esac
