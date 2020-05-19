const path = require('path');

// eslint-disable-next-line func-names
const URLBuilder = function (baseUrl) {
  this.url = new URL(baseUrl);

  this.append = (urlPart) => {
    if (!urlPart) return this;
    this.url.pathname = path.join(this.url.pathname, urlPart);
    return this;
  };

  this.addParam = (paramName, paramValue) => {
    if (!paramValue) return this;
    this.url.searchParams.set(paramName, paramValue);
    return this;
  };

  this.addParams = (params) => {
    if (!params) return this;
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        this.addParam(key, params[key]);
      }
    });
    return this;
  };

  this.toString = () => this.url.toString();
};

module.exports = {
  URLBuilder,
};
