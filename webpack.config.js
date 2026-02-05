const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Добавление плагина для копирования файлов

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.js", // Поменяйте на свой файл, если нужно
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    open: true,
    host: "localhost",
    watchFiles: ["src/**/*.html"],
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html", // Убедитесь, что путь к вашему HTML-файлу правильный
    }),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/partials", to: "partials" },
        { from: "src/images", to: "images" }, // Копируем изображения в папку dist/images
        { from: "src/fonts", to: "fonts" }, // Копируем шрифты в dist/fonts
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
        exclude: ["/node_modules/"],
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
                includePaths: ["src/scss"], // Убедитесь, что путь к SCSS правильный
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
        type: "asset/resource", // Обработка изображений и шрифтов
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  optimization: {
    minimize: true,
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
