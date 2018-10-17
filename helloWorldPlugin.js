
class HelloWorldPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin("done", () => {
      console.log("Hello world");
    })
  }
}

module.exports = HelloWorldPlugin
