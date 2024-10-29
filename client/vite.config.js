import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/


/**
 * Configures the Vite application with various plugins.
 *
 * This function is the default export of the Vite configuration file. It takes the current Vite mode as a parameter and returns a Vite configuration object.
 *
 * The function first calls the `setEnv` function to set the environment variables for the application. It then returns an object with a `plugins` property, which is an array of Vite plugins to be used in the application.
 *
 * The plugins included in the configuration are:
 * - `react()`: A plugin that provides support for React.
 * - `tsconfigPaths()`: A plugin that resolves TypeScript paths based on the `tsconfig.json` file.
 * - `envPlugin()`: A custom plugin that exposes environment variables to the client code.
 * - `devServerPlugin()`: A custom plugin that configures the development server.
 * - `sourcemapPlugin()`: A custom plugin that configures source maps.
 * - `basePlugin()`: A custom plugin that configures the base URL of the application.
 * - `importPrefixPlugin()`: A custom plugin that adds a prefix to imported modules.
 * - `htmlPlugin(mode)`: A custom plugin that configures the HTML template for the application.
 *
 * @param {object} param0 - An object containing the current Vite mode.
 * @param {string} param0.mode - The current Vite mode.
 * @returns {object} - A Vite configuration object.
 */
export default defineConfig(({ mode }) => {
    setEnv(mode);
    return {
        plugins: [
            react(),
            tsconfigPaths(),
            envPlugin(),
            devServerPlugin(),
            sourcemapPlugin(),
            basePlugin(),
            importPrefixPlugin(),
            htmlPlugin(mode),
        ],
    };
});


/**
 * A function that sets the environment variables for the Vite application.
 *
 * The function reads the following environment variables:
 * - `REACT_APP_*`: Any environment variables prefixed with `REACT_APP_`.
 * - `NODE_ENV`: The current Node.js environment.
 * - `PUBLIC_URL`: The public URL of the application.
 *
 * The function then assigns these environment variables to the `process.env` object, and sets the `NODE_ENV` environment variable to the current mode if it is not already set.
 *
 * If the `homepage` field is present in the `package.json` file, the function sets the `PUBLIC_URL` environment variable to the value of the `homepage` field, with any leading or trailing slashes removed.
 *
 * @param {string} mode - The current Vite mode.
 */
function setEnv(mode) {
    Object.assign(process.env, loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]));
    process.env.NODE_ENV ||= mode;
    const { homepage } = JSON.parse(readFileSync("package.json", "utf-8"));
    process.env.PUBLIC_URL ||= homepage
        ? `${homepage.startsWith("http") || homepage.startsWith("/")
            ? homepage
            : `/${homepage}`}`.replace(/\/$/, "")
        : "";
}

// Expose `process.env` environment variables to your client code
// Migration guide: Follow the guide below to replace process.env with import.meta.env in your app.
// You may also need to rename your environment variable to a name that begins with VITE_ instead of REACT_APP_
// https://vitejs.dev/guide/env-and-mode.html#env-variables


/**
 * A Vite plugin that exposes environment variables to the client code.
 *
 * The plugin reads the following environment variables:
 * - `REACT_APP_*`: Any environment variables prefixed with `REACT_APP_`.
 * - `NODE_ENV`: The current Node.js environment.
 * - `PUBLIC_URL`: The public URL of the application.
 *
 * The plugin returns a configuration object with the following properties:
 * - `define`: An object that maps the environment variables to their string-encoded values, which can be used to replace `process.env.*` references in the client code.
 */
function envPlugin() {
    return {
        name: "env-plugin",
        config(_, { mode }) {
            const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
            return {
                define: Object.fromEntries(Object.entries(env).map(([key, value]) => [
                    `process.env.${key}`,
                    JSON.stringify(value),
                ])),
            };
        },
    };
}

// Setup HOST, SSL, PORT
// Migration guide: Follow the guides below
// https://vitejs.dev/config/server-options.html#server-host
// https://vitejs.dev/config/server-options.html#server-https
// https://vitejs.dev/config/server-options.html#server-port


/**
 * A Vite plugin that configures the development server settings, including the host, port, and whether to use HTTPS with custom SSL certificate files.
 *
 * The plugin reads the following environment variables:
 * - `HOST`: The host to use for the development server (default is `"0.0.0.0"`).
 * - `PORT`: The port to use for the development server (default is `"3000"`).
 * - `HTTPS`: Whether to use HTTPS for the development server (default is `"false"`).
 * - `SSL_CRT_FILE`: The path to the SSL certificate file to use for HTTPS.
 * - `SSL_KEY_FILE`: The path to the SSL key file to use for HTTPS.
 *
 * The plugin returns a configuration object with the following properties:
 * - `server`: An object that configures the development server, including the host, port, and whether to use HTTPS with the specified SSL certificate files.
 */
function devServerPlugin() {
    return {
        name: "dev-server-plugin",
        config(_, { mode }) {
            const { HOST, PORT, HTTPS, SSL_CRT_FILE, SSL_KEY_FILE } = loadEnv(mode, ".", ["HOST", "PORT", "HTTPS", "SSL_CRT_FILE", "SSL_KEY_FILE"]);
            const https = HTTPS === "true";
            return {
                server: {
                    host: HOST || "0.0.0.0",
                    port: parseInt(PORT || "3000", 10),
                    open: true,
                    ...(https &&
                        SSL_CRT_FILE &&
                        SSL_KEY_FILE && {
                        https: {
                            cert: readFileSync(resolve(SSL_CRT_FILE)),
                            key: readFileSync(resolve(SSL_KEY_FILE)),
                        },
                    }),
                },
            };
        },
    };
}

// Migration guide: Follow the guide below
// https://vitejs.dev/config/build-options.html#build-sourcemap


/**
 * A Vite plugin that configures the build options, including the output directory, manifest generation, and sourcemap generation.
 *
 * The plugin reads the following environment variable:
 * - `GENERATE_SOURCEMAP`: Whether to generate sourcemaps for the build (default is `"true"`).
 *
 * The plugin returns a configuration object with the following properties:
 * - `build`: An object that configures the build options, including the output directory, manifest generation, and sourcemap generation.
 */
function sourcemapPlugin() {
    return {
        name: "sourcemap-plugin",
        config(_, { mode }) {
            const { GENERATE_SOURCEMAP } = loadEnv(mode, ".", [
                "GENERATE_SOURCEMAP",
            ]);
            return {
                build: {
                    outDir: "build",
                    manifest: true,
                    sourcemap: GENERATE_SOURCEMAP === "true",
                    rollupOptions: {
                        output: {
                            manualChunks: {
                                react: ["react", "react-dom"],
                                "react-router-dom": ["react-router-dom"],
                            }
                        }
                    }
                }
            };
        }
    };
}

// Migration guide: Follow the guide below and remove homepage field in package.json
// https://vitejs.dev/config/shared-options.html#base


/**
 * A Vite plugin that configures the base URL for the application.
 *
 * The plugin reads the following environment variable:
 * - `PUBLIC_URL`: The base URL for the application (default is `"http://localhost:3000/"`).
 *
 * The plugin returns a configuration object with the following properties:
 * - `base`: The base URL for the application.
 */
function basePlugin() {
    return {
        name: "base-plugin",
        config(_, { mode }) {
            const { PUBLIC_URL } = loadEnv(mode, ".", ["PUBLIC_URL"]);
            return {
                base: 'http://localhost:3000/',
            };
        },
    };
}

// To resolve modules from node_modules, you can prefix paths with ~
// https://create-react-app.dev/docs/adding-a-sass-stylesheet
// Migration guide: Follow the guide below
// https://vitejs.dev/config/shared-options.html#resolve-alias


/**
 * A Vite plugin that configures the import path resolution to allow importing modules from node_modules using the `~` prefix.
 *
 * This plugin sets up an alias in the Vite resolver configuration to replace `~` with the appropriate path to the node_modules directory.
 *
 * This can be useful when importing SASS/CSS stylesheets from node_modules, as recommended in the Create React App documentation.
 */
function importPrefixPlugin() {
    return {
        name: "import-prefix-plugin",
        config() {
            return {
                resolve: {
                    alias: [{ find: /^~([^/])/, replacement: "$1" }],
                },
            };
        },
    };
}

// Replace %ENV_VARIABLES% in index.html
// https://vitejs.dev/guide/api-plugin.html#transformindexhtml
// Migration guide: Follow the guide below, you may need to rename your environment variable to a name that begins with VITE_ instead of REACT_APP_
// https://vitejs.dev/guide/env-and-mode.html#html-env-replacement


/**
 * A Vite plugin that replaces environment variables in the index.html file.
 *
 * This plugin uses the `loadEnv` function to load environment variables from the `.env` file, with a prefix of `REACT_APP_`, `NODE_ENV`, or `PUBLIC_URL`.
 *
 * The `transformIndexHtml` hook is used to replace any occurrences of `%{ENV_VARIABLE}%` in the index.html file with the corresponding environment variable value.
 *
 * This can be useful for injecting environment-specific values into the HTML template, such as the base URL for the application.
 *
 * @param {string} mode - The current Vite mode (e.g. 'development', 'production').
 * @returns {object} - A Vite plugin object with the `name` and `transformIndexHtml` properties.
 */

function htmlPlugin(mode) {
    const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
    return {
        name: "html-plugin",
        transformIndexHtml: {
            order: "pre",
            handler(html) {
                return html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match);
            },
        },
    };
}
