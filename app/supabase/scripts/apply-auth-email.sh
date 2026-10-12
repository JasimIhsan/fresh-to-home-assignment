#!/usr/bin/env bash
# Switches sign-up confirmation from a magic link to a 6-digit code and
# uploads the branded "Confirm signup" template via the Management API.
#
# Usage: SUPABASE_ACCESS_TOKEN=sbp_... ./supabase/scripts/apply-auth-email.sh
# Create a token at https://supabase.com/dashboard/account/tokens
set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-nrksqvizpggktvnlhovb}"
: "${SUPABASE_ACCESS_TOKEN:?Set SUPABASE_ACCESS_TOKEN}"

TEMPLATE="$(dirname "$0")/../templates/confirm-signup.html"

payload="$(python3 -c '
import json, sys
print(json.dumps({
    "mailer_autoconfirm": False,
    "mailer_otp_length": 6,
    "mailer_otp_exp": 3600,
    "mailer_subjects_confirmation": "Ihr Bestätigungscode – Frisch nach Hause",
    "mailer_templates_confirmation_content": open(sys.argv[1]).read(),
}))
' "$TEMPLATE")"

curl -fsS -X PATCH \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$payload" >/dev/null

echo "Auth email updated: 6-digit OTP, branded confirm-signup template."
