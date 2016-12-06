//bug: webpack-hot-server only supports filename as get_path. output.path is ignored.

let webpack = require('webpack');
let path = require("path");
let WriteFilePlugin	= require('write-file-webpack-plugin');
require("babel-polyfill");

module.exports = {
	entry: {
		main:[ //'webpack-dev-server/client?http://localhost:8080',  'webpack/hot/only-dev-server', 
			'babel-polyfill', "./src/index.jsx"]
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].js"
	},
	devServer: {
		outputPath: path.join(__dirname, 'build'),
		filename: "[name].js"
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loaders: [ 'babel'], exclude: /node_modules/ },
			{ test: /\.js$/,  exclude: /node_modules/, loader: 'babel-loader'},
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.less$/, loader:"style!css!less"}
		]
	},
	resolve:{
		extensions:['', '.js', '.json', '.jsx']
	},
	plugins: [
		//--hot enables hot plugin.
		//new webpack.optimize.UglifyJsPlugin({compress:{warnings:0}, output:{comments:0}}),
		new webpack.NoErrorsPlugin(),
		new WriteFilePlugin()
	]
};
