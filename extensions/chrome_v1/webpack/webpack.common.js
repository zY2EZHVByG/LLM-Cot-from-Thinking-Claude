import path from "path"
import { fileURLToPath } from "url"

import CopyPlugin from "copy-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: {
    // popup: path.resolve(__dirname, '..', 'src', 'popup', 'index.tsx'), //popup is not being developed yet
    // background: path.resolve(__dirname, '..', 'src', 'background', 'index.ts'), //background is not being developed yet
    content: path.resolve(__dirname, "..", "src", "content", "index.tsx"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
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
