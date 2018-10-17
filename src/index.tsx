// import * as React from "react";
// import * as ReactDOM from "react-dom";
//
// import { Hello } from "./components/HelloWorldPlugin";
//
// ReactDOM.render(
//     <Hello compiler="TypeScript" framework="React" />,
//     document.getElementById("example")
// );


export class HelloWorldPlugin {
  options: any;

  constructor(options : any) {
    this.options = options;
  }

  apply(compiler : any) {
    compiler.plugin("done", () => {
      console.log("Hello world");
    })
  }
}

// module.exports = HelloWorldPlugin
