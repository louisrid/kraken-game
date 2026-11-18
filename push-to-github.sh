#!/usr/bin/env bash
# Creates a private GitHub repo "kraken-game" from this folder and pushes it.
# Needs the GitHub CLI (https://cli.github.com) signed in: gh auth login
set -e
gh repo create kraken-game --private --source=. --remote=origin --push \
  --description "KRAKEN: multiplayer rarity trivia (pirate kraken theme)"
echo "Done. To get a live link: make it public, then Settings > Pages > Deploy from branch: main / root."
