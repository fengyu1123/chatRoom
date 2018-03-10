/**
 * Created by Txm on 2017/12/14.
 */
let SystemJS = require("SystemJS");


function cdn(url) {
    return `//imgdh.doufu.la/${url}`;
}

SystemJS.config({
    map: {
        jquery: cdn('jquery/jquery-3.2.1.min.js'), // jquery
        layer: "http://img.duihua.doufu.la/layer/layer.js", // layer弹窗
        swiper: cdn('swiper/swiper.min.js'), // 轮播图swiper
        lazysizes: cdn('lazysizes.min.js'), // 图片懒加载

        vue: 'https://cdn.bootcss.com/vue/2.4.4/vue.js',
        clipboard: "http://img.duihua.doufu.la/clipboard/clipboard.min.js", // 复制
        velocity: "http://img.duihua.doufu.la/jquery/velocity.min.js", // jquery动画
        // axios: 'https://cdn.bootcss.com/axios/0.16.2/axios.js',
        // _: 'https://cdn.bootcss.com/underscore.js/1.8.3/underscore.js',

    },
    depCache: {
        // layer: ['jquery'],
        velocity: ['jquery']
    }
});

module.exports = SystemJS;