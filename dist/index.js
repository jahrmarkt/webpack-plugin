"use strict";
// import * as React from "react";
// import * as ReactDOM from "react-dom";
//
// import { Hello } from "./components/HelloWorldPlugin";
//
// ReactDOM.render(
//     <Hello compiler="TypeScript" framework="React" />,
//     document.getElementById("example")
// );
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
// module.exports = HelloWorldPlugin
//# sourceMappingURL=index.js.map