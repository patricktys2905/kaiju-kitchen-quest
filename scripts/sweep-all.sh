#!/bin/sh
# Every story stage through scripts/balance.ts, 16 at a time: KAIJU=0,10,11 JAMS=8 sh scripts/sweep-all.sh <runs> <mode> <average|skilled>
runs=${1:-1}; mode=${2:-normal}; skill=${3:-skilled}; jams=${JAMS:-8}; out=shots/sweep; mkdir -p $out
for w in 1 2 3 4 5 6 7 8 9 10; do for n in 1 2 3 4 5 6 7 8 9 10; do echo "$w-$n"; done; done |
  xargs -P 16 -I{} sh -c "node node_modules/vite-node/dist/cli.mjs scripts/balance.ts '{}' $runs $mode $skill $jams 2>/dev/null | grep -A1 '^{} ' > $out/{}.txt"
for w in 1 2 3 4 5 6 7 8 9 10; do for n in 1 2 3 4 5 6 7 8 9 10; do head -1 $out/$w-$n.txt | cut -c1-90; done; done
