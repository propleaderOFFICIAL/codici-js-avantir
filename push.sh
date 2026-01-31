#!/bin/bash
# Push su GitHub – esegui da questa cartella (doppio clic o: ./push.sh)
cd "$(dirname "$0")"
git add -A
git status --short
git commit -m "Update: $(date +%Y-%m-%d_%H:%M)" 2>/dev/null || git commit -m "Update"
git push origin main
echo ""
echo "Fatto. Premi un tasto per chiudere..."
read -n 1
