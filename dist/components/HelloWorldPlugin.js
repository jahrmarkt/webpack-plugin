"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelloWorldPlugin = /** @class */ (function () {
    function HelloWorldPlugin(options) {
        this.options = options;
    }
    HelloWorldPlugin.prototype.apply = function (compiler) {
        compiler.plugin("done", function () {
            console.log("Hello world");
        });
    };
    return HelloWorldPlugin;
}());
exports.HelloWorldPlugin = HelloWorldPlugin;
module.exports = HelloWorldPlugin;
//# sourceMappingURL=HelloWorldPlugin.js.map