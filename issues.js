const { query } = require('graphqurl')
const fs = require("fs")
const _ = require("lodash")
const homedir = require('os').homedir();

const slurp = (filename) => { return fs.readFileSync(filename).toString() }
const delay = (ms) => new Promise(res => setTimeout(res, ms))

const token = slurp(`${homedir}/.tokens/GH_READ`).trim()
const issues_query = slurp('issues.graphql')
const vars = 
{
  //"cursor": "Y3Vyc29yOnYyOpK5MjAxNS0wMi0xNFQxOToxMzozOCswMTowMM4DcHPv",
  "order": {"field": "CREATED_AT", "direction": "DESC"}
}

const paginatedQuery = async function(options, successCb, errorCb) {
    const {pageInfoPath, wait, maxCount} = options
    const actualWait = wait || 1
    // TODO: check if query contains $cursor
    var response
    const delayedSuccessCb = async function(...args) {
        response = args[0]
        successCb.apply(this, args)
        await delay(actualWait)
    }
    var count = 0
    var hasNext = true
    while (hasNext) {
        await query(options, delayedSuccessCb, errorCb)
        const pageInfo = _.get(response, pageInfoPath)
        if (pageInfo && pageInfo.hasNextPage) {
            options.variables.cursor = pageInfo.endCursor
        }
        else {
            hasNext = false
        }
        count++
        if (count == maxCount) {
            hasNext = false
        }
    }
}

const theQuery = {
    query: issues_query,
    endpoint: 'https://api.github.com/graphql',
    headers: {
        Authorization:  `bearer ${token}`
    },
    variables: vars,
    maxCount: 2,
    wait: 10,
    pageInfoPath: "data.repository.issues.pageInfo"
}

main = async () => {
    console.log("[")
    await paginatedQuery(theQuery, 
        response => {
            console.log(JSON.stringify(response, null, 2))
            console.log(",")
        })
        .catch((error) => console.error(JSON.stringify(error)))
    console.log("{}]")
}

main()