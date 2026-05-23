#!/usr/bin/env bash
# PostToolUse hook: voice alert after enquiry form is submitted via Playwright
set -euo pipefail

input=$(cat)

tool_name=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || true)

# Trigger on browser_fill_form or browser_click (submit button)
if [[ "$tool_name" == "mcp__playwright__browser_fill_form" || "$tool_name" == "mcp__playwright__browser_click" ]]; then
  # Check if the tool response contains form-submission success signals
  response=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(str(d.get('tool_response','')))" 2>/dev/null || true)
  if echo "$response" | grep -qiE "success|submitted|thank you|formsubmit|200"; then
    say "HURRAY, YOUR FORM IS SUBMITTED SUCCESSFULLY"
  fi
fi
