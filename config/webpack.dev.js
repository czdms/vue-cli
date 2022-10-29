//开发模式

const path = require("path");
//专门定义环境变量给代码使用
const {DefinePlugin} = require("webpack")
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//处理vue的插件
const { VueLoaderPlugin } = require('vue-loader')


const getStyleLoader = (pre) => {
  return [
    "vue-style-loader",
    "css-loader",
    {
      //处理css兼容性
      //配合package.json中browserlist来制定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugings: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  module: {
    //处理css
    rules: [
      {
        test: /\.css$/,
        use: getStyleLoader(),
      },
      {
        test: /\.less$/,
        use: getStyleLoader("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoader("stylus-loader"),
      },
      //处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      //处理其他资源
      {
        test: /\.(woff2?|ttf)/,
        type: "asset/resource",
      },
      //处理js
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          
        },
      },
      {
        //处理vue的loader
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ],
  },
  //处理html
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      //缓存
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    //调用处理vue文件的插件
    new VueLoaderPlugin(),
    new DefinePlugin({
        //cross-env定义的环境变量给打包工具使用
        //DefinedPlugin定义的环境变量给源代码使用，从而解决vue3页面警告问题
        __VUE_OPTIONS_API__:true,
        __VUE_PROD_DEVTOOLS__:false,
    }),
    
  ],
  mode: "development",
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  //webpack解析模块加载选项
  resolve: {
    //自动补全文件加载名
    extensions: [".vue", ".js", ".json"],
  },
  devServer: {
    host: "localhost",
    //本来是3000的，但是另一个文件用了3000，打开页面会跳转到原本是3000的另一个页面，应该是开起来缓存的问题
    port: 3003,
    open: true,
    hot: true, //开启HMR
    historyApiFallback: true, //解决前端路由刷新404
  },
};
