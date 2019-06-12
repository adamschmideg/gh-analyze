const { query } = require('graphqurl')
const fs = require("fs")
const homedir = require('os').homedir();

const slurp = (filename) => { return fs.readFileSync(filename).toString() }

const token = slurp(`${homedir}/.tokens/GH_READ`).trim()
const issues_query = slurp('issues.graphql')
const vars = 
{
  "cursor": "Y3Vyc29yOnYyOpK5MjAxNS0wMi0xNFQxOToxMzozOCswMTowMM4DcHPv",
  "filter": {"since": "2018-01-01T10:15:30Z"},
  "order": {"field": "CREATED_AT", "direction": "ASC"}
}

query({
    query: issues_query,
    endpoint: 'https://api.github.com/graphql',
    headers: {
        Authorization:  `bearer ${token}`
    },
    variables: vars
})
.then((response) => console.log(JSON.stringify(response)))
.catch((error) => console.error(JSON.stringify(error)))