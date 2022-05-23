module.exports = {
    lintOnSave: false,
    devServer: {
        port: 8000, // 端口号
        // https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        hotOnly: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
