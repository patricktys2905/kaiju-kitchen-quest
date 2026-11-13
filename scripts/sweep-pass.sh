#!/bin/sh
# Balance sweep to a named file, all 20 kaiju unless KAIJU is set, keeping the per-kaiju line.
# sh scripts/sweep-pass.sh <outfile> <runs> [mode=normal] [stages... default all 100]
# e.g. sh scripts/sweep-pass.sh shots/sweep-pass1-all.txt 3
#      sh scripts/sweep-pass.sh shots/sweep-pass1-boss.txt 5 normal 1-10 2-10
#      ELTUNE=off sh scripts/sweep-pass.sh ...   weakness multipliers all 1 (or six numbers: see scripts/balance.ts)
#      PREPARED=1 sh scripts/sweep-pass.sh ...   the "prepared" build (weapon and buttons matched to the stage's boss-room foe; PREPARED=weapon: the weapon only)
out=$1; runs=${2:-2}; mode=${3:-normal}; jams=${JAMS:-8}
shift; shift; [ $# -gt 0 ] && shift
tmp=shots/.sweep-$$; mkdir -p $tmp
if [ $# -gt 0 ]; then list="$*"; else list=""; for w in 1 2 3 4 5 6 7 8 9 10; do for n in 1 2 3 4 5 6 7 8 9 10; do list="$list $w-$n"; done; done; fi
for s in $list; do echo "$s"; done |
  xargs -P ${PAR:-16} -I{} sh -c "node node_modules/vite-node/dist/cli.mjs scripts/balance.ts '{}' $runs $mode skilled $jams 2>/dev/null | grep -A1 '^{} ' > $tmp/{}.txt"
: > $out
for s in $list; do cat $tmp/$s.txt >> $out; done
rm -rf $tmp
grep -v '^ ' $out | cut -c1-100
grep -c TIMEOUT $out | sed 's/^/timeouts: /'
