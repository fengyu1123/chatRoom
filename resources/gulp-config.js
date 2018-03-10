/**
 * Created by Txm on 2017/11/3.
 * 配置gulp任务PC端和移动端
 */

module.exports = {
    env: "base", // 用于切换工作环境
    base: {
        folder: "base",
        webpack: function (PAGE_SCRIPT_PATH) {
            return {
                entry: {
                    // 测试
                    index: PAGE_SCRIPT_PATH + "/index.js",
                },
                output: {
                    filename: "[name].js"
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            loader: "babel-loader?presets=env",
                        }
                    ]
                },
                externals: {
                    SystemJS: "SystemJS",
                    jquery: "jQuery",
                    layer: "layer",
                    Vue: 'Vue',
                },
            }
        }
    },

};
