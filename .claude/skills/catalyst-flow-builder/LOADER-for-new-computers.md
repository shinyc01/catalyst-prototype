---
name: catalyst-flow-builder
description: >
  Builds mini flows into the Catalyst working prototype (GitHub repo shinyc01/catalyst-prototype) and publishes them safely.
  Use whenever the user gives a Catalyst mini flow or Figma links to add to the prototype, asks to update, sync or publish the
  Catalyst prototype, or asks to set the Catalyst prototype up on this computer. This is a loader: the real skill lives in the repo.
---

# Catalyst flow builder (loader)

The full instructions live inside the repo, so they stay the same for everyone who works on it.

1. Find the repo on this computer. Check whether the current folder is it (`git remote -v` shows `shinyc01/catalyst-prototype`), then look in `~/Documents/catalyst-prototype` and `~/Documents/CLAUDE_NEW/CODE/Catalyst-prototype`.
2. If it isn't there, set it up. Follow the "First time on a computer" steps below, then clone it: `gh repo clone shinyc01/catalyst-prototype ~/Documents/catalyst-prototype`.
3. Move the session to the repo folder (`change_directory`), then read `.claude/skills/catalyst-flow-builder/SKILL.md` in the repo and follow it exactly.

## First time on a computer
The user is a designer, so do everything for them except logging in.
- **git:** check `git --version`. If it's missing, run `xcode-select --install` and ask the user to click Install.
- **GitHub CLI:** check `gh --version`. If it's missing, use `brew install gh` when Homebrew exists; otherwise ask the user to install the macOS package from https://cli.github.com.
- **Node.js:** check `node --version`. If it's missing, ask the user to install the LTS version from https://nodejs.org.
- **Login:** if `gh auth status` fails, ask the user to run `gh auth login` in Terminal (GitHub.com → HTTPS → Login with a web browser). Never handle their password or token.
- **Repo access:** they need to accept the collaborator invitation email from GitHub. If they haven't been invited, ask Shiny (`shinyc01`) to invite them.
