const blessed = require('blessed');
const contrib = require('blessed-contrib');

module.exports = function(cb) {
    const screen = blessed.screen({ smartCSR: true });
    const form = blessed.form({
        parent: screen,
        keys: true,
        left: 0,
        top: 0,
        bg: 'black'
    });

    blessed.box({
        parent: screen,
        top: 0,
        left: 'center',
        content: 'Credentials',
        bg: 'black',
        fg: 'white',
        height: 1
    });

    const apikey = blessed.textbox({
        parent: form,
        keys: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 1,
        height: 1,
        name: 'apikey',
        content: 'apikey',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: {
                bg: 'red'
            }
        }
    });

    apikey.setValue('username/APIkey');

    const pass = blessed.textbox({
        parent: form,
        keys: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 2,
        height: 1,
        name: 'pass',
        content: 'pass',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: {
                bg: 'red'
            }
        },
        censor: '*'
    });

    pass.setValue('password');

    const submit = blessed.button({
        parent: form,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 3,
        name: 'submit',
        content: 'submit',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: {
                bg: 'red'
            }
        }
    });

    const cancel = blessed.button({
        parent: form,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 4,
        name: 'cancel',
        content: 'cancel',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: {
                bg: 'red'
            }
        }
    });

    submit.on('press', function() {
        screen.destroy();
        cb(null, { apikey: apikey.value, pass: pass.value });
    });

    cancel.on('press', function() {
        screen.destroy();
        cb("operation canceled");
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        screen.destroy();
        cb(false);
    });

    screen.render();
};
