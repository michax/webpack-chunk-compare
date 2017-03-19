#! /usr/bin/env node

var processChildren = require('./util').processChildren;
var _ = require('lodash');
var fs = require('fs');
var minimist = require('minimist');

console.time('Completed in: ');

var argv = minimist(process.argv.slice(2));

if (argv['_'].length < 2) {
    console.error('Missing arguments. Please provide path a and b for json files to compare.')
    return;
}

// Arguments processing

var config = {
    aPath: argv['_'][0],
    bPath: argv['_'][1],
    verbose: argv['verbose'] || false,
    aName: argv['a-name'] || 'a',
    bName: argv['b-name'] || 'b',
    chunkName: argv['chunk-name'] || null,
    loseMatching: argv['lose-matching'] || false,
    childIndex: argv['child-index'],
}

if (!fs.existsSync(config.aPath)) {    
    console.error('Path \'a\' doesn\'t exists: ', config.aPath);    
    return;
}

if (!fs.existsSync(config.bPath)) {
    console.error('Path \'b\' doesn\'t exists: ', config.aPath);    
    return;
}

// Load json files

console.time('Loaded a ('+config.aPath+')');
var aJson = JSON.parse(fs.readFileSync(config.aPath));
console.timeEnd('Loaded a ('+config.aPath+')');

console.time('Loaded b ('+config.bPath+')');
var bJson = JSON.parse(fs.readFileSync(config.bPath));
console.timeEnd('Loaded b ('+config.bPath+')');

// Process children and print differences for all matching modules

processChildren(aJson, bJson, config);

console.timeEnd('Completed in: ');