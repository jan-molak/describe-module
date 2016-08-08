# Describe module

[![Build Status](https://travis-ci.org/jan-molak/describe-module.svg?branch=master)](https://travis-ci.org/jan-molak/describe-module)
[![Coverage Status](https://coveralls.io/repos/github/jan-molak/describe-module/badge.svg)](https://coveralls.io/github/jan-molak/describe-module)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Install

```
$ npm install --save describe-module
```

## Usage

Describe Module can tell you a couple of things about other node.js modules that live on the same machine.
It can discover where a given module's been installed and if it's global, local, or under development.

For TypeScript projects load it using:
```ts
import { describe } from 'describe-module';
```

and for the JavaScript ones:
```js
var describe = require('describe-module').default
```

### Global Modules

A global module is the one installed with the `-g` switch. If we wanted to find out more about `grunt` for example:

```
$ npm install -g grunt
```

```js
var describe = require('describe-module').default

console.log(describe('grunt'));
```

```
{ name: 'grunt',
  path: '/usr/local/lib/node_modules/grunt',
  mode: 'global' }
```

### Local Modules

A local module is the one that lives under the `node_modules` directory, for example:


```
$ npm install --save describe-module
```

```js
var describe = require('describe-module').default

console.log(describe('describe-module'));
```

```
{ name: 'describe-module',
  path: '/home/jan/demo-project/node_modules/describe-module',
  mode: 'local' }
```

### Dev Modules

A dev module is the one you're currently developing ;-) So assuming that you're developing a `my-awesome-module` and
placed it under `/home/awesomedev/projects/my-awesome-module`:

```js
console.log(describe('my-awesome-module'));
```

```
{ name: 'my-awesome-module',
  path: '/home/awesomedev/projects/my-awesome-module',
  mode: 'dev' }
```

## Your feedback matters!

Do you find Describe Module useful? [Give it a star](https://github.com/jan-molak/describe-module)! &#9733;

Found a bug? Raise [an issue](https://github.com/jan-molak/describe-module/issues?state=open)
or submit a pull request.

Have feedback? Let me know on twitter: [@JanMolak](https://twitter.com/JanMolak)