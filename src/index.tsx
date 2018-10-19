import {Compiler} from "webpack"
const path = require('path');
const fs = require('fs');



function matchAll(str:string, regex:RegExp) {
    var res = [];
    var m;
    if (regex.global) {
        while (m = regex.exec(str)) {
            res.push(m[2]);
        }
    } else {
        if (m = regex.exec(str)) {
            res.push(m[2]);
        }
    }
    return res;
}


class FBarrelPlugin {

  constructor() {
  //  super();
  }

  apply(compiler : Compiler) {
    compiler.plugin("beforeCompile", () => {

      const dir = "/home/developer/Projects/re-style/src/main";
      const barrelDir = "/home/developer/Projects/re-style/src/main";
      const fileList = this.listFiles(dir, true)
      console.log("Files listed");
      this.writeBarrel(barrelDir, dir,fileList);
      console.log("Barrel written");
    })
  }


  listFiles(path:string, recursive:boolean) : string[] {
    var result:string[] = [];
    const fileList = fs.readdirSync(path);
    if (recursive) {
      for (let file of fileList) {
        const fullPath : string = path+"/"+file;
        if (fs.lstatSync(fullPath).isDirectory()) {
          console.log("Scanning folder: " + file);
          const recResult = this.listFiles(fullPath, true);
          result = result.concat(recResult);
        } else {
          result.push(fullPath);
        }
      }
    } else {
      result = fileList.map((x:string) => {return path+"/"+x;})
    }
    return result;
  }

  writeBarrel(outPath:string, path:string, files:string[]) {
      var barrelContent = "";

      for (let file of files) {
        if (!file.endsWith(".tsx") || file.includes("barrel.ts")) {continue}

        //read content of file
        var fileContent:string = fs.readFileSync(file).toString()
        // extract Exports
        var exports : string[] = this.extractExports(fileContent);
        var sortedExports : string[] = exports.sort();
        // write exports to file
        var exportList : string = "";
        var i:number = 0;

        for (let ex of sortedExports) {
          if (i == 0) {
            exportList = ex;
          } else {
            exportList += ", " + ex;
          }
          i++;
        }

        if (exportList != "") {
            var nameWithoutExt : string = "." + file.substring(path.length, file.length-4)  // cut .tsx from filename and path from src/main
            console.log("Writing to barrel for " + nameWithoutExt + " (" + file + ")");
            barrelContent += "export { " + exportList + " } from '" + nameWithoutExt + "';\n";  // here write this to file
        }

      }
    fs.writeFileSync(outPath+ "/barrel.ts", barrelContent);
  }


  extractExports(content:string) : string[] {
    var exports : string[] = [];
    var defaultExportName : string = "";

    const defaultResult : string[] = matchAll(content,RegExp(`export default (class|interface|type )?(\\w+)`, "g"));

    if (defaultResult != null && defaultResult != undefined) {
      for (let value of defaultResult) {
        defaultExportName = value;
        exports.push("default as " + value);
      }
    }

    const regularResult : string[] = matchAll(content,RegExp(`export (class|interface|type) (\\w+)`, "g"));

    if (regularResult != null && regularResult != undefined) {
      for (let value of regularResult) {
        if (exports.indexOf(value) == -1 && value != defaultExportName) {
          if (value != "Props" && value != "State") {
            exports.push(value);
          } else if ((value == "Props" || value == "State") && defaultExportName != "") {
            exports.push(value + " as " + defaultExportName+value);
          }
        }
      }
    }

    return exports;
  }
}

module.exports = FBarrelPlugin;
