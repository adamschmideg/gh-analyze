const fs = require("fs")
const GithubGraphQLApi = require('node-github-graphql')
const parseCsv = require("csvtojson")
const json2csv = require('json2csv').parse

const simpleColumns = "nameWithOwner,createdAt,forkCount,hasWikiEnabled".split(",")
const totalCountColumns = "stargazers,issues,help_wanted,good_first_issues,open_issues,projects,milestones,open_milestones,labels,pullRequests,releases,watchers".split(",")
const columns = simpleColumns.concat(totalCountColumns)

const slurp = (filename) => { return fs.readFileSync(filename).toString() }

const token = slurp("TOKEN").trim()

const github = new GithubGraphQLApi({
  Promise: require('bluebird'),
  token: token,
  userAgent: 'gh-analyze'
})

const fragment = slurp("repoinfo.graphql")

const getQuery = (org, repo, frag) => {
  return `
    query {
      repository(owner: "${org}", name: "${repo}") { ... RepoInfo }
    }
    ${frag}
  `
}

const repoNames = async (filename) => {
  const repos = await parseCsv()
    .fromFile(filename)
  const names = repos.map(repo => repo.repo_name.split("/"))
  return names
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
  let values = {}
  for (const column of simpleColumns) {
    values[column] = root[column]
  }
  for (const column of totalCountColumns) {
    values[column] = root[column].totalCount
  }
  return values
}

const queryOneRepo = async (org, repo) => {
  const query = getQuery(org, repo, fragment)
  const rawData = await execQuery(query)
  const record = await extractValues(rawData)
  return record
}

const writeToCsv = (fields, rows) => {
  try {
    const opts = { fields: fields, quote: ""}
    const csv = json2csv(rows, opts)
    console.log(csv)
  }
  catch (err) {
    console.log(err)
  }
}

const _main = async () => {
  const data = [
    {name: {first: "Joe"}, id: 1},
    {name: {first: "Jane"}, id: 2}
  ]
  writeToCsv("name.first,id".split(","), data, "temp.csv")
}

const testQuery = '{  viewer { login }}'

const main = async () => {
  //const q = getQuery("Microsoft", "vscode", fragment)
  const allRepos = await repoNames("100-companies.csv")
  const repos = allRepos.slice(0,2)
  let records = []
  for (const orgAndRepo of repos) {
    const rec = await queryOneRepo(orgAndRepo[0], orgAndRepo[1])
    records.push(rec)
  }
  writeToCsv(columns, records)
}

main()