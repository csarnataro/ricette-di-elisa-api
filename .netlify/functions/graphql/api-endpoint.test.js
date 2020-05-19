const { buildApiEndpointURL } = require('./api-endpoint');


describe('buildApiEndpointURL', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    process.env.AIRTABLE_API_KEY = '1234567890';
    process.env.AIRTABLE_BASE_ID = 'ABCDEFGHIJ';

    // delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should build a simple URL with the minimum available info', () => {
    const args = {
      tableName: 'Recipes',
    };

    const expectedUrl = encodeURI('https://api.airtable.com/v0/ABCDEFGHIJ/Recipes?api_key=1234567890');
    expect(buildApiEndpointURL(args)).toBe(expectedUrl);
  });

  it('should build a simple URL with more info', () => {
    const args = {
      tableName: 'Recipes',
      id: 'rec1234',
      offset: 'offset/rec1235',
    };

    const expectedUrl = 'https://api.airtable.com/v0/ABCDEFGHIJ/Recipes/rec1234?api_key=1234567890&offset=offset%2Frec1235';
    expect(buildApiEndpointURL(args)).toBe(expectedUrl);
  });

  it('should build a simple URL with additional params', () => {
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
    };

    const args = {
      tableName: 'Recipes',
      additionalQueryParams,
    };

    const expectedUrl = encodeURI('https://api.airtable.com/v0/ABCDEFGHIJ/Recipes?api_key=1234567890&sort[0][field]=Name&sort[0][direction]=asc');
    expect(buildApiEndpointURL(args)).toBe(expectedUrl);
  });
});
