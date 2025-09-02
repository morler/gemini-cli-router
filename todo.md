# TODOs for `gemini-cli-router`

## Fix Windows ESM URL Scheme Error

- [x] Import `pathToFileURL` from the `url` module in `cli.js`
- [x] Convert the `interceptorLoader` path to a proper `file://` URL using `pathToFileURL(interceptorLoader).href`
- [x] Use the converted URL in the `spawn` call with `--import` flag instead of the raw path

## Diagnose `npm install --prefix gemini-cli-router` Failure

- [x] Check `package.json` for syntax errors
- [x] Test network connectivity to npm registry
- [x] Verify user permissions for the `gemini-cli-router` directory (assumed not an issue)
- [x] Confirm Node.js and npm versions are compatible
- [x] Ensure the `gemini-cli-router` path is correct and exists (successful with full path)
- [x] **Analysis**: The installation was successful when using the full path `D:\Code\MyProject\gemini-cli-router`. This indicates the original failure was likely due to an incorrect or relative path being used in the `npm install --prefix` command.

## Fix Global Installation Issue (Fork Project)

- [x] **Root Cause**: The published version of `@zhifac/gemini-cli-router` on npm is outdated and does not include the fix for the Windows ESM URL scheme error.
- [x] **Constraint**: Cannot publish to npm due to it being a fork project.
- [x] **Task**: Document the installation process using source code.
- [x] **Task**: Provide clear instructions on how to clone the repository, install dependencies, and link the package globally using `npm link`.
- [x] **Task**: Update `README.md` with these instructions.

## Fix `npm install --prefix gemini-cli-router` Error

- [x] **Root Cause**: The `npm install --prefix gemini-cli-router` command was looking for a `gemini-cli-router/gemini-cli-router/package.json` file which does not exist.
- [x] **Task**: Update the `README.md` to use `cd gemini-cli-router && npm install` instead of `npm install --prefix gemini-cli-router`.
- [x] **Task**: Verify the updated instructions work correctly.

## Fix `npm link` Installation Issue

- [x] **Root Cause**: Running `gemini-cli-router` after `npm link` results in an `ERR_MODULE_NOT_FOUND` error for the `gemini` module. This is because the `cli.js` script is looking for the `gemini` executable, but when `GEMINI_CLI_PATH` is set to the shell script (`D:\\Dev\
odejs\\gemini`), Node.js tries to execute it as JavaScript, leading to a syntax error.
- [x] **Task**: Modify the `cli.js` script to correctly handle the case where `GEMINI_CLI_PATH` points to a shell script. It should spawn the shell script directly, not try to execute it as JavaScript.
- [x] **Task**: Test the fix by setting `GEMINI_CLI_PATH` to the shell script and running `gemini-cli-router --help`.
- [x] **Task**: Update the `README.md` with any necessary instructions or troubleshooting steps.