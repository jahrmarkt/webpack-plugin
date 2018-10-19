"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
function matchAll(str, regex) {
    var res = [];
    var m;
    if (regex.global) {
        while (m = regex.exec(str)) {
            res.push(m[2]);
        }
    }
    else {
        if (m = regex.exec(str)) {
            res.push(m[2]);
        }
    }
    return res;
}
class FBarrelPlugin {
    constructor(srcPath) {
        this.srcPath = srcPath;
    }
    apply(compiler) {
        compiler.plugin("beforeCompile", () => {
            const dir = this.srcPath;
            const fileList = this.listFiles(dir, true);
            console.log("Files listed");
            this.writeBarrel(this.srcPath, this.srcPath, fileList);
            console.log("Barrel written");
        });
    }
    listFiles(path, recursive) {
        var result = [];
        const fileList = fs.readdirSync(path);
        if (recursive) {
            for (let file of fileList) {
                const fullPath = path + "/" + file;
                if (fs.lstatSync(fullPath).isDirectory()) {
                    console.log("Scanning folder: " + file);
                    const recResult = this.listFiles(fullPath, true);
                    result = result.concat(recResult);
                }
                else {
                    result.push(fullPath);
                }
            }
        }
        else {
            result = fileList.map((x) => { return path + "/" + x; });
        }
        return result;
    }
    writeBarrel(outPath, path, files) {
        var barrelContent = "";
        for (let file of files) {
            if (!file.endsWith(".tsx") || file.includes("barrel.ts")) {
                continue;
            }
            //read content of file
            var fileContent = fs.readFileSync(file).toString();
            // extract Exports
            var exports = this.extractExports(fileContent);
            var sortedExports = exports.sort();
            // write exports to file
            var exportList = "";
            var i = 0;
            for (let ex of sortedExports) {
                if (i == 0) {
                    exportList = ex;
                }
                else {
                    exportList += ", " + ex;
                }
                i++;
            }
            if (exportList != "") {
                var nameWithoutExt = "." + file.substring(path.length, file.length - 4); // cut .tsx from filename and path from src/main
                console.log("Writing to barrel for " + nameWithoutExt + " (" + file + ")");
                barrelContent += "export { " + exportList + " } from '" + nameWithoutExt + "';\n"; // here write this to file
            }
        }
        fs.writeFileSync(outPath + "/barrel.ts", barrelContent);
    }
    extractExports(content) {
        var exports = [];
        var defaultExportName = "";
        const defaultResult = matchAll(content, RegExp(`export default (class|interface|type )?(\\w+)`, "g"));
        if (defaultResult != null && defaultResult != undefined) {
            for (let value of defaultResult) {
                defaultExportName = value;
                exports.push("default as " + value);
            }
        }
        const regularResult = matchAll(content, RegExp(`export (class|interface|type) (\\w+)`, "g"));
        if (regularResult != null && regularResult != undefined) {
            for (let value of regularResult) {
                if (exports.indexOf(value) == -1 && value != defaultExportName) {
                    if (value != "Props" && value != "State") {
                        exports.push(value);
                    }
                    else if ((value == "Props" || value == "State") && defaultExportName != "") {
                        exports.push(value + " as " + defaultExportName + value);
                    }
                }
            }
        }
        return exports;
    }
}
module.exports = FBarrelPlugin;
//# sourceMappingURL=index.js.map