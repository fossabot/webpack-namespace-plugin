var fs = require("fs");

const pluginName = 'IncludeExportNamespacePlugin';

class IncludeExportNamespacePlugin {

    constructor(options) {
        this.namespace = options && options.namespace;
        this.entryDtsPath = options && options.entryDtsPath;
    }

    getNamespace(compilerOptionsOutput) {
        // If namespace is set from options, use that
        if (this.namespace) {
            return this.namespace;
        }

        // Otherwise, get from compiler options
        return compilerOptionsOutput.library;
    }

    getEntryDtsPath(compilerOptionsOutput) {
        // If path is set from options, use that
        if (this.entryDtsPath) {
            return this.entryDtsPath;
        }

        // Otherwise, infer from compiler options
        const inferredEntryDtsPath =
            "." +
            compilerOptionsOutput.publicPath +
            compilerOptionsOutput.filename.replace(/.js/, ".d.ts");
        return inferredEntryDtsPath;
    }

    apply(compiler) {
        const compilerOptionsOutput = compiler.options.output;

        if (compilerOptionsOutput.libraryTarget === "umd") {
            compiler.hooks.afterEmit.tap(pluginName, compilation => {
                const namespace = this.getNamespace(compilerOptionsOutput);
                const entryDtsPath = this.getEntryDtsPath(compilerOptionsOutput);

                if (fs.existsSync(entryDtsPath)) {
                    fs.appendFileSync(entryDtsPath, `export as namespace ${namespace};`);
                    console.log(`${pluginName}: patch successful!`);
                    console.log(`${pluginName}: namespace: ${namespace}`);
                    console.log(`${pluginName}: path: ${entryDtsPath}`);
                }
                else {
                    console.error(`${pluginName}: could not find entry .d.ts file.`);
                    console.error(`${pluginName}: path was: ${entryDtsPath}`);
                }
            });
        }
        else {
            console.warn(`${pluginName}: plugin is included but output is not UMD.`);
        }
    }
}

module.exports = IncludeExportNamespacePlugin;
