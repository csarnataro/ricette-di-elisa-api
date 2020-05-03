const serverless = require('serverless-http');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const apiEndpoint = (table, id) => {
  const recordId = id || ''
  return `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}/${recordId}?api_key=${AIRTABLE_API_KEY}`;
}
  
// Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     recipes: String
//   }
// `);

const mapRecipe = record => ({
  id: record.id,
  title: record.fields.Name,
  ingredients: record.fields.Ingredienti,
  process: record.fields.Esecuzione,
  suggestedBy: record.fields['Suggerita da'],
  categoryIds: record.fields.Categoria,
  tags: record.fields.ListaCategorie,
});

const mapCategory = record => ({
  id: record.id,
  name: record.fields.Name,
});

const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const Recipe = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    ingredients: { type: GraphQLString },
    process: { type: GraphQLString },
    suggestedBy: { type: GraphQLString },
    categoryIds: { type: GraphQLList(GraphQLString) },
    tags: { type: GraphQLString },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Root',
    fields: () => ({
      hello: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
        },
        resolve: (_, { name }) => `Hello ${name}!`,
      },
      categories: {
        type: new GraphQLList(Category),
        resolve: () => {
          return fetch(apiEndpoint('Categorie'))
            .then(response => response.json())
            .then(json => json.records.map(mapCategory));
        },
      },
      recipes: {
        type: new GraphQLList(Recipe),
        resolve: () => {
          return fetch(apiEndpoint('Ricette'))
            .then(response => response.json())
            .then(json => json.records.map(mapRecipe));
        },
      },
      recipe: {
        type: Recipe,
        args: {
          id: { type: GraphQLString },
        },
        resolve: (_, { id }) => {
          return fetch(apiEndpoint('Ricette', id))
            .then(response => response.json())
            .then(mapRecipe);
        },
      },
    }),
  }),
});

const app = express();

app.use(bodyParser.json());
app.use(
  '/.netlify/functions/recipes-graphql/',
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
  })
);

module.exports.handler =
  process.env.NODE_ENV === 'local' ? app : serverless(app);
