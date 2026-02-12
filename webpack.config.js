const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: {
    index: "./src/index.js",
    news: "./src/news/news.js",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 8080,
    hot: true,
    watchFiles: ["src/**/*"],
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  plugins: [
    // Главная страница
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),

    // Страница новости
    new HtmlWebpackPlugin({
      template: "src/news/news.html",
      filename: "news/news.html",
      chunks: ["news"],
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "src/partials", to: "partials" },
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
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};
