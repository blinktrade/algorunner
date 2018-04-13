const WebSocket = require('faye-websocket').Client;
const fs = require('fs');
const blessed = require('blessed');
const algoDecoder = require('./algo-decoder.js');
const showPerms = require('./show-perms.js');

if (process.argv.length != 3) {
    console.log('wrong number of arguments');
    console.log('must call as:');
    console.log('\t' + process.argv[0] + ' ' + process.argv[1]
                + ' <file.algo>');
    process.exit(-1);
}

const algo = algoDecoder(fs.readFileSync(process.argv[2]).toString('utf8'));

if (!Array.isArray(algo[0].permissions)) {
    console.log('invalid `.algo` file');
    process.exit(-1);
}

for (const e of algo[0].permissions) {
    if (typeof(e) != 'string') {
        console.log('invalid `.algo` file');
        process.exit(-1);
    }
}

//screen.title = 'BlinkTrade::AlgoRUNNER';
showPerms(algo[0].permissions, function(res) {
    if (!res) {
        console.log('Aborting operation');
        return;
    }

    console.log('very well');
});
