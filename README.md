# Ricette di Elisa - API

Ricette di Elisa (Elisa's recipes) is a list of Italian home recipes created by
Elisa, a 75 years old Italian grandmother, collected in electronic form during
the last 15 years. Some of the recipes have been suggested by some of her
friend.

Backed by a Airtable database, this project exposes a GraphQL endpoint with all
the recipes available at the moment.

Online demo available at:

[https://ricette-di-elisa-api.netlify.app/.netlify/functions/graphql](https://ricette-di-elisa-api.netlify.app/.netlify/functions/graphql)

## Intended use of this API

I created this API first of all to make my aunt Elisa happy, now she can write
and store her recipes in a safe place (Airtable).
Too many broken hard disks during these last 15 years and no backups caused
the loss of many many great recipes.

Moreover, I would like to experiment with [Flutter](https://flutter.dev/) or
Kotlin/Android to create a mobile
app to share those recipes with friends and whoever loves Italian home cuisine.

## Airtable

The receipes are stored in a [Airtable](https://www.airtable.com) private
database.

## Netlify

The GraphQL endpoint is developed using `express`, `express-graphql`
and `serverless-http` deployed as a [Netlify function](https://www.netlify.com/products/functions/).

The credentials to access the private Airtable database are stored on Netlify
as environemnt variables. See:
[https://docs.netlify.com/configure-builds/environment-variables/](https://docs.netlify.com/configure-builds/environment-variables/)

This means that confidential information, e.g. the private Airtable `api_key`
are not exposed to the final user nor are they stored in the Git repository.

## Limits and quotas

The demo above is using free tiers both in Airtable and in Netlify, so it has
some limitations regarding the number of request per seconds (5 per seconds).

## Test GraphQL locally

In order to test the GraphQL endpoint locally, I've prepared a simple script
which can be useful just to mock the Netlify function.
Still, you must provide a datasource (e.g. an Airtable database) properly configured.

```javascript
NODE_ENV=local AIRTABLE_API_KEY=<YOUR_KEY> AIRTABLE_BASE_ID=<YOUR_BASE_ID> nodemon --watch .netlify test-graphql-locally
```

Then open your browser at http://localhost:4000/.netlify/functions/graphql to
see the well known [GraphiQL](https://github.com/graphql/graphiql/tree/master/packages/graphiql#readme) interface

## License

[MIT](https://choosealicense.com/licenses/mit/)
