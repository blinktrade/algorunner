const fs = require('fs');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const algoDecoder = require('./algo-decoder.js');
const getCredentials = require('./get-credentials.js');
const showPerms = require('./show-perms.js');
const runner = require('./runner');
const util = require('util');
const BlinkTradeWS = require('blinktrade').BlinkTradeWS;

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

(async function() {
    let apikey, pass;
    try {
        await util.promisify(showPerms)(algo[0].permissions);
        const cred = await util.promisify(getCredentials)();
        apikey = cred.apikey;
        pass = cred.pass;
    } catch (e) {
        console.log('Aborting operation');
        return;
    }

    const blinktrade = new BlinkTradeWS({
        //url: 'wss://bitcambio_api.blinktrade.com/trade/',
        //brokerId: 11
        url: 'https://api_testnet.blinktrade.com/trade/',
        brokerId: 5
    });
    try {
        await blinktrade.connect();
        await blinktrade.login({ username: 'rodrigo', password: 'abc12345' });
        //await blinktrade.login({ username: apikey, password: pass });
    } catch (e) {
        console.log('Error while trying to login in the BlinkTrade service:');
        console.log(e);
        return;
    }

    const application = {
        sendBuyLimitedOrder: function(qty, price, opt_clientOrderId) {
            blinktrade.sendOrder({
                side: "1",
                price: price,
                amount: qty,
                symbol: this.getMarket(),
                clientId: opt_clientOrderId
            });
        },
        sendSellLimitedOrder: (qty, price, opt_clientOrderId) => {
            blinktrade.sendOrder({
                side: "2",
                price: price,
                amount: qty,
                symbol: this.getMarket(),
                clientId: opt_clientOrderId
            });
        },
        cancelOrder: (opt_clientOrderId, opt_orderId) => {
            blinktrade.cancelOrder({
                orderId: opt_orderId,
                clientId: opt_clientOrderId
            });
        },
        cancelAllOrders: () => {
            blinktrade.cancelOrder({
                side: "1"
            });
            blinktrade.cancelOrder({
                side: "2"
            });
        },
        getOrderBook: function() {
            return this._orderBook;
        },
        getBalance: function(currency, type) {
            return this._balance;
        },
        getTrades: function() {
            return this._trades;
        },
        getParameters: function() {
            return this._params;
        },
        getOpenOrders: function() {
            return this._openOrders;
        },
        getMarket: function() {
            return process.argv[3];
        },
        getInstanceID: () => { return "node:0" },
        stop: (opt_error_message) => {
            // TODO
        },
        _orderBook: {},
        _balance: {},
        _trades: {},
        _params: {},
        _openOrders: {}
    };

    const algoManager = {
        _started: false,
        _paused: false,
        toggle: function() {
            if (!this._started) {
                this._algo = runner.getAlgoObj(
                    algo[1], algo[0].creator, application, process.argv[3]
                );
                this._algo.start(application.getParameters());
                this._started = true;
                return;
            }

            this._paused = !this._paused;
        },
        uiLabel: function() {
            if (this._paused) {
                return 'Resume';
            } else {
                return 'Pause';
            }
        },
        onBalanceUpdate: function(currency, balance, balance_type) {
            if (this._algo == null) {
                return;
            }

            this._algo.onBalanceUpdate(currency, balance, balance_type);
        }
    };

    blinktrade.subscribeOrderbook([process.argv[3]], (orderBookMsg) => {
        // TODO: actually... it's not like this
        application._orderBook = orderBook;
    });

    blinktrade.balance(null, (balance) => {
        application._balance = balance;
        // TODO: PAREI AQUI
        onBalanceUpdate(currency, balance, balance_type);
    });

    // TODO: trades
    //blinktrade.

    {
        // TODO: open orders
        console.log('Getting current open orders...');
        let cur_open_orders
            = await blinktrade.myOrders({ filter: ['has_leaves_qty eq 1'] });
        console.log(cur_open_orders);
        blinktrade.disconnect();
        return;
        // TODO...
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
        label: 'Notifications'
    });

    application.showNotification = (
        title, description, notification_type = "info"
    ) => {
        algoLog.log('[' + notification_type + '] ' + title + ': '
                    + description);
    };

    const formStyle = {
        fg: 'white',
        bg: 'blue',
        focus: {
            bg: 'red'
        }
    };
    const btnStyle = Object.assign({}, formStyle);
    btnStyle.focus = Object.assign({}, btnStyle.focus);
    btnStyle.focus.blink = true;

    const updateBtn
          = grid.set(algo[0].params.length + 1, 0, 1, 1, blessed.button, {
              content: 'Update',
              style: Object.assign({}, btnStyle)
          });

    const pauseBtn
          = grid.set(algo[0].params.length + 1, 1, 1, 1, blessed.button, {
              content: 'Start',
              style: Object.assign({}, btnStyle)
          });

    pauseBtn.on('press', () => {
        algoManager.toggle();
        pauseBtn.setText(algoManager.uiLabel());
        screen.render();
    });

    let paramsInput = [];
    let paramsInputIdx = 0;

    for (let i = 0 ; i != algo[0].params.length ; ++i) {
        grid.set(i + 1, 0, 1, 1, blessed.text, {
            content: algo[0].params[i].label,
            _data: algo[0].params[i]
        });
        let input = grid.set(i + 1, 1, 1, 1, blessed.textbox, {
            inputOnFocus: true,
            style: Object.assign({}, formStyle)
        });
        input.on('action', () => {
            application.getParameters()[algo[0].params[i].name] = input.value;
        });
        application.getParameters()[algo[0].params[i].name]
            = algo[0].params[i].value;
        input.setValue(algo[0].params[i].value);
        paramsInput.push(input);
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
        if (algoManager._algo != null) {
            algoManager._algo.stop();
        }
        screen.destroy();
    });

    screen.render();
})();

process.on('unhandledRejection', (e, p) => console.error(e.stack || e));
