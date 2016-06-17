#!/usr/bin/env node
"use strict"

const find = require('lodash.find');
const fs = require('fs');
const kexec = require('kexec');
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
const argv = minimist(process.argv.slice(2));
const args = argv._ || [];
const scriptName = args.shift();
const scriptToRun = find(scripts, {name: scriptName});

/** ************* LIST ALL SCRIPTS ON NO INPUT *******************/
if (!scriptToRun) {
  console.log(`${scripts.length} scripts in ${humanReadablePkgPath}:`);
  scripts.forEach(function (script) {
    console.log(` * ${script.name}`);
  })
  process.exit(0);
}

/** ************* RUN SCRIPT *************************************/
if (scriptToRun) {
  process.env.PATH = path.join(pkgPath, 'node_modules', '.bin') + ':' + process.env.PATH;

  // convert npm run-script (and all aliases) to nsrun
  scriptToRun.script = scriptToRun.script
    .replace(/npm run-script/g, 'nsrun')
    .replace(/npm run/g, 'nsrun')
    .replace(/npm test/g, 'nsrun test')
    .replace(/npm start/g, 'nsrun start')
    .replace(/npm stop/g, 'nsrun stop')
    .replace(/npm restart/g, 'nsrun restart');

  kexec(scriptToRun.script + ' ' + args.map(function (arg) { return `'${arg}'` }).join(' '));
}

/** ************* ERROR ******************************************/
console.log(`${humanReadablePkgPath}: No script found with name "${scriptName}"`);
process.exit(1);
