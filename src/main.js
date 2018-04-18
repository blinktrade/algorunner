const WebSocket = require('faye-websocket').Client;
const fs = require('fs');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const algoDecoder = require('./algo-decoder.js');
const showPerms = require('./show-perms.js');

if (process.argv.length != 4) {
    console.log('wrong number of arguments');
    console.log('must call as:');
    console.log('\t' + process.argv[0] + ' ' + process.argv[1]
                + ' <file.algo> <symbol>');
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

showPerms(algo[0].permissions, function(res) {
    if (!res) {
        console.log('Aborting operation');
        return;
    }

    const screen = blessed.screen({ smartCSR: true });
    screen.title = 'BlinkTrade::AlgoRUNNER';
    let grid = new contrib.grid({
        rows: 2 + algo[0].params.length,
        cols: 2,
        screen: screen
    });

    grid.set(0, 0, 1, 1, blessed.text, {
        content: 'Market: ' + process.argv[3]
    });

    const algoLog = grid.set(0, 1, 1, 1, contrib.log, {
        fg: "green",
        label: 'Algo log'
    });
    //algoLog.log('TODO: use!');

    const formStyle = {
        fg: 'white',
        bg: 'blue',
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    };

    const updateBtn
          = grid.set(algo[0].params.length + 1, 0, 1, 1, blessed.button, {
              content: 'Update',
              style: Object.assign({}, formStyle)
          });

    const pauseBtn
          = grid.set(algo[0].params.length + 1, 1, 1, 1, blessed.button, {
              content: 'Start/stop',
              style: Object.assign({}, formStyle)
          });

    let paramsInput = [];
    let paramsInputIdx = 0;

    for (let i = 0 ; i != algo[0].params.length ; ++i) {
        grid.set(i + 1, 0, 1, 1, blessed.text, {
            content: algo[0].params[i].label,
            _data: algo[0].params[i]
        });
        let e = grid.set(i + 1, 1, 1, 1, blessed.textbox, {
            inputOnFocus: true,
            style: Object.assign({}, formStyle)
        });
        paramsInput.push(e);
    }
    paramsInput.push(updateBtn);
    paramsInput.push(pauseBtn);
    paramsInput[0].focus();

    screen.key(['up', 'down'], function(ch, key) {
        if (key.name == 'up') {
            --paramsInputIdx;
            if (paramsInputIdx < 0)
                paramsInputIdx = 0;
        } else if (key.name == 'down') {
            ++paramsInputIdx;
            if (paramsInputIdx >= paramsInput.length)
                paramsInputIdx = paramsInput.length - 1;
        }

        // Buggy lib... loses focus... misrender... workaround... {{{
        updateBtn.hide();
        updateBtn.show();
        pauseBtn.hide();
        pauseBtn.show();
        // }}}
        paramsInput[paramsInputIdx].focus();
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        screen.destroy();
    });

    screen.render();
    //eval(algo[1]);
    //let obj = eval(algo[0].creator + '()');
    //console.log(typeof(obj));
    //console.log(obj);
});
