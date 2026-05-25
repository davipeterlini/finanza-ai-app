#!/bin/sh
set -e

# Create env-config.js with environment variables
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_GOOGLE_CLIENT_ID: '${VITE_GOOGLE_CLIENT_ID:-}',
  APP_VERSION: '${APP_VERSION:-0.1.0}',
  ENVIRONMENT: '${ENVIRONMENT:-production}'
};
EOF

echo "Environment variables injected into env-config.js"

# Add cache busting for deployment
CACHE_BUST=$(date +%s)
sed -i "s|<meta http-equiv=\"Expires\" content=\"0\" />|<meta http-equiv=\"Expires\" content=\"0\" />\n    <meta name=\"deployed-at\" content=\"$CACHE_BUST\" />|" /usr/share/nginx/html/index.html

echo "Cache busting applied with timestamp: $CACHE_BUST"

# Execute the CMD (nginx)
exec "$@"