cat raw.json| jq '.[].data.repository.issues.nodes[] | "createdAt:" + .createdAt, "closedAt:" + .closedAt,.title,.body' > all_raw.txt
cat all_raw.txt | sed -e's/\\[rt]/ /g' -e 's/^"//' -e 's/"$//' -e 's/\\"/"/g' -e 's/\\n/\'$'\n/g' > all.txt
cat all.txt | cat all_raw.txt | sed -e's/\\[rt]/ /g' -e 's/^"//' -e 's/"$//' -e 's/\\"/"/g' -e 's/\\n/\'$'\n/g' > no_stacktrace.txt
