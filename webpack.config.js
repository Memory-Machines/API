/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const NodemonPlugin = require('nodemon-webpack-plugin');
const packageJson = require('./package.json');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const revision = execSync('git rev-parse HEAD')
  .toString()
  .trim();

module.exports = (env = {}) => {
  const config = {
    entry: {
      server: './src/server.ts',
    },
    mode: env.development ? 'development' : 'production',
    target: 'node',
    devtool: env.development ? 'eval-cheap-module-source-map' : 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    externals: nodeModules,
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules', 'src'],
    },
    stats: {
      modules: false, // We don't need to see this
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        APP_VERSION: JSON.stringify(packageJson.version),
        APP_GIT_VERSION: JSON.stringify(revision),
      }),
    ],
  };

  if (env.nodemon) {
    config.watch = true;
    config.plugins.push(
      new NodemonPlugin({
        script: './dist/server.js',
      })
    );
  }

  if (env.analyse) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      })
    );
  }

  return config;
};
