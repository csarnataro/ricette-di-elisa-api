const fetch = require('cross-fetch')
const qs = require('qs')

exports.handler = async (event, context) => {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

  const path = event.path
  const pathParts = path.split('/')
  const recipeId = pathParts[4]
  const apiParams = qs.stringify(event.queryStringParameters)

  const apiEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Ricette/${recipeId}?${apiParams}&api_key=${AIRTABLE_API_KEY}`

  console.log(`**** Function called`)

  try {
    const response = await fetch(apiEndpoint)
    const jsonResponse = await response.json()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonResponse)
    }
  } catch (error) {
    console.error(error)
    return { statusCode: 422, body: String(error) }
  } finally {
    console.log(`****  Function completed\n`)
  }
}
