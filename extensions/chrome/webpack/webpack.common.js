import path from "path"
import { fileURLToPath } from "url"

import CopyPlugin from "copy-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: {
    // popup: path.resolve(__dirname, '..', 'src', 'popup', 'index.tsx'), //popup is not being developed yet
    background: path.resolve(__dirname, "..", "src", "background", "index.ts"),
    content: path.resolve(__dirname, "..", "src", "content", "index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "..", "tsconfig.json"),
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, "..", "postcss.config.cjs"),
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "..", "src"),
    },
  },
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "..", "public"),
          to: path.resolve(__dirname, "..", "dist"),
        },
      ],
    }),
  ],
}
