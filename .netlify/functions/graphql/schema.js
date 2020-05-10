const fetch = require('cross-fetch');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');

const { apiEndpoint } = require('./api-helper');
const { Category, fetchCategories } = require('./categories');
const { Recipe, mapRecipe, fetchRecipes } = require('./recipes');

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
        resolve: (_, args) => {
          return fetchCategories(args);
        },
      },
      // recipes: {
      //   type: new GraphQLList(Recipe),
      //   args: {
      //     first: { type: GraphQLInt },
      //     skip: { type: GraphQLInt },
      //     categoryName: { type: GraphQLString }
      //   },
      //   resolve: (_, args) => {
      //     return fetchRecipes(args)
      //   },
      // },
      /* EXPERIMENTAL
       */

      recipes: {
        type: new GraphQLObjectType({
          name: 'AllRecipes',
          fields: () => ({
            records: {
              type: new GraphQLList(Recipe),
              resolve: parent => parent.records,
            },
            totalCount: {
              type: GraphQLInt,
              resolve: parent => parent.totalCount,
            },
          }),
        }),
        args: {
          first: { type: GraphQLInt },
          skip: { type: GraphQLInt },
          categoryName: { type: GraphQLString },
          query: { type: GraphQLString }
        },
        resolve: (_, args) => {
          return fetchRecipes(args);
        },
      },
      recipe: {
        type: Recipe,
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: (_, { id }) => {
          return fetch(apiEndpoint({ tableName: 'Ricette', id }))
            .then(response => response.json())
            .then(mapRecipe);
        },
      },
    }),
  }),
});

module.exports = schema;
