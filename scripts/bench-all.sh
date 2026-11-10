#!/bin/sh
# All 20 kaiju through scripts/kaiju-bench.ts in parallel: sh scripts/bench-all.sh <mode> [stages]
mode=${1:-normal}; only=$2; out=$(mktemp -d)
for sp in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19; do
  node node_modules/vite-node/dist/cli.mjs scripts/kaiju-bench.ts $sp $mode "" $only > $out/$sp.txt 2>/dev/null &
done
wait
cat $out/*.txt | node -e "const l=require('fs').readFileSync(0,'utf8').trim().split('\n').map(JSON.parse).sort((a,b)=>a.boss-b.boss);const p=v=>Math.round(v*100)+'%';console.log('$mode boss',p(l[0].boss)+'..'+p(l[l.length-1].boss),'stage',p(Math.min(...l.map(x=>x.stage)))+'..'+p(Math.max(...l.map(x=>x.stage))));console.log(l.map(x=>x.sp+':'+p(x.boss)+'/'+p(x.stage)).join(' '))"
