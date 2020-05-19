const { URLBuilder } = require('./url-builder');

describe('URLBuilder', () => {
  it('should append 1 value to the base URL', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .toString();
    const expectedUrl = 'https://www.example.com/v0/some-path';
    expect(url).toBe(expectedUrl);
  });

  it('should append 2 values to the base URL', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .append('some-other-piece')
      .toString();
    const expectedUrl = 'https://www.example.com/v0/some-path/some-other-piece';
    expect(url).toBe(expectedUrl);
  });
  it('should not append undefined values to the base URL', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append()
      .toString();
    const expectedUrl = 'https://www.example.com/v0';
    expect(url).toBe(expectedUrl);
  });

  it('should not append undefined values, if combined with valid values', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append()
      .append('a-valid-piece')
      .toString();
    const expectedUrl = 'https://www.example.com/v0/a-valid-piece';
    expect(url).toBe(expectedUrl);
  });
  it('should append 1 query string param to the base URL', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .addParam('url_key', 'abcd')
      .toString();
    const expectedUrl = 'https://www.example.com/v0/some-path?url_key=abcd';
    expect(url).toBe(expectedUrl);
  });
  it('should append 2 query string params to the base URL', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .addParam('url_key', 'abcd')
      .addParam('offset', '1')
      .toString();
    const expectedUrl = 'https://www.example.com/v0/some-path?url_key=abcd&offset=1';
    expect(url).toBe(expectedUrl);
  });
  it('should append a list of params taken from the input object', () => {
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
      url_key: 'abcd',
      offset: '1',
    };

    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .addParams(additionalQueryParams)
      .toString();
    const expectedUrl = encodeURI('https://www.example.com/v0/some-path?sort[0][field]=Name&sort[0][direction]=asc&url_key=abcd&offset=1');
    expect(url).toBe(expectedUrl);
  });

  it('should append only valid params from the input object', () => {
    const additionalQueryParams = {
      'sort[0][field]': 'Name',
      'sort[0][direction]': 'asc',
      url_key: null,
      offset: '1',
    };

    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .addParams(additionalQueryParams)
      .toString();
    const expectedUrl = encodeURI('https://www.example.com/v0/some-path?sort[0][field]=Name&sort[0][direction]=asc&offset=1');
    expect(url).toBe(expectedUrl);
  });

  it('should append a list of params only if the input object is defined', () => {
    const url = new URLBuilder('https://www.example.com/v0')
      .append('some-path')
      .addParams()
      .toString();
    const expectedUrl = encodeURI('https://www.example.com/v0/some-path');
    expect(url).toBe(expectedUrl);
  });
});
