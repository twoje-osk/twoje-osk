#!/bin/bash
DIFFS=`git diff HEAD HEAD~1 --name-only -- 'frontend' 'shared' | sed 's| |\\ |g' | sed 's|/.*||g' | sort | uniq`

echo $DIFFS

if ! [[ "${DIFFS[@]}" ]]; then
  echo "No changes found in frontend or shared directories."
  exit 0
fi

if [[ "${DIFFS[@]}" =~ "frontend" || "${DIFFS[@]}" =~ "shared" ]]; then
  echo "##vso[task.setvariable variable=RUN_FRONTEND;isOutput=true]true"
fi
