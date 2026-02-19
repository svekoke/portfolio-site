const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    index: "./src/index.js",
    news: "./src/news/news.js",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "[name].[contenthash:8].js" : "[name].js", // ← bundle.js → index.js
    clean: true,
  },
  devServer: {
    open: true,
    port: 8080,
    hot: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      chunks: ["index"], // ← ТОЛЬКО index.js для главной
    }),
    new HtmlWebpackPlugin({
      template: "src/news/news.html",
      filename: "news/news.html",
      chunks: ["news"], // ← ТОЛЬКО news.js для страницы новостей
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? "[name].[contenthash:8].css" : "[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/partials", to: "partials" },
        { from: "src/data", to: "data" },
        { from: "src/images", to: "images" },
        { from: "src/fonts", to: "fonts" },
      ],
    }),
    new DefinePlugin({
      "process.env.DEVELOPMENT": !isProduction,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};

module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};
