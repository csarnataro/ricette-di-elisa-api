/* TO BE WORKING PROPERLY, IT NEEDS TO BE LAUNCHED WITH NODE_ENV=local 
 * E.g.
 * $ NODE_ENV=local node test-graphql-locally.js 
 */

const app = require('./.netlify/functions/recipes-graphql').handler
const port = 3000

app.listen(port)
console.log(`listening on http://localhost:${port}`)