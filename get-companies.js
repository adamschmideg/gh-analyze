const fs = require("fs")
const https = require("https")

const fragment = () => {
  return fs.readFileSync("repoinfo.graphql").toString()
}

const getQuery = (org, repo, frag) => {
  return `
    query {
      repository(owner: "${org}", name: "${repo}") { ... RepoInfo }
    }
    ${frag}
  `
}

const execQuery = (options, query, token) => {
  const req = https.request(options, (res) => {
    res.on('data'), (d) => { return d }
  })
  req.on('error', (error) => { return null, error })
}

const options = {
  hostname: "api.github.com",
  port: 443,
  path: "/graphql",
  method: "POST"
}
const githubEndpoint = "https://api.github.com/graphql"
const testQuery = "{ 'query': '{ query { viewer { login }}}' }"

console.log(execQuery(options, testQuery, ""))
