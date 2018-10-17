
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

module.exports = HelloWorldPlugin
