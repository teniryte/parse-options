[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/teniryte/parse-options/graphs/commit-activity) [![Maintaner](https://img.shields.io/badge/Maintainer-teniryte-blue)](https://img.shields.io/badge/maintainer-teniryte-blue) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://parse-options.sencort.com/) [![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)](http://commonmark.org) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![GitHub license](https://img.shields.io/github/license/teniryte/parse-options.svg)](https://github.com/teniryte/parse-options/blob/master/LICENSE) [![Profile views](https://gpvc.arturio.dev/teniryte)](https://gpvc.arturio.dev/teniryte) [![GitHub contributors](https://img.shields.io/github/contributors/teniryte/parse-options.svg)](https://GitHub.com/teniryte/parse-options/graphs/contributors/) [![GitHub issues](https://img.shields.io/github/issues/teniryte/parse-options.svg)](https://GitHub.com/teniryte/parse-options/issues/)

[![GitHub forks](https://img.shields.io/github/forks/teniryte/parse-options.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/teniryte/parse-options/network/) [![GitHub stars](https://img.shields.io/github/stars/teniryte/parse-options.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/teniryte/parse-options/stargazers/) [![GitHub watchers](https://img.shields.io/github/watchers/teniryte/parse-options.svg?style=social&label=Watch&maxAge=2592000)](https://GitHub.com/teniryte/parse-options/watchers/) [![GitHub followers](https://img.shields.io/github/followers/teniryte.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/teniryte?tab=followers)

# parse-options

Parse Command Line Options

- [parse-options](#parse-options)
  - [Installation](#installation)
  - [Example](#example)
  - [Using](#using)
    - [Pattern](#pattern)
      - [Parameters](#parameters)
      - [Commands](#commands)
  - [Other Example](#other-example)

## Installation

```sh
npm install parse-options;
```

or

```sh
yarn add parse-options;
```

## Example

**Command:**

```sh
node app.js copy -m --lim 5 --exclude 'node_modules' test.txt
```

`app.js`:

```js
const parseOptions = require('parse-options');

let options = parseOptions(
  // Example pattern.
  // Contains two commands (command="copy", file="test.txt")
  // and three parameters (boolean minimize=true, number limit=5
  // and string exclude="node_modules")
  `command file @minimize|min|m #limit|lim|l $exclude|e`,
  // Command line arguments
  process.argv,
  // Handlers applied after parsing
  {
    file => path.resolve(process.env, file),
  }
);

options === {
  // Commands list
  $commands: ['copy', 'test.txt'],
  // Named commands values
  command: 'copy',
  file: 'test.txt',
  // Named parameters
  minimize: true,
  limit: 5,
  exclude: 'node_modules',
};
```

## Using

```js
const parseOptions = require('parse-options');

let options = parseOptions([pattern], [argv]);
```

### Pattern

**Pattern** is a template string, defining options names and types. Pattern can contain **commands** list (values, defined by position) and named parameters with types.

You can **omit** pattern by specifying `null` as first argument. This will parse all arguments as strings or booleans by default.

#### Parameters

To define simple string named parameter (for example, for parsing `--file 'test.txt'`), specify the following pattern:

```txt
$file|f
```

That pattern defines argument named `file`, which is parsing from argv parameter `--file VALUE`, `-f VALUE`, `--file=VALUE`, or `-f=VALUE`.

Boolean and number parameters is defining the same way:

```txt
@minimize|min|m #age|a
```

The code above defines two parameters: boolean `minimize` with aliases `minimize`, `min` and `m`, and `age` with aliases `age` and `a`.

#### Commands

Command is a string value, gived as a positioned argument to the CLI. For, example, the following code contains two command values: `copy` and `test.txt`:

```sh
node app.js copy -a text.txt;
```

Commands can be specified in any order. For example, the code above will be parsed with **pattern** `action filename @all|a` as

```js
{
  $commands: ['copy', 'text.txt'],
  action: 'copy',
  filename: 'text.txt',
  all: true,
}
```

## Other Example

**Pattern:**

```txt
from to @recursive|r $exclude|e;
```

**Command Line:**

```sh
node app.js ./source/ ./dest/ --exclude 'node_modules';
```

**Result:**

```js
{
  $commands: ['./source/', './dest/'],
  from: './source/',
  to: './dest/',
  recursive: false,
  exclude: 'node_modules',
}
```
