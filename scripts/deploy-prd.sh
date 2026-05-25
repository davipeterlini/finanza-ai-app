#!/bin/bash

# Finanza AI - Production Cloud Run Deployment Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }

# Load environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/load-env.sh"

# Configuration
PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-west1}"
SERVICE_NAME="${SERVICE_NAME:-finanza-ai-prd}"

if [ -z "$PROJECT_ID" ]; then
  print_error "PROJECT_ID is not set"
  exit 1
fi

# Get version from Git tag
VERSION="${VERSION:-}"
if [ -z "$VERSION" ]; then
  VERSION=$(git describe --tags --exact-match 2>/dev/null | sed 's/^v//')
fi

if [ -z "$VERSION" ]; then
  print_error "No VERSION specified and not on a Git tag"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Finanza AI - Production Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

print_info "Version: $VERSION"
print_info "Project: $PROJECT_ID"
print_info "Region: $REGION"
print_info "Service: $SERVICE_NAME"
echo ""

# Build environment variables
ENV_VARS="NODE_ENV=production,VERSION=$VERSION"
[ -n "$GEMINI_API_KEY" ] && ENV_VARS="$ENV_VARS,GEMINI_API_KEY=$GEMINI_API_KEY"
[ -n "$VITE_GOOGLE_CLIENT_ID" ] && ENV_VARS="$ENV_VARS,VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID"

# Deploy
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --platform managed \
  --port 8080 \
  --memory 1Gi \
  --cpu 1000m \
  --max-instances 100 \
  --min-instances 0 \
  --set-env-vars "$ENV_VARS" \
  --labels "version=v$VERSION,environment=production" \
  --tag "$VERSION" \
  --allow-unauthenticated \
  --quiet

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)' 2>/dev/null)

echo ""
print_success "Production deployment completed!"
print_info "Service URL: $SERVICE_URL"
echo ""