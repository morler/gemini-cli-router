#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const interceptorLoader = path.join(__dirname, 'interceptor-loader.js');

import { spawnSync } from 'child_process';

function findGeminiExecutable() {
    try {
        const result = spawnSync('where', ['gemini'], { stdio: 'pipe', encoding: 'utf-8' });
        if (result.status === 0 && result.stdout.trim()) {
            // Return the first result from 'where'
            return result.stdout.split('\n')[0].trim();
        }
    } catch (error) {
        // ignore
    }
    return null;
}

let geminiCLIPath = findGeminiExecutable();

if (process.env.GEMINI_CLI_PATH) {
    geminiCLIPath = process.env.GEMINI_CLI_PATH;
    console.log(`Using GEMINI_CLI_PATH: ${geminiCLIPath}`)
}

if (!geminiCLIPath) {
    console.error('Could not find the gemini cli executable in your PATH');
    process.exit(1);
}

const args = process.argv.slice(2);
const passthroughIndex = args.indexOf('--passthrough');
let passthrough = false;

if (passthroughIndex > -1) {
    passthrough = true;
    args.splice(passthroughIndex, 1);
}

const debugIndex = args.indexOf('--debug');
let debug = false;
if (debugIndex > -1) {
    debug = true;
    args.splice(debugIndex, 1);
}

const env = {
    ...process.env,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'any_value'
};

if (passthrough) {
    env.GEMINI_PROXY_PASSTHROUGH = 'true';
    console.log('[Proxy] Passthrough mode enabled. Transformations are disabled.');
}

if (debug) {
    env.GEMINI_ROUTER_DEBUG = 'true';
    console.log('[Router] Debug mode enabled. Logging to gemini-cli-router.log');
}

// Determine how to spawn the gemini CLI based on its file type
let spawnArgs = [];
let spawnCommand = 'node';

if (geminiCLIPath.endsWith('.js')) {
    // If it's a JS file, spawn it with node and the interceptor
    spawnArgs = [
        '--import',
        pathToFileURL(interceptorLoader).href,
        geminiCLIPath,
        ...args
    ];
} else {
    // If it's a shell script or executable, execute it through a shell
    // On Windows, use 'cmd' to execute the script
    // The interceptor is loaded via NODE_OPTIONS
    spawnCommand = 'cmd';
    spawnArgs = [
        '/c',
        geminiCLIPath,
        ...args
    ];
    // Set NODE_OPTIONS to preload the interceptor
    env.NODE_OPTIONS = `--import=${pathToFileURL(interceptorLoader).href}`;
}

const child = spawn(spawnCommand, spawnArgs, {
    stdio: 'inherit',
    env: env
});

child.on('exit', (code) => {
    process.exit(code);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Proxy] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
