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
    getInstance() {
        return this.#instance_
    }
}
