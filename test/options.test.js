'use strict';

const parseOptions = require('../lib');
const Options = require('../lib/options');

describe('argv', () => {
  test('loads defaults', () => {
    process.argv = ['', '', '1', '2', '3'];
    let opts = new Options();
    expect(opts.argv).toEqual(['1', '2', '3']);
  });

  test('parses string config', () => {
    let opts = new Options(`command $file|f @size|s #age|a @t path`, []);
    expect(opts.config).toEqual({
      commands: ['command', 'path'],
      arguments: {
        file: {
          aliases: ['file', 'f'],
          type: 'string',
        },
        size: {
          aliases: ['size', 's'],
          type: 'boolean',
        },
        age: {
          aliases: ['age', 'a'],
          type: 'number',
        },
        t: {
          aliases: ['t'],
          type: 'boolean',
        },
      },
    });
  });

  test('parses arguments', () => {
    let opts = new Options(null, [
      ``,
      ``,
      'run',
      'file',
      `-f`,
      `FILENAME`,
      `--size`,
      `--name`,
      `JOHN`,
      `-s=SEARCH`,
      `--email='THIS IS EMAIL'`,
      `-t`,
    ]);
    expect(opts.parseOptions()).toEqual({
      $commands: ['run', 'file'],
      f: 'FILENAME',
      size: true,
      name: 'JOHN',
      s: 'SEARCH',
      email: 'THIS IS EMAIL',
      t: true,
    });
  });

  test('parses options', () => {
    let opts = new Options(
      `command from $file|f #age|a @search|s $email|e @tree|t path`,
      [
        ``,
        ``,
        `run`,
        `-f`,
        `FILENAME`,
        `--age`,
        `30`,
        `FROM`,
        `-s=SEARCH`,
        `--email='THIS IS EMAIL'`,
        `-t`,
        `PATH`,
      ]
    );
    expect(opts.parseOptions()).toEqual({
      $commands: ['run', 'FROM', 'PATH'],
      command: 'run',
      from: 'FROM',
      path: 'PATH',
      file: 'FILENAME',
      age: 30,
      search: 'SEARCH',
      email: 'THIS IS EMAIL',
      tree: true,
    });
  });

  test('parses options index', () => {
    expect(
      parseOptions(
        `command from $file|f #age|a @search|s $email|e @tree|t path`,
        [
          ``,
          ``,
          `run`,
          `-f`,
          `FILENAME`,
          `--age`,
          `30`,
          `FROM`,
          `-s=SEARCH`,
          `--email='THIS IS EMAIL'`,
          `-t`,
          `PATH`,
        ]
      )
    ).toEqual({
      $commands: ['run', 'FROM', 'PATH'],
      command: 'run',
      from: 'FROM',
      path: 'PATH',
      file: 'FILENAME',
      age: 30,
      search: 'SEARCH',
      email: 'THIS IS EMAIL',
      tree: true,
    });
  });

  test('example', () => {
    expect(
      parseOptions(`command file @minimize|min|m #limit|lim|l $exclude|e`, [
        `node`,
        `app.js`,
        `copy`,
        `-m`,
        `--lim`,
        `5`,
        `--exclude='node_modules'`,
        `test.txt`,
      ])
    ).toEqual({
      $commands: ['copy', 'test.txt'],
      command: 'copy',
      file: 'test.txt',
      minimize: true,
      limit: 5,
      exclude: 'node_modules',
    });
  });

  test('other example', () => {
    expect(
      parseOptions(`from to @recursive|r $exclude|e`, [
        `node`,
        `app.js`,
        `./source/`,
        `./dest/`,
        `--exclude`,
        `'node_modules'`,
      ])
    ).toEqual({
      $commands: ['./source/', './dest/'],
      from: './source/',
      to: './dest/',
      recursive: false,
      exclude: 'node_modules',
    });
  });

  test('applies handlers', () => {
    expect(
      parseOptions(
        'root $output|o',
        ['node', 'app.js', 'test/root', '-o', 'test/output'],
        {
          root(val) {
            return 'work/' + val;
          },
          output(val) {
            return 'static/' + val;
          },
        }
      )
    ).toEqual({
      $commands: ['test/root'],
      root: 'work/test/root',
      output: 'static/test/output',
    });
  });
});
