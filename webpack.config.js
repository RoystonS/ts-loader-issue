const webpack = require("webpack");
const path = require("path");

const config = {
  entry: {
    bundle: "./src/e1"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  output: {
    path: path.resolve("build"),
    filename: "[name].js"
  }
};

module.exports = config;
