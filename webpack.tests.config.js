var hostname = 'localhost';
var port = '3000';

module.exports = {
    entry: 'mocha!./test/pageturner.test.js',
    devtool: 'source-map',
    output: {
        path: './test/',
        filename: 'test.build.js',
        sourceMapFilename: "test.map.js",
        publicPath: 'http://' + hostname + ':' + port + '/tests'
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }]
    },
    devServer: {
        host: hostname,
        port: port
    }
};
