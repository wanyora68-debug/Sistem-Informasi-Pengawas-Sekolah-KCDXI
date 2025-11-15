#!/usr/bin/env bash
# Render build script

set -e

echo "🔧 Installing dependencies..."
npm install

echo "🏗️ Building client..."
npm run build

echo "✅ Build completed!"
