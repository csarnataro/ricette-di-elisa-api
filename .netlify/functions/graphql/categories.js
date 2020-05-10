const fetch = require('cross-fetch');
const { GraphQLObjectType, GraphQLString } = require('graphql');
const { apiEndpoint } = require('./api-helper');

const mapCategory = record => ({
  id: record.id,
  name: record.fields.Name,
});

const fetchCategories = () => {
  return fetch(
    apiEndpoint({
      tableName: 'Categorie',
      additionalQueryParams: {
        'sort[0][field]': 'Name',
        'sort[0][direction]': 'asc',
      },
    })
  )
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
