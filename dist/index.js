"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const badgeContent = `
import * as React from "react";
import { ComponentSize } from './util/layoutconstants';
import classNames from 'classnames';
import { UIState, BrandingColor } from "../components/util/layoutconstants"

export interface BadgeProps {
  color?: UIState | BrandingColor | "transparent"
  size?: ComponentSize
}

const defaultProps: BadgeProps = {
};


export const Badge: React.StatelessComponent<BadgeProps> = (props) => {
  const classes: string[] = ['re-badge'];

  return (
    <span
      className={classNames(classes)}
    >
      {props.children}
    </span>
  )


};
export default Badger;
Badge.defaultProps = defaultProps;

export default Badge;
export default Badge1;
export default Badge;


sadfasdfasfd
`;
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
    constructor() {
        //  super();
    }
    apply(compiler) {
        compiler.plugin("beforeCompile", () => {
            // var regex = RegExp("export default (class|interface|type )?(\\w+)", "g");
            //
            // console.log(matchAll(badgeContent, regex));
            const dir = "/home/developer/Projects/re-style/src/main";
            const barrelDir = "/home/developer/Projects/re-style/src/main";
            const fileList = this.listFiles(dir, true);
            // console.log(fileList);
            console.log("Files listed");
            this.writeBarrel(barrelDir, dir, fileList);
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
                // console.log("Writing to barrel for " + nameWithoutExt + " (" + file + ")");
                barrelContent += "export { " + exportList + " } from '" + nameWithoutExt + "';\n"; // here write this to file
            }
        }
        //  console.log(barrelContent);
        fs.writeFileSync(outPath + "/barrel2.ts", barrelContent);
    }
    extractExports(content) {
        var exports = [];
        var defaultExportName = "";
        // if (this.once) {
        const defaultResult = matchAll(content, RegExp(`export default (class|interface|type )?(\\w+)`, "g"));
        //console.log(defaultResult);
        if (defaultResult != null && defaultResult != undefined) {
            for (let value of defaultResult) {
                defaultExportName = value;
                exports.push("default as " + value);
            }
            // console.log(defaultResult);
        }
        // const regularResult : string[] = [content.substring(content.search(RegExp(`export (class|interface|type) (\\w+)`)))];
        const regularResult = matchAll(content, RegExp(`export (class|interface|type) (\\w+)`, "g"));
        if (regularResult != null && regularResult != undefined) {
            for (let value of regularResult) {
                if (exports.indexOf(value) != -1 && value != defaultExportName) {
                    exports.push(value);
                }
                else if ((value == "Props" || value == "State") && defaultExportName != "") {
                    exports.push(value + " as " + defaultExportName + value);
                }
            }
        }
        // console.log(regularResult);
        // console.log("Exports");
        // console.log(exports);
        return exports;
    }
}
module.exports = FBarrelPlugin;
//# sourceMappingURL=index.js.map