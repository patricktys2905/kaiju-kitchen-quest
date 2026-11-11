#!/bin/sh
# Balance sample across chosen stages in parallel: sh scripts/sweep.sh <runs> <normal|hard|nightmare> <average|skilled> <stage ids...>
runs=$1; mode=$2; skill=$3; jams=${JAMS:-3}; shift 3; out=shots/sweep; mkdir -p $out
for s in "$@"; do node node_modules/vite-node/dist/cli.mjs scripts/balance.ts "$s" $runs $mode $skill $jams > $out/$s.txt 2>&1 & done; wait
for s in "$@"; do grep -h "^$s " $out/$s.txt | cut -c1-95; grep -o "TIMEOUT" $out/$s.txt | wc -l | sed 's/^/      timeouts: /' | grep -v ": 0$"; done
