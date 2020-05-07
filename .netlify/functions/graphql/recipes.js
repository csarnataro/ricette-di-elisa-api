const fetch = require('cross-fetch');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { apiEndpoint } = require('./api-helper');

const PAGE_SIZE = 100;

const fetchRecipes = async ({ first = PAGE_SIZE, skip = 0, categoryName }) => {
  const upperLimit = skip + first;
  const records = [];
  let offset = null;
  for (
    let i = 0;
    i * PAGE_SIZE < upperLimit && typeof offset !== 'undefined';
    i++
  ) {
    
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc'
    }

    if (categoryName) {
      additionalQueryParams.filterByFormula = `(FIND(LOWER("${categoryName}"),LOWER({Categoria}))>0)`
    }

    const response = await fetch(apiEndpoint({ 
      tableName: 'Ricette', 
      offset, 
      additionalQueryParams
    }));
    const json = await response.json();
    offset = json.offset;
    records.push(...json.records);
  }
  const slicedRecords = records.slice(skip, upperLimit);
  return slicedRecords.map(mapRecipe);
};

const mapRecipe = record => ({
  id: record.id,
  title: record.fields.Name,
  ingredients: record.fields.Ingredienti,
  process: record.fields.Esecuzione,
  suggestedBy: record.fields['Suggerita da'],
  categoryIds: record.fields.Categoria,
  tags: record.fields.ListaCategorie,
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

module.exports = { Recipe, mapRecipe, fetchRecipes };
