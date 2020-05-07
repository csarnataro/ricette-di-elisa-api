const fetch = require('cross-fetch');
const { GraphQLObjectType, GraphQLString } = require('graphql');
const { apiEndpoint } = require('./api-helper');


const mapCategory = record => ({
  id: record.id,
  name: record.fields.Name,
});

const fetchCategories = ({ offset, count }) => {
  return fetch(apiEndpoint('Categorie'))
    .then(response => response.json())
    .then(json => json.records.map(mapCategory));
};

const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

module.exports = { Category, fetchCategories };
