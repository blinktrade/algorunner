const blessed = require('blessed');
const contrib = require('blessed-contrib');
module.exports = function(perms, cb) {
    const screen = blessed.screen({ smartCSR: true });
    const grid = new contrib.grid({ rows: 2, cols: 2, screen: screen });
    let box = grid.set(0, 0, 1, 2, blessed.box, {
        style: {
            fg: 'white',
            bg: 'cyan'
        },
        alwaysScroll:true,
        scrollable: true,
        scrollbar: {
            style: {
                bg: 'inverse'
            }
        },
        content: 'This app is asking for the following permissions. Do you want'
            + ' to run it?\n'
            + '\n'
            + perms.map(e => {
                if (e == 'notification') {
                    return 'Show notifications';
                } else if (e == 'balance') {
                    return 'See your balances';
                } else if (e == 'execution_report') {
                    return 'Listen to the execution reports from your orders';
                } else if (e == 'new_order_limited') {
                    return 'Send limited orders';
                } else if (e == 'cancel_order') {
                    return 'Cancel orders';
                } else {
                    return e;
                }
            }).map(e => '• ' + e).join('\n')
    });

    let submit = grid.set(1, 0, 1, 1, blessed.button, {
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        shrink: true,
        name: 'submit',
        content: 'Yes!',
        style: {
            fg: 'white',
            bg: 'blue',
            focus: {
                bg: 'red'
            },
            hover: {
                bg: 'red'
            }
        }
    });

    let cancel = grid.set(1, 1, 1, 1, blessed.button, {
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        shrink: true,
        name: 'cancel',
        content: 'Cancel!',
        style: {
            fg: 'white',
            bg: 'blue',
            focus: {
                bg: 'red'
            },
            hover: {
                bg: 'red'
            }
        }
    });

    submit.on('press', function() {
        screen.destroy();
        cb(true);
    });

    cancel.on('press', function() {
        screen.destroy();
        cb(false);
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        screen.destroy();
        cb(false);
    });

    screen.key(['down', 'up'], function(ch, key) {
        if (key.name == 'up') {
            box.scroll(-1);
        } else if (key.name == 'down') {
            box.scroll(1);
        }
        screen.render();
    });

    screen.key(['left', 'right'], function(ch, key) {
        if (key.name == 'left') {
            submit.focus();
        } else if (key.name == 'right') {
            cancel.focus();
        }
    });

    screen.key('tab', function(ch, key) {
        form.focusNext();
    });

    cancel.focus();
    screen.render();
};