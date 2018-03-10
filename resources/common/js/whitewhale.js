/**
 * Created by Txm on 2017/6/21.
 * 封装客户端的webview接口
 *
 */
let $ = require("jquery");
let deviceOS = require("./checkOS.js");

// window.onerror = function (e) {
//     alert(e);
// };

let WhiteWhale;

/*===========客户端接口适配============*/
let { isAndroid, isIOS } = deviceOS;
try {
    if (isAndroid){
        // whitewhale是Android客户端注入的全局对象
        WhiteWhale = whitewhale;
    }else if(isIOS) {
        // messageHandlers是IOS客户端注入的全局对象
        WhiteWhale = window.webkit.messageHandlers;
    }
} catch (e) {
    console.log("whitewhale不存在");
}

// 接口适配器
function clientAdapter(){
    let api = arguments[0],
        params = [];

    if (arguments.length > 1){
        params = Array.prototype.slice.call(arguments, 1);
    }

    if (isAndroid){
        // android需要保证参数的顺序
        let opts = [];
        params.forEach(item=>{
            for(let key in item){
                if(item.hasOwnProperty(key)){
                    opts.push(item[key]);
                }
            }
        });

        api.apply(WhiteWhale, opts);

    }else if (isIOS){
        // ios接受dist类型的参数
        let opts = {};
        params.forEach(item=>{
            Object.assign(opts, item);
        });

        api.postMessage.call(api, opts)
    }
}

/*===========客户端接口============*/
// 模块
let whitewhaleModule = {};

// 关闭webview
whitewhaleModule.closeWebview = (el) => {
    $(el).on("click", function () {
        clientAdapter(WhiteWhale.closeWebview);
    });
};


// 分享到 QQ, 朋友圈, 微信, QQ空间, 微博
// index对应客户端分享类型
let shareTypes = ["shareToWeibo", "shareToWechat", "shareToQQ", "shareToQZone", "shareToMoments"];
shareTypes.forEach((item, index) => {
    let type = index + 1;
    // * el: 触发元素
    // * title: 分享标题
    // * desc: 分享描述
    // * shareIcon: 图标路径
    // * shareUrl：跳转链接

    whitewhaleModule[item] = function (opts) {

        let {title, desc, shareIcon, shareUrl} = opts;

        try {
            clientAdapter(WhiteWhale.shareApp, {type}, {title}, {desc}, {shareIcon}, {shareUrl});
        } catch (e) {
            console.log("分享发生错误~");
        }
    };
});
// 批量分享的快捷方式
whitewhaleModule.shareApp = function (el, opts) {

    $(el).each(function () {
        let $btn = $(this),
            $share = $(".base");

        // 显示分享
        $btn.on("click", function () {
            $share.addClass("active");
        });

        let $shareItems = $(".share_item"),
            $shareClose = $(".share_ft");

        $shareItems.on("click", function () {
            let type = $(this).data("type") - 1;

            // 根据配置调用对应的分享方法
            let key = shareTypes[type];
            whitewhaleModule[key](opts[key]);

            $share.removeClass("active");
            return false;
        });

        $share.on("click", function () {
            $share.removeClass("active");
            return false;
        })
    });
};
module.exports = whitewhaleModule;
