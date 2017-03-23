var _ = require('lodash');

function printDifference(a, b, aName = 'a', bName = 'b', verbose = false) {    
    var aNames = _.map(a, 'name');
    var bNames = _.map(b, 'name');

    var bAdditions = _.difference(bNames, aNames);
    var aAdditions = _.difference(aNames, bNames);

    console.log('What "'+bName+'" have that "'+aName+'" doesn\'t');
    console.log('--------------');
    console.log(bAdditions);
    console.log('\n');

    console.log('What "'+aName+'" have that "'+bName+'" doesn\'t.');
    console.log('--------------');
    console.log(aAdditions);
    console.log('\n');

    if (verbose) {
        console.log('Details of what "'+aName+'" have that "'+bName+'" doesn\'t');
        console.log('--------------');
        var details = _.map(bAdditions, (name) => _.find(b, {name: name}));
        console.log(details);    
    }
}

function chunkReport(aChunk, bChunk, title = 'App', aName = 'a', bName = 'b', verbose = false) {
    console.log('--------------------');
    console.log('-- ', title);
    console.log('--------------------');
    console.log('\n');

    printDifference(aChunk.modules, bChunk.modules, aName, bName, verbose);
}

function processChild(aChild, bChild, config) {
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
}

function processChildren(aJson, bJson, config) {
    for(var c = 0; c < bJson.children.length; c++) {
        if (!_.isNil(config.childIndex) && c !== config.childIndex) {
            continue;
        }

        var bChild = bJson.children[c];
        var entrypoints = bChild.entrypoints;
        
        if (config.loseMatching) {
            aChildIndex = c;
        } else {
            aChildIndex = _.findIndex(aJson.children, (aItem) => {
                return _.isEqual(aItem.entrypoints, bChild.entrypoints);
            });
        }

        if (aChildIndex === -1) {
            console.warn('Matching child not found for entrypoints: ', entrypoints, '. Use --lose-matching to skip this check.');
            continue;
        }

        processChild(aJson.children[aChildIndex], bChild, config);
    }
}

module.exports = {
    printDifference,
    chunkReport,
    processChild,
    processChildren
};