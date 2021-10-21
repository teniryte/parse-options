'use strict';

const Options = require('./options');

module.exports = (config, argv) => {
  let opts = new Options(config, argv);
  return opts.parseOptions();
};
