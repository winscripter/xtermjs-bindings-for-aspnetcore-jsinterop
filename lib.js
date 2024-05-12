class TerminalBinding {
    #instance_
    constructor(instance, name) {
        if (!(instance instanceof Terminal)) throw 'Not a Terminal xterm.js instance';
        this.#instance_ = instance
        this.name = name
    }
    isReallyTerminal() {
        if (!(instance instanceof Terminal)) throw 'Not a Terminal xterm.js instance';
    }
    get instance() { this.isReallyTerminal();
        return this.#instance_
    }
    set instance(val) { if (!(val instanceof Terminal)) throw 'Not a Terminal xterm.js instance';
        this.isReallyTerminal();
        this.#instance_ = val;
    }
    write(text) {
        this.#instance_.write(text);
    }
    getInstance() {
        return this.#instance_
    }
}

const kNormal = "\x1B[0m";
const kRed = "\x1B[31m";
const kGreen = "\x1B[32m";
const kYellow = "\x1B[33m";
const kBlue = "\x1B[34m";
const kMagenta = "\x1B[35m";
const kCyan = "\x1B[36m";
const kWhite = "\x1B[37m";

// colored text example:
// `${kRed}textHere`

const commonTerminalList = [];

function bindTerminal(term) {
    if (!(term instanceof TerminalBinding)) throw 'Illegal terminal type.';
    else commonTerminalList.push(term);
}

function writeText(name, text) {
    findTerminalByName(name)?.write(text);
}

function writeLine(name, text) {
    writeText(name, text + "\n");
}

function findTerminalByName(name) {
    for (let i = 0; i < commonTerminalList.length; i++) {
        if (commonTerminalList[i].name == name) {
            return commonTerminalList[i];
        }
    }
    return undefined;
}

function setCursorBlink(name, value) {
    let terminalInstance = findTerminalByName(name)?.getInstance();
    if (terminalInstance) {
        terminalInstance.options.cursorBlink = value;
    } else {
        console.error('Terminal not found');
    }
}

function formatForXTerm(str) {
    return str.replaceAll("!{white}", kWhite)
            .replaceAll("!{red}", kRed)
            .replaceAll("!{green}", kGreen)
            .replaceAll("!{yellow}", kYellow)
            .replaceAll("!{blue}", kBlue)
            .replaceAll("!{magenta}", kMagenta)
            .replaceAll("!{cyan}", kCyan)
            .replaceAll("!{black}", kNormal)
            .replaceAll("!{default}", kNormal)
            .replaceAll("!{normal}", kNormal);
}

function readLine(name) {
    var term = findTerminalByName(name);
    if (!term) throw 'Illegal terminal.';

    return new Promise((resolve, reject) => {
        let input = "";
        let disposable = term.getInstance().onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
            if (e.domEvent.keyCode === 13) {
                writeText(name, '\r\n');
                resolve(input);
                disposable.dispose();
            } else if (e.domEvent.keyCode === 8) {
                if (input.length != 0) {
                    writeText(name, '\b \b');
                    input = input.slice(0, -1);
                }
            } else if (printable) {
                input += e.key;
                writeText(name, e.key.toString());
            }
        });
    });
}
  
function readKey(name) {
    var term = findTerminalByName(name);
    if (!term) throw 'Illegal terminal.';

    return new Promise((resolve, reject) => {
        let disposable = term.getInstance().onKey(e => {
            writeText(name, e.key.toString());
            resolve(e.key);
            disposable.dispose();
        });
    });
}

