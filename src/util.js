var _ = require('lodash');

/**
 * Identifier separator
 * @type {RegExp}
 */
const separator = /\?\?ref--0!|\s/;

function printDifference(a, b, aName = 'a', bName = 'b', verbose = false) {    
    var aNames = _.map(a, 'identifier');
    var bNames = _.map(b, 'identifier');

    var aCombined = aNames.join(' ')
    var bCombined = bNames.join(' ')

    var bAdditions = _.difference(bNames, aNames);
    var aAdditions = _.difference(aNames, bNames);

    var bDiff = _.difference(bCombined.split(separator), aCombined.split(separator));
    bDiff = _.map(bDiff, (data) => {
        const linked = _.find(b, (i) => i.identifier.indexOf(data) !== -1);
        if (linked) {
            return { import: data, issuer: linked.issuerName, size: linked.size };
        }
        return data;
    });

    console.log('What "'+bName+'" have that "'+aName+'" doesn\'t');
    console.log('--------------');
    console.log(JSON.stringify(bDiff, null, 4));
    console.log('\n');

    var aDiff = _.difference(aCombined.split(separator), bCombined.split(separator));
    aDiff = _.map(aDiff, (data) => {
        const linked = _.find(a, (i) => i.identifier.indexOf(data) !== -1);
        if (linked) {
            return { import: data, issuer: linked.issuerName, size: linked.size };
        }
        return data;
    });

    console.log('What "'+aName+'" have that "'+bName+'" doesn\'t.');
    console.log('--------------');
    console.log(JSON.stringify(aDiff, null, 4));
    console.log('\n');
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

        if (aChunkIndex === -1) {
            continue;
        }

        var aChunk = aChild.chunks[aChunkIndex];
        var title = _.capitalize(bName);
        chunkReport(aChunk, bChunk, title, config.aName, config.bName, config.verbose);
    }
}

function normalizeLegacy(aJson, bJson) {
    const out = {
        aJson,
        bJson,
    };

    if (
        (!bJson.children || bJson.children.length === 0) &&
        (bJson.chunks && bJson.chunks.length > 0)
    ) {
        out.bJson = {
            children: [
                {
                    chunks: bJson.chunks,
                    entrypoints: bJson.entrypoints,
                },
            ]
        };
    }

    if (
        (!aJson.children || aJson.children.length === 0) &&
        (aJson.chunks && aJson.chunks.length > 0)
    ) {
        out.aJson = {
            children: [
                {
                    chunks: aJson.chunks,
                    entrypoints: aJson.entrypoints,
                },
            ]
        };
    }

    return out;
}

function processChildren(aJsonData, bJsonData, config) {
    const {
        aJson,
        bJson,
    } = normalizeLegacy(aJsonData, bJsonData);

    for(var i = 0; i < bJson.children.length; i++) {
        if (!_.isNil(config.childIndex) && i !== config.childIndex) {
            continue;
        }

        var bChild = bJson.children[i];
        var entrypoints = bChild.entrypoints;
        
        if (config.loseMatching) {
            aChildIndex = i;
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