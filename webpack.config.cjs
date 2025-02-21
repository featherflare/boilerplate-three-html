const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    main: './src/js/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder on each build
    assetModuleFilename: 'assets/[name][ext]',
  },

  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,
    port: 3000, // Webpack Dev Server will run on port 3000
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        generator: {
          filename: 'assets/styles/[name][ext]', // CSS files inside `dist/assets/styles/`
        },
      },
      {
        test: /\.scss$/, // SCSS handling
        use: [
          'style-loader', // Inject CSS into DOM
          'css-loader', // Resolve CSS imports
          'sass-loader', // Compile SCSS to CSS
        ],
        generator: {
          filename: 'assets/styles/[name][ext]', // CSS files inside `dist/assets/styles/`
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Handle assets like images
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]', // Images inside `dist/assets/images/`
        },
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/, // GLSL support
        use: [
          {
            loader: 'raw-loader', // Loads GLSL as raw text
          },
          {
            loader: 'glslify-loader', // Allows use of glslify syntax
          },
        ],
        generator: {
          filename: 'assets/shader/[name][ext]', // GLSL files inside `dist/assets/shader/`
        },
      },
      {
        test: /\.(hdr)$/, // HDR support
        type: 'asset/resource',
        generator: {
          filename: 'assets/hdr/[name][ext]', // HDR files go inside `dist/assets/hdr/`
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      favicon: 'src/favicon.ico',
      chunks: ['main'],
    }),
  ],
  devtool: 'source-map', // Enable source maps for easier debugging
}
