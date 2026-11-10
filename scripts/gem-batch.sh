#!/bin/sh
# Resumable Gemini batch: runs every job of a jobs file one at a time (a refused prompt hangs gem-gen, so each job gets a
# time limit), skipping jobs whose art-src/raw/<name>.png already exists. Safe to re-run after it stops.
# Never run two of these (or any two gem-gen) at once: they share the one Gemini tab.
#   sh scripts/gem-batch.sh art-src/jobs-elite.json shots/gem-elite.log
jobs=$1; log=${2:-shots/gem-batch.log}
n=$(node -e "console.log(require('./$jobs').length)")
i=0
while [ "$i" -lt "$n" ]; do
  name=$(node -e "console.log(require('./$jobs')[$i].name)")
  if [ ! -f "art-src/raw/$name.png" ]; then
    timeout 220 node scripts/gem-gen.mjs "$jobs" "$i" 1 >> "$log" 2>&1 || echo "FAILED job $i $name" >> "$log"
  fi
  i=$((i + 1))
done
echo DONE >> "$log"
