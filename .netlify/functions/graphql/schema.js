const fetch = require('cross-fetch');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const { buildApiEndpointURL } = require('./api-endpoint');
const { Category } = require('./categories');
const { fetchCategories } = require('./fetch-categories');
const { Recipe } = require('./recipes');
const { mapRecipe, fetchRecipes } = require('./fetch-recipes');

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
        resolve: (_, args) => fetchCategories(args),
      },

      recipes: {
        type: new GraphQLObjectType({
          name: 'AllRecipes',
          fields: () => ({
            records: {
              type: new GraphQLList(Recipe),
              resolve: (parent) => parent.records,
            },
            totalCount: {
              type: GraphQLInt,
              resolve: (parent) => parent.totalCount,
            },
          }),
        }),
        args: {
          first: { type: GraphQLInt },
          skip: { type: GraphQLInt },
          categoryName: { type: GraphQLString },
          query: { type: GraphQLString },
        },
        resolve: (_, args) => fetchRecipes(args),
      },
      recipe: {
        type: Recipe,
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: (_, { id }) => fetch(buildApiEndpointURL({ tableName: 'Ricette', id }))
          .then((response) => response.json())
          .then(mapRecipe),
      },
    }),
  }),
});

module.exports = schema;
