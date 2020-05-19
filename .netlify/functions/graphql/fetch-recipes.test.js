const nock = require('nock');
const { mapRecipe, fetchRecipes } = require('./fetch-recipes');

describe('mapRecipe', () => {
  const record = {
    id: '1234',
    fields: {
      Name: 'Meat',
      'Suggerita da': 'Some friend',
      Categoria: ['1', '2', '3'],
      Ingredienti: 'Some meat',
      Esecuzione: 'Shake',
      ListaCategorie: 'Main courses,Entrees',
    },
  };

  const expectedObject = {
    id: '1234',
    title: 'Meat',
    categoryIds: ['1', '2', '3'],
    ingredients: 'Some meat',
    process: 'Shake',
    suggestedBy: 'Some friend',
    tags: 'Main courses,Entrees',
  };

  it('should map a record from Airtable to a JS object', () => {
    expect(mapRecipe(record)).toEqual(expectedObject);
  });
});

describe('fetchRecipes', () => {
  beforeEach(() => {
    nock('https://api.airtable.com')
      .get(/\.*/)
      .reply(200, {
        records: [
          {
            id: '1234',
            fields: {
              Name: 'Meat',
              'Suggerita da': 'Some friend',
              Categoria: ['1', '2', '3'],
              Ingredienti: 'Some meat',
              Esecuzione: 'Shake',
              ListaCategorie: 'Main courses,Entrees',
            },
          },
          {
            id: '1235',
            fields: {
              Name: 'Eggs',
              'Suggerita da': 'Some other friend',
              Categoria: ['1'],
              Ingredienti: 'Some eggs',
              Esecuzione: 'Shake the eggs',
              ListaCategorie: 'Main courses',
            },
          },
        ],
      });
  });

  it('should fetch a list of recipes', async () => {
    const expectedResult = {
      totalCount: 2,
      records: [
        {
          id: '1234',
          title: 'Meat',
          categoryIds: ['1', '2', '3'],
          ingredients: 'Some meat',
          process: 'Shake',
          suggestedBy: 'Some friend',
          tags: 'Main courses,Entrees',
        },
        {
          id: '1235',
          title: 'Eggs',
          categoryIds: ['1'],
          ingredients: 'Some eggs',
          process: 'Shake the eggs',
          suggestedBy: 'Some other friend',
          tags: 'Main courses',
        },
      ],
    };

    const recipes = await fetchRecipes({});
    expect(recipes).toEqual(expectedResult);
  });

  // TODO: add a test with parameters

  // TODO: add a test with pagination/offset
});
