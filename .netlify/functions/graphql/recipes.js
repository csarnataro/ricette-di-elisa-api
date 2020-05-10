const fetch = require('cross-fetch');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { apiEndpoint } = require('./api-helper');

const PAGE_SIZE = 100;

const buildFormula = (categoryName, query) => {
  let categoryFormula
  let queryFormula
  if (categoryName) {
    categoryFormula = `(FIND(LOWER("${categoryName}"),LOWER({Categoria}))>0)`;
  }

  if (query) {
    queryFormula = `(FIND(LOWER("${query}"),LOWER({Name}))>0)`;
  }

  switch (true) {
    case (typeof categoryFormula !== 'undefined' && typeof queryFormula !== 'undefined'):
      return `AND(${categoryFormula}, ${queryFormula})`
    case (typeof categoryFormula !== 'undefined'):
      return categoryFormula
    case (typeof queryFormula !== 'undefined'):
      return queryFormula
    default:
      break;
  }

}

const fetchRecipes = async ({
  first = 1000,
  skip = 0,
  categoryName,
  query,
}) => {
  const upperLimit = 1000; // skip + first;
  const records = [];
  let offset = null;
  for (
    let i = 0;
    i * PAGE_SIZE < upperLimit && typeof offset !== 'undefined';
    i++
  ) {
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
    };

    const filterByFormula = buildFormula(categoryName, query)
    console.log('********** BEGIN: recipes 51 **********')
    console.dir(filterByFormula, { colors: true, depth: 16 })
    console.log('********** END:   recipes 51 **********')
    if (filterByFormula) {
      additionalQueryParams.filterByFormula = filterByFormula;
    }

    const response = await fetch(
      apiEndpoint({
        tableName: 'Ricette',
        offset,
        additionalQueryParams,
      })
    );
    const json = await response.json();
    offset = json.offset;
    records.push(...json.records);
  }
  const finalRecords = records.slice(skip, first + skip);
  console.log(`Should return ${finalRecords.length} records`);

  return {
    records: finalRecords.map(mapRecipe),
    totalCount: records.length,
  };
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
