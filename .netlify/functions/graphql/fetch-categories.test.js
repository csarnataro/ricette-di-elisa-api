const nock = require('nock');
const { mapCategory, fetchCategories } = require('./fetch-categories');

describe('mapCategory', () => {
  const record = {
    id: '1234',
    fields: {
      Name: 'Main courses',
    },
  };

  const expectedObject = {
    id: '1234',
    name: 'Main courses',
  };

  it('should map a record from Airtable to a JS object', () => {
    expect(mapCategory(record)).toEqual(expectedObject);
  });
});

describe('fetchCategories', () => {
  beforeEach(() => {
    nock('https://api.airtable.com')
      .get(/\.*/)
      .reply(200, {
        records: [
          {
            id: '1234',
            fields: {
              Name: 'Antipasti',
            },
          },
        ],
      });
  });

  it('should fetch a list of categories', () => {
    const categories = fetchCategories();
    expect(categories).resolves.toEqual([
      {
        id: '1234',
        name: 'Antipasti',
      },
    ]);
  });
});
