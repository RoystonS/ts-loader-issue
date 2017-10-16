This repo exists to demonstrate an odd issue with ts-loader

## Module versions

* ts-loader: 2.3.7
* typescript: 2.5.3
* webpack: 3.7.1

This is an issue on a very large (Angular 2) codebase we have, and is preventing us from getting faster builds with `ts-loader`.

I've managed to get the repro down to 2 files, both under 10 lines.

## Repro
* Clone this repo
* `npm install`
* Run webpack: `webpack --verbose`

e.g.
```
$ webpack --verbose
ts-loader: Using typescript@2.5.3 and /tmp/tsltest/src/tsconfig.json
Hash: 393ff3de3d58f1e0d47c
Version: webpack 3.7.1
Time: 710ms
    Asset     Size  Chunks             Chunk Names
bundle.js  4.21 kB       0  [emitted]  bundle
Entrypoint bundle = bundle.js
chunk    {0} bundle.js (bundle) 1.26 kB [entry] [rendered]
    > bundle [0] ./src/e1.ts 
    [0] ./src/e1.ts 1.15 kB {0} [depth 0] [built]
        [exports: AClass]
    [1] ./src/f1.ts 114 bytes {0} [depth 1] [built]
        [exports: AnEnum]
        [only some exports used: AnInterface]
        harmony import ./f1 [0] ./src/e1.ts 10:0-35

WARNING in ./src/e1.ts
17:61-72 "export 'AnInterface' was not found in './f1'
    at HarmonyImportSpecifierDependency._getErrors (/tmp/tsltest/node_modules/webpack/lib/dependencies/HarmonyImportSpecifierDependency.js:65:15)
    at HarmonyImportSpecifierDependency.getWarnings (/tmp/tsltest/node_modules/webpack/lib/dependencies/HarmonyImportSpecifierDependency.js:39:15)
    at Compilation.reportDependencyErrorsAndWarnings (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:701:24)
    at Compilation.finish (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:559:9)
    at applyPluginsParallel.err (/tmp/tsltest/node_modules/webpack/lib/Compiler.js:506:17)
    at /tmp/tsltest/node_modules/tapable/lib/Tapable.js:289:11
    at _addModuleChain (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:505:11)
    at processModuleDependencies.err (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:475:14)
    at _combinedTickCallback (internal/process/next_tick.js:67:7)
    at process._tickCallback (internal/process/next_tick.js:98:9)

WARNING in ./src/e1.ts
17:92-103 "export 'AnInterface' was not found in './f1'
    at HarmonyImportSpecifierDependency._getErrors (/tmp/tsltest/node_modules/webpack/lib/dependencies/HarmonyImportSpecifierDependency.js:65:15)
    at HarmonyImportSpecifierDependency.getWarnings (/tmp/tsltest/node_modules/webpack/lib/dependencies/HarmonyImportSpecifierDependency.js:39:15)
    at Compilation.reportDependencyErrorsAndWarnings (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:701:24)
    at Compilation.finish (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:559:9)
    at applyPluginsParallel.err (/tmp/tsltest/node_modules/webpack/lib/Compiler.js:506:17)
    at /tmp/tsltest/node_modules/tapable/lib/Tapable.js:289:11
    at _addModuleChain (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:505:11)
    at processModuleDependencies.err (/tmp/tsltest/node_modules/webpack/lib/Compilation.js:475:14)
    at _combinedTickCallback (internal/process/next_tick.js:67:7)
    at process._tickCallback (internal/process/next_tick.js:98:9)
```

It looks like the harmony importer is failing to find an import which is actually an interface.

## Minimal Repro Details

I've managed to reduce this down from the many thousands of files in our codebase.  It seems to require a combination of _all_ of the following:

* ts-loader `transpileOnly` set to `true`
* Import of an interface (or a TS `type`) - something that is _only_ type information
* Export of something concrete from the module exporting the interface
* The imported interface being used in a decorated class (with tsconfig `emitDecoratorMetadata` set to `true`)
