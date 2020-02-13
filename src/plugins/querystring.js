/* eslint-disable no-underscore-dangle */

'use strict';

const QuerystringParser = require('../parsers/Querystring');

/*
  NOTE: the `options` is also available through the `options` / `formidable.options`
    and it's generally a good idea to always return `this` or so-called `self`
 */
module.exports = function querystringParserPlugin(formidable, options) {
  // the `this` context is always the `formidable` instance,
  // as the first argument of a plugin, but that allows us to customize/test each plugin

  /* istanbul ignore next */
  const self = this || formidable;

  if (/urlencoded/i.test(self.headers['content-type'])) {
    init.call(self, self, options);
  }

  return self;
};

/*
  NOTE: that it's a good practice (but it's up to you) to use the `this.options` instead
    of the passed `options` (second) param, because when you decide
    to test the plugin you can pass custom `this` context to it (and so `this.options`)
 */
function init(_self, _opts) {
  this.type = 'urlencoded';

  const parser = new QuerystringParser(this.options);

  parser.on('data', ({ key, value }) => {
    this.emit('field', key, value);
  });

  parser.once('end', () => {
    this.ended = true;
    this._maybeEnd();
  });

  this._parser = parser;

  return this;
}
