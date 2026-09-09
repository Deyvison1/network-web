#!/bin/bash

set -e

echo "🐳 Rebuild e restart do frontend..."

docker compose up -d --build

echo "✅ Deploy concluído!"

docker ps --filter "name=network-app"