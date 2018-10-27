SELECT repo.name,
       ROUND(COUNT(*)/EXACT_COUNT_DISTINCT(actor.login),2) comments_per_author,
       EXACT_COUNT_DISTINCT(actor.login ) authors, 
       COUNT(*) comments,
       first(repo.id)
FROM 
  [githubarchive:month.201804],
  [githubarchive:month.201805],
  [githubarchive:month.201806],
  [githubarchive:month.201807],
  [githubarchive:month.201808],
  [githubarchive:month.201809]
WHERE type IN ('IssueCommentEvent') 
 -- and org.login in ("bitcoin", "buddy-works", "coinbase", "ConsenSys", "corda", "eosio", "ethereum", "ethereumclassic", "hyperledger", "litecoin-project", "MenloOne", "paritytech", "ripple", "status-im", "steemit", "symbiont-io", "zcash")
GROUP BY 1
--HAVING comments_per_author > 2
ORDER BY 3 DESC, 2 desc
LIMIT 10
