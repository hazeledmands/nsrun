#!/usr/bin/env node
"use strict"

const cp = require('child_process');
const find = require('lodash.find');
const fs = require('fs');
const minimist = require('minimist');
const path = require('path');

let pkgPath = process.cwd();
let pkgJsonFile = null;
let pkgJson = null;

/** ***************** FIND PACKAGE.JSON ******************/
while (pkgJson === null && path.dirname(pkgPath) !== pkgPath) {
  try {
    pkgJsonFile = path.join(pkgPath, 'package.json');
    pkgJson = require(pkgJsonFile);
  } catch (e) {
    pkgPath = path.dirname(pkgPath);
  }
}
if (pkgJson === null) {
  console.log('Could not find a package.json in the current directory or any parent directories.');
  console.log('Are you in a node project?');
  process.exit(1);
}
const humanReadablePkgPath = `./${path.relative(process.cwd(), pkgJsonFile)}`;

/** **************** PARSE OUT SCRIPTS FROM PACKAGE.JSON ***********/
const scripts = Object.keys(pkgJson.scripts || {}).map(function (name) {
  return {
    name,
    script: pkgJson.scripts[name],
  };
});
if (scripts.length === 0) {
  console.log(`${pkgJsonFile}: no scripts listed.`);
  process.exit(1);
}

/** ************** FIGURE OUT WHAT SCRIPT TO RUN *****************/
const currentProcessPath = process.argv.slice(0, 2).join(' ');
const argv = minimist(process.argv.slice(2));
const args = argv._ || [];
const scriptName = args.shift();
const scriptToRun = find(scripts, {name: scriptName});

/** ************* LIST ALL SCRIPTS ON NO INPUT *******************/
if (!scriptName) {
  console.log(`${scripts.length} scripts in ${humanReadablePkgPath}:`);
  scripts.forEach(function (script) {
    console.log(` * ${script.name}`);
  })
  process.exit(0);
}

/** ************* ERROR ******************************************/
if (!scriptToRun) {
  console.log(`${humanReadablePkgPath}: No script found with name "${scriptName}"`);
  process.exit(1);
}

/** ************* RUN SCRIPT *************************************/
process.env.PATH = path.join(pkgPath, 'node_modules', '.bin') + ':' + process.env.PATH;

// convert npm run-script (and all aliases) to nsrun
scriptToRun.script = scriptToRun.script
  .replace(/npm run-script/g, currentProcessPath)
  .replace(/npm run/g, currentProcessPath)
  .replace(/npm test/g, currentProcessPath + ' test')
  .replace(/npm start/g, currentProcessPath + ' start')
  .replace(/npm stop/g, currentProcessPath + ' stop')
  .replace(/npm restart/g, currentProcessPath + ' restart');

const command = scriptToRun.script + ' ' +
  args.map(function (arg) { return `'${arg}'` }).join(' ');

const child = cp.exec(command);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on('error', function (err) { console.error(err.stack); });
child.on('exit', function (code, signal) { process.exit(code); });

[
  'SIGUSR1',
  'SIGTERM',
  'SIGINT',
  'SIGPIPE',
  'GITHUP',
  'SIGBREAK',
  'SIGWINCH'
].map(function (signal) {
  process.on(signal, function () {
    child.kill(signal);
  });
});
