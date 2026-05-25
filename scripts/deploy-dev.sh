#!/bin/bash

# Finanza AI - Development Cloud Run Deployment Script
# Uses Cloud Build with Artifact Registry

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Load environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/load-env.sh"

# Configuration
PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-west1}"
SERVICE_NAME="${SERVICE_NAME:-finanza-ai-dev}"
SERVICE_PORT="${SERVICE_PORT:-8080}"
SERVICE_MEMORY="${SERVICE_MEMORY:-1Gi}"
SERVICE_CPU="${SERVICE_CPU:-1000m}"
SERVICE_MAX_INSTANCES="${SERVICE_MAX_INSTANCES:-100}"
SERVICE_MIN_INSTANCES="${SERVICE_MIN_INSTANCES:-0}"

if [ -z "$PROJECT_ID" ]; then
  print_error "PROJECT_ID is not set"
  exit 1
fi

# Get branch name
BRANCH_NAME="${BRANCH_NAME:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "develop")}"
BRANCH_TAG=$(echo "$BRANCH_NAME" | sed 's/\//-/g' | sed 's/[^a-zA-Z0-9._-]/-/g' | tr '[:upper:]' '[:lower:]')

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Finanza AI - Development Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

print_info "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service Name: $SERVICE_NAME"
echo "  Branch: $BRANCH_NAME"
echo ""

# Deploy using Cloud Build
print_info "Deploying with Cloud Build..."

ENV_VARS="NODE_ENV=production"
[ -n "$GEMINI_API_KEY" ] && ENV_VARS="$ENV_VARS,GEMINI_API_KEY=$GEMINI_API_KEY"
[ -n "$VITE_GOOGLE_CLIENT_ID" ] && ENV_VARS="$ENV_VARS,VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID"

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --platform managed \
  --port "$SERVICE_PORT" \
  --memory "$SERVICE_MEMORY" \
  --cpu "$SERVICE_CPU" \
  --max-instances "$SERVICE_MAX_INSTANCES" \
  --min-instances "$SERVICE_MIN_INSTANCES" \
  --set-env-vars "$ENV_VARS" \
  --labels "branch=$BRANCH_TAG,environment=development" \
  --tag "$BRANCH_TAG" \
  --quiet

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)' 2>/dev/null)

echo ""
print_success "Deployment completed!"
print_info "Service URL: $SERVICE_URL"
echo ""