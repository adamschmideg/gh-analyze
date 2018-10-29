const fs = require("fs")
const GithubGraphQLApi = require('node-github-graphql')

const simpleColumns = "nameWithOwner,createdAt,forkCount,hasWikiEnabled"
const totalCountColumns = "stargazers,issues,help_wanted,good_first_issues,open_issues,projects,milestones,open_milestones,labels,pullRequests,releases,watchers"
const columns = `$simpleColumns,$totalCountColumns`

const slurp = (filename) => { return fs.readFileSync(filename).toString() }

const token = slurp("TOKEN").trim()

const github = new GithubGraphQLApi({
  Promise: require('bluebird'),
  token: token,
  userAgent: 'gh-analyze'
})

const fragment = () => { return slurp("repoinfo.graphql") }

const getQuery = (org, repo, frag) => {
  return `
    query {
      repository(owner: "${org}", name: "${repo}") { ... RepoInfo }
    }
    ${frag}
  `
}

const execQuery = async (query) => {
  let result
  await github.query(query)
    .then((res) => { result = res })
    .catch((err) => { return console.log(err) })
  return result
}

const extractValues = async (rawData) => {
  const root = rawData.data.repository
  const simpleValues = simpleColumns.split(",").map(col => root[col])
  const countValues = totalCountColumns.split(",").map(col => root[col].totalCount)
  return simpleValues.concat(countValues)
}

const testQuery = '{  viewer { login }}'

//const q = testQuery

const main = async () => {
  const q = getQuery("Microsoft", "vscode", fragment())
  const rawData = await execQuery(q)
  const record = await extractValues(rawData)
  console.log(JSON.stringify(record, null, 2))
}

main()