#!/usr/bin/env bash
# Prints the CHANGELOG.md section for a version (e.g. 0.1.5 or v0.1.5).
# Exits non-zero when the section is missing or empty, so a release cannot ship without notes.
set -euo pipefail

version="${1#v}"
changelog="${2:-CHANGELOG.md}"

notes="$(awk -v v="$version" '
  $0 ~ "^## \\[" v "\\]" { found = 1; next }
  found && /^## \[/ { exit }
  found && /^\[[^]]+\]: / { exit }
  found { print }
' "$changelog" | sed -e '/./,$!d')"

if [ -z "$(printf '%s' "$notes" | tr -d '[:space:]')" ]; then
  echo "No CHANGELOG.md section for ${version}" >&2
  exit 1
fi

printf '%s\n' "$notes"
