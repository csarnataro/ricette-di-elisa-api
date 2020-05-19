const fetch = require('cross-fetch');
const { buildApiEndpointURL } = require('./api-endpoint');
const { logSanitizedUrl } = require('./log-sanitized-url');

const mapCategory = (record) => ({
  id: record.id,
  name: record.fields.Name,
});

const fetchCategories = () => {
  const apiEndpoint = buildApiEndpointURL({
    tableName: 'Categorie',
    additionalQueryParams: {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
    },
  });
  console.log(`Fetching from [${logSanitizedUrl(apiEndpoint)}]`);

  return fetch(apiEndpoint)
    .then((response) => response.json())
    .then((json) => json.records.map(mapCategory));
};

module.exports = {
  fetchCategories,
  mapCategory,
};
