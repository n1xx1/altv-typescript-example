/*
Project folder structure:
- src
  - client
    - @types
      - ...
    - tsconfig.json
    - index.ts
    - ... 
  - server
    - @types
      - ...
    - tsconfig.json
    - index.ts
    - ... 
  - render 
    - tsconfig.json
    - myview1.view.tsx
    - myview2.view.tsx
    - ...

Generated files:
- build
  - render
    - view_myview1.html
    - view_myview1.js
    - view_myview2.html
    - view_myview2.js
    - ...
  - client.mjs
  - server.mjs
*/

const WrapperPlugin = require("wrapper-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const resolve = require("resolve");
const glob = require("glob");

const viewFiles = glob.sync("**/*.view.tsx", { cwd: path.resolve("./src/render"), absolute: true });
const renderEntries = Object.assign({}, ...viewFiles.map(f => {
    const name = path.parse(f).base.replace(/\.view\.tsx$/, "");
    return {[`view_${name}`]: f};
}));

const notResolved = {};

let mainConfig;
module.exports = (env, argv) => [mainConfig = {
    mode: "development",
    devtool: "",
    entry: {
        client: path.resolve("./src/client/index.ts"),
        server: path.resolve("./src/server/index.ts"),
    },
    output: {
        filename: "[name].mjs",
        path: path.resolve(__dirname, "build"),
    },
    target: "node",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    externals: function(context, request, callback) {
        resolve(request, { basedir: context }, (err) => {
            if (err === null) {
                callback();
                return;
            }
            const sortedEntries = Object.entries(mainConfig.entry).sort(([apath], [bpath]) => bpath.localeCompare(apath));
            for (const [id, entryPath] of sortedEntries) {
                if (!isPathInside(path.parse(entryPath).dir, context)) {
                    continue;
                }
                if (notResolved[id] === undefined) {
                    notResolved[id] = [];
                }
                if (notResolved[id].indexOf(request) === -1) {
                    notResolved[id].push(request);
                }
                callback(null, request, "root");
                return;
            }
            if (request === "alt") {
                // alt in dependencies
                callback(null, request, "root");
                return;
            }
            callback();
        });
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: path.join(__dirname, "./src/client"),
                use: tsLoader("client"),
            },
            {
                test: /\.ts$/,
                include: path.join(__dirname, "./src/server"),
                use: tsLoader("server"),
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WrapperPlugin({
            header: (filename) => {
                for (const [id] of Object.entries(mainConfig.entry)) {
                    const expectedName = mainConfig.output.filename.replace("[name]", id);
                    const expectedFile = path.join(mainConfig.output.path, expectedName);

                    const file = path.join(mainConfig.output.path, filename);

                    if (path.resolve(expectedFile) !== path.resolve(file)) {
                        continue;
                    }
                    if (notResolved[id] !== undefined) {
                        return notResolved[id].map(x => `import * as ${x} from "${x}";\n`).join("");
                    }
                }
                return "";
            },
        }),
    ],
}, {
    mode: "development",
    devtool: "",
    entry: {
        ...renderEntries,
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].bundle.js",
        path: path.resolve(__dirname, "build/render"),
    },
    externals: {
        alt: "alt",
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, "./src/render"),
                use: tsLoader("render"),
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                include: path.join(__dirname, "./src/render"),
                use: { 
                    loader: "file-loader",
                    options: {
                        outputPath: "render",
                    },
                },
            },
            {
                test: /\.s[ac]ss$/,
                include: path.join(__dirname, "./src/render"),
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/,
                include: path.join(__dirname, "./src/render"),
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    "css-loader",
                ],
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[contenthash].css",
        }),
        ...Object.keys(renderEntries).map(entry => {
            const plugin = new HtmlWebpackPlugin({
                inject: true,
                templateContent,
                filename: `${entry}.html`,
            });
            plugin.filterChunks = (chunks) => {
                return chunks.filter(chunk => chunk.id.indexOf(entry) > -1);
            };
            return plugin;
        }),
    ]
}];

const templateContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <div id="wrapper"></div>
</body>
</html>`;

function tsLoader(kind) {
    return {
        loader: "ts-loader",
        options: {
            instance: kind,
            configFile: path.join(__dirname, `./src/${kind}/tsconfig.json`),
        },
    };
}

function isPathInside(parent, dir) {
    const relative = path.relative(parent, dir);
    return relative == "" || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
