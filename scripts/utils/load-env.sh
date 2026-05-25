#!/bin/bash

# Simple Environment Loader
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
  echo "✓ Environment loaded from: $ENV_FILE"
else
  echo "⚠ Environment file not found: $ENV_FILE"
fi