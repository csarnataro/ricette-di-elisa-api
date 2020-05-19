const fetch = require('cross-fetch');
const { buildApiEndpointURL } = require('./api-endpoint');
const { logSanitizedUrl } = require('./log-sanitized-url');

const PAGE_SIZE = 100;

const mapRecipe = (record) => ({
  id: record.id,
  title: record.fields.Name,
  ingredients: record.fields.Ingredienti,
  process: record.fields.Esecuzione,
  suggestedBy: record.fields['Suggerita da'],
  categoryIds: record.fields.Categoria,
  tags: record.fields.ListaCategorie,
});

const buildFormula = (categoryName, query) => {
  let categoryFormula;
  let queryFormula;
  if (categoryName) {
    categoryFormula = `(FIND(LOWER("${categoryName}"),LOWER({Categoria}))>0)`;
  }

  if (query) {
    queryFormula = `(FIND(LOWER("${query}"),LOWER({Name}))>0)`;
  }

  switch (true) {
    case (typeof categoryFormula !== 'undefined' && typeof queryFormula !== 'undefined'):
      return `AND(${categoryFormula}, ${queryFormula})`;
    case (typeof categoryFormula !== 'undefined'):
      return categoryFormula;
    case (typeof queryFormula !== 'undefined'):
      return queryFormula;
    default:
      break;
  }
  return '';
};

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
    i += 1
  ) {
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
    };

    const filterByFormula = buildFormula(categoryName, query);
    if (filterByFormula) {
      additionalQueryParams.filterByFormula = filterByFormula;
    }

    const apiUrl = buildApiEndpointURL({
      tableName: 'Ricette',
      offset,
      additionalQueryParams,
    });
    console.log(`Fetching from ${logSanitizedUrl(apiUrl)}`);
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(apiUrl);

    // eslint-disable-next-line no-await-in-loop
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

module.exports = { mapRecipe, fetchRecipes };
