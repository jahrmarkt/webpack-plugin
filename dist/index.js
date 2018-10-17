/// <reference types="webpack" />
class HelloWorldPlugin extends Plugin {
    constructor() {
        super();
    }
    apply(compiler) {
        compiler.plugin("done", () => {
            console.log(compiler);
        });
    }
}
module.exports = HelloWorldPlugin;
//# sourceMappingURL=index.js.map