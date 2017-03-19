#! /usr/bin/env node

var { printDifference, chunkReport } = require('./util');
var _ = require('lodash');
var fs = require('fs');
var minimist = require('minimist');

console.time('Completed in: ');

var argv = minimist(process.argv.slice(2));

if (argv['_'].length < 2) {
    console.error('Missing arguments. Please provide path a and b for json files to compare.')
    return;
}

var config = {
    aPath: argv['_'][0],
    bPath: argv['_'][1],
    verbose: argv['verbose'] || false,
    aName: argv['a-name'] || 'a',
    bName: argv['b-name'] || 'b',
    chunkName: argv['chunk-name'] || null,
}

if (!fs.existsSync(config.aPath)) {    
    console.error('Path \'a\' doesn\'t exists: ', config.aPath);    
    return;
}

if (!fs.existsSync(config.bPath)) {
    console.error('Path \'b\' doesn\'t exists: ', config.aPath);    
    return;
}

console.time('Loaded a ('+config.aPath+')');
var aJson = JSON.parse(fs.readFileSync(config.aPath));
console.timeEnd('Loaded a ('+config.aPath+')');

console.time('Loaded b ('+config.bPath+')');
var bJson = JSON.parse(fs.readFileSync(config.bPath));
console.timeEnd('Loaded b ('+config.bPath+')');

var bChild = bJson.children[0];
var aChild = aJson.children[0];

console.log('');

for(var i = 0; i < bChild.chunks.length; i++) {
    var bNames = bChild.chunks[i].names;
    var bName = _.first(bNames);
    var bChunk = bChild.chunks[i];

    if (config.chunkName && _.lowerCase(bName) !== _.lowerCase(config.chunkName)) {
        continue;
    }

    var aChunkIndex = _.findIndex(aChild.chunks, (item) => {
        return _.isEqual(item.names, bNames);
    });

    if (aChunkIndex == -1) {
        continue;
    }

    var aChunk = aChild.chunks[aChunkIndex];
    var title = _.capitalize(bName);
    chunkReport(aChunk, bChunk, title, config.aName, config.bName, config.verbose);
}

console.timeEnd('Completed in: ');