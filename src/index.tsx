
/// <reference types="webpack" />

class HelloWorldPlugin {

  constructor() {
  //  super();
  }

  apply(compiler : webpack.Compiler) {
    compiler.plugin("done", () => {
      console.log(compiler);
    })
  }
}

module.exports = HelloWorldPlugin;
