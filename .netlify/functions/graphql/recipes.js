const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

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

module.exports = { Recipe };
