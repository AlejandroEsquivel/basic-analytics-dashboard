const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const PORT = 9182;

const env = {
  API_HOST: process.env.API_HOST || 'localhost:8080'
}

let config = {
  entry: [
    path.resolve(__dirname, 'app/Main.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'app'),
    //watchContentBase: true,
    port: PORT,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1500
            }
          }
        ]
      },
      {
        test: /\.exec\.js$/,
        use: [ 'script-loader' ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(Object.keys(env).reduce((acc,key)=>{
      acc[`process.env.${key}`]  = JSON.stringify(env[key]);
      return acc;
    },{}))
  ],
};

if(isProduction){
  const productionPlugins = [
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/main.css', to: 'main.css' }
    ])
  ]
  productionPlugins.forEach(plugin=>config.plugins.push(plugin));
}
else {
  const developmentPlugins = [
    new webpack.HotModuleReplacementPlugin()
  ];

  developmentPlugins.forEach(plugin=>config.plugins.push(plugin));
}

module.exports = config;