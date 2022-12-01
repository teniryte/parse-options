'use strict';

const Options = require('./options');

module.exports = (config = '', argv = [], handlers = {}) => {
  let opts = new Options(config, argv, handlers);
  return opts.parseOptions();
};
