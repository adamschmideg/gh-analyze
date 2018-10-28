const fs = require("fs")
const request = require("request")

const slurp = (filename) => { return fs.readFileSync(filename).toString() }

const fragment = () => { slurp("repoinfo.graphql") }

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

const token = slurp("TOKEN").trim()

const testQuery = '{  viewer { login }}'

const options = {
  url: "https://api.github.com/graphql",
  json: true,
  method: "POST",
  body: {query: testQuery},
  headers: {'User-Agent': 'gh-analyze',
	    Authorization: `Bearer ${token}`}
}
const githubRequest = request.defaults(options)


console.log(testQuery)


request(options, (err, res, body) => {
  if (err) { return console.log(err) }
  console.log("yeah")
  console.log(JSON.stringify(body, null, 2))
})
