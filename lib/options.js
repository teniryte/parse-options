'use strict';

const CONFIG_TYPES = {
  $: 'string',
  '@': 'boolean',
  '#': 'number',
};

class Options {
  args = null;
  commands = null;
  handlers = {};

  static parseArgument(arg) {
    if (!arg.startsWith('-')) return null;
    let content = arg.replace(/^\-+/gim, ''),
      name = content.split('=')[0],
      value = Options.parseValue(content.split('=')[1] || '');
    return {
      name,
      value,
    };
  }

  static parseValue(value) {
    return value.replace(/(^\')|(\'$)|(^\")|(\"$)/gim, '');
  }

  static parseStringConfig(value) {
    let config = {
      commands: [],
      arguments: {},
    };
    value.split(' ').forEach(arg => {
      if (!arg) return;
      let isArgument = false;
      Object.keys(CONFIG_TYPES).forEach(flag => {
        let type = CONFIG_TYPES[flag];
        if (!arg.startsWith(flag)) return;
        let aliases = arg.slice(1).split('|');
        config.arguments[aliases[0]] = { aliases, type };
        isArgument = true;
      });
      if (isArgument) return;
      config.commands.push(arg);
    });
    return config;
  }

  static parseConfig(data) {
    if (typeof data === 'string') return Options.parseStringConfig(data);
    return data;
  }

  constructor(config = null, argv = Array.from(process.argv), handlers = {}) {
    this.argv = argv.slice(2);
    this.config = Options.parseConfig(config);
    this.handlers = handlers;
  }

  getArgumentName(alias) {
    let argumentName = null;
    Object.keys(this.config.arguments).forEach(name => {
      let config = this.config.arguments[name];
      if (argumentName || !config.aliases.includes(alias)) return;
      argumentName = name;
    });
    return argumentName;
  }

  parseOptions() {
    let config = this.config;
    if (!config) return this.parseArguments();
    let options = { $commands: [] },
      argName = null;
    this.argv.forEach(val => {
      if (val.startsWith('-')) {
        let alias = val.replace(/^\-+/gim, '').split('=')[0],
          name = this.getArgumentName(alias),
          type = config.arguments[name].type;
        if (val.includes('=')) {
          let value = Options.parseValue(
            val.replace(/^\-+/gim, '').split('=')[1]
          );
          return (options[name] = type === 'number' ? +value : value);
        }
        if (type === 'boolean') {
          return (options[name] = true);
        }
        return (argName = val.replace(/^\-+/gim, ''));
      }
      if (argName) {
        let name = this.getArgumentName(argName),
          type = config.arguments[name].type,
          value = Options.parseValue(val);
        options[name] = type === 'number' ? +value : value;
        return (argName = null);
      }
      let commandIndex = options.$commands.length,
        commandName = config.commands[commandIndex];
      options[commandName] = val;
      options.$commands.push(val);
    });
    Object.keys(config.arguments).forEach(name => {
      let type = config.arguments[name].type;
      if (options.hasOwnProperty(name)) return;
      options[name] = { string: null, number: null, boolean: false }[type];
    });
    return this.handleOptions(options);
  }

  handleOptions(options) {
    Object.keys(this.handlers).forEach(name => {
      const handler = this.handlers[name];
      options[name] = handler(options[name]);
    });
    return options;
  }

  parseArguments() {
    if (this.args) return this.args;
    let args = { $commands: [] },
      argName = null;
    this.argv.forEach(val => {
      let arg = Options.parseArgument(val);
      if (arg) {
        if (arg.value) {
          args[arg.name] = arg.value;
          return (argName = null);
        }
        if (argName) {
          args[argName] = true;
        }
        return (argName = arg.name);
      }
      if (argName) {
        args[argName] = val;
        argName = null;
        return;
      }
      args.$commands.push(val);
    });
    if (argName) {
      args[argName] = true;
    }
    this.args = args;
    return args;
  }
}

module.exports = Options;
