#!/usr/bin/env bash
set -euo pipefail

SERVER="root@82.25.85.237"
APP_DIR="/opt/nc-status"

echo "==> Sincronizando arquivos com o servidor..."
rsync -avz --exclude 'node_modules' --exclude '.angular' --exclude 'dist' \
  --exclude '.git' \
  ./ "$SERVER:$APP_DIR/"

echo "==> Copiando .env de produção..."
ssh "$SERVER" "cp $APP_DIR/.env.production $APP_DIR/.env"

echo "==> Construindo e subindo containers..."
ssh "$SERVER" "cd $APP_DIR && docker compose -f docker-compose.prod.yaml --env-file .env up -d --build"

echo "==> Executando seed (se necessário)..."
ssh "$SERVER" "cd $APP_DIR && docker compose -f docker-compose.prod.yaml exec backend node dist/server.js 2>/dev/null || true"

echo "==> Deploy concluído! Acesse http://82.25.85.237"
