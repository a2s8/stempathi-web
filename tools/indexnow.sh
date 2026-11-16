#!/bin/sh
# Ping IndexNow (Bing, Yandex and others) about changed pages.
# Usage: tools/indexnow.sh https://stempathi.sripathi.one/ https://stempathi.sripathi.one/faq/ ...
#        tools/indexnow.sh --all     (every URL in sitemap.xml)
# The key is public by design: it is the file at the site root that proves we own the host.
set -eu
HOST="stempathi.sripathi.one"
KEY="cb2617571cc0a9d879b0f043d1bb370f"
cd "$(dirname "$0")/.."
if [ "${1:-}" = "--all" ]; then
  set -- $(grep -o '<loc>https://[^<]*/</loc>' sitemap.xml | sed 's#</\{0,1\}loc>##g')
fi
[ "$#" -gt 0 ] || { echo "no URLs given"; exit 0; }
LIST=$(printf '"%s",' "$@" | sed 's/,$//')
BODY="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$LIST]}"
echo "IndexNow: $# URL(s)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" --data "$BODY"
# 200 or 202 = accepted. 403 = key file not reachable yet (wait for Pages to deploy). 422 = URL not on this host.
