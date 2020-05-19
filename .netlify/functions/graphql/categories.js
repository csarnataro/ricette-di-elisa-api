const { GraphQLObjectType, GraphQLString } = require('graphql');

const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

module.exports = { Category };
