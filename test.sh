#!/bin/bash
if [[ "$(Build.Reason)" != "PullRequest" ]]; then
  DIFFS=`git diff HEAD HEAD~1 --name-only -- 'frontend' 'backend' 'shared' | sed 's| |\\ |g' | sed 's|/.*||g' | sort | uniq`
else
  DIFFS=`git diff HEAD origin/$(System.PullRequest.TargetBranch) --name-only -- 'frontend' 'backend' 'shared' | sed 's| |\\ |g' | sed 's|/.*||g' | sort | uniq`
fi

if ! [[ "${DIFFS[@]}" ]]; then
  echo "No changes found in frontend, backend or shared directories."
  exit 0
fi

if [[ "${DIFFS[@]}" =~ "backend" ]]; then
  echo "##vso[task.setvariable variable=RUN_BACKEND;]true"
  echo "##vso[build.updatebuildnumber]$(Build.BuildNumber) - [BE]"
fi
