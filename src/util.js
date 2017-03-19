var _ = require('lodash');

function printDifference(a, b, aName = 'a', bName = 'b', verbose = false) {    
    var aNames = _.map(a, 'name');
    var bNames = _.map(b, 'name');

    var bAdditions = _.difference(bNames, aNames);
    var aAdditions = _.difference(aNames, bNames);

    console.log('');
    console.log('What "'+bName+'" have that "'+aName+'" doesn\'t');
    console.log('--------------');
    console.log(bAdditions);
    console.log('');

    console.log('What "'+aName+'" have that "'+bName+'" doesn\'t.');
    console.log('--------------');
    console.log(aAdditions);
    console.log('');

    if (verbose) {
        console.log('Details of what "'+aName+'" have that "'+bName+'" doesn\'t');
        console.log('--------------');
        var details = _.map(bAdditions, (name) => _.find(b, {name: name}));
        console.log(details);    
        console.log('');
    }
}

function chunkReport(aChunk, bChunk, title = 'App', aName = 'a', bName = 'b', verbose = false) {
    console.log('--------------------');
    console.log('-- ', title);
    console.log('--------------------');
    console.log('');

    printDifference(aChunk.modules, bChunk.modules, aName, bName, verbose);
}

module.exports = {
    printDifference,
    chunkReport
};