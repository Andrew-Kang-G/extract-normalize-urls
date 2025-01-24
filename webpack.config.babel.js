const path = require('path');

module.exports = {
	entry: {
		preload: './src/entry.ts',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '../dist/',
		filename: 'url-knife.bundle.js',
		chunkFilename: '[id].bundle.js',
		libraryTarget: 'var',
		library: 'Pattern',
	},
	resolve: {
		extensions: ['.ts', '.js'],
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
};
