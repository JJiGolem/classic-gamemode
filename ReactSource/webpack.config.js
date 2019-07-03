var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = {
    entry: "./src/index.js", // входная точка - исходный файл

    devtool: 'source_map',

    output:{
        path: path.resolve(__dirname, '../client_packages/browser/js'),     // путь к каталогу выходных файлов - папка public
        publicPath: '/',
        filename: "build.js"       // название создаваемого файла
    },

    devServer: {
        contentBase: 'public',
        compress: true,
        open: true,
        port: 9000
    },

    plugins: [
        new HtmlWebpackPlugin({
          template: './public/index.html',
        })
    ],

    module:{
        rules:[   //загрузчик для jsx
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options:{
                    presets:["@babel/preset-env", "@babel/preset-react"]    // используемые плагины
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]'
                        },
                    },
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}