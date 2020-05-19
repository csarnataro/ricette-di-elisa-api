const { logSanitizedUrl } = require('./log-sanitized-url.js');

describe('logSanitizedUrl', () => {
  it('should not modify safe URLs', () => {
    const url = 'https://www.example.com';
    expect(logSanitizedUrl(url)).toBe(url);
  });

  it('should sanitize URLs with confidential info', () => {
    const url = 'https://api.airtable.com/v0/app1234567890ABCD/TableName/?api_key=keyabcd1234567890';
    const sanitizedUrl = 'https://api.airtable.com/v0/app****/TableName/?api_key=key****';

    expect(logSanitizedUrl(url)).toBe(sanitizedUrl);
  });

  it('should sanitize URLs with confidential info and additional params', () => {
    const url = 'https://api.airtable.com/v0/app1234567890ABCD/Table?api_key=keyabcd1234567890&sort[0][field]=Name&sort[0][direction]=desc&filterByFormula=(FIND({Categoria}%2C%22Primi%22)%3E0)';

    const sanitizedUrl = 'https://api.airtable.com/v0/app****/Table?api_key=key****&sort[0][field]=Name&sort[0][direction]=desc&filterByFormula=(FIND({Categoria}%2C%22Primi%22)%3E0)';

    expect(logSanitizedUrl(url)).toBe(sanitizedUrl);
  });
});
